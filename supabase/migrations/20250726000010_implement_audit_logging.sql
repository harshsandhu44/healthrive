-- Implement comprehensive audit logging for HIPAA compliance
-- This migration creates audit trails for all patient data access and modifications

-- Create audit log table for HIPAA compliance
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')),
    old_values JSONB,
    new_values JSONB,
    user_id TEXT NOT NULL,
    org_id TEXT,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient audit log queries
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user_org ON audit_log(user_id, org_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- Enable RLS on audit log (users can only see their own organization's audit logs)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read audit logs for their organization
CREATE POLICY "Organization scoped audit log access" ON audit_log
    FOR SELECT USING (
        org_id = auth.jwt() ->> 'org_id' OR 
        user_id = auth.jwt() ->> 'sub'
    );

-- RLS Policy: Only the system can insert audit logs
CREATE POLICY "System can insert audit logs" ON audit_log
    FOR INSERT WITH CHECK (true);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    user_id_val TEXT;
    org_id_val TEXT;
    ip_addr INET;
    user_agent_val TEXT;
    session_id_val TEXT;
BEGIN
    -- Extract user information from JWT
    user_id_val := auth.jwt() ->> 'sub';
    org_id_val := auth.jwt() ->> 'org_id';
    
    -- Get additional context (if available from request)
    ip_addr := inet_client_addr();
    user_agent_val := current_setting('request.headers', true)::json ->> 'user-agent';
    session_id_val := current_setting('request.headers', true)::json ->> 'x-session-id';
    
    -- Handle different trigger operations
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (
            table_name, record_id, action, new_values, 
            user_id, org_id, ip_address, user_agent, session_id
        ) VALUES (
            TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW),
            user_id_val, org_id_val, ip_addr, user_agent_val, session_id_val
        );
        RETURN NEW;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Only log if there are actual changes
        IF OLD IS DISTINCT FROM NEW THEN
            INSERT INTO audit_log (
                table_name, record_id, action, old_values, new_values,
                user_id, org_id, ip_address, user_agent, session_id
            ) VALUES (
                TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW),
                user_id_val, org_id_val, ip_addr, user_agent_val, session_id_val
            );
        END IF;
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (
            table_name, record_id, action, old_values,
            user_id, org_id, ip_address, user_agent, session_id
        ) VALUES (
            TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD),
            user_id_val, org_id_val, ip_addr, user_agent_val, session_id_val
        );
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log SELECT operations (called manually from application)
CREATE OR REPLACE FUNCTION log_patient_access(patient_id TEXT, access_type TEXT DEFAULT 'view')
RETURNS VOID AS $$
DECLARE
    user_id_val TEXT;
    org_id_val TEXT;
    ip_addr INET;
    user_agent_val TEXT;
    session_id_val TEXT;
BEGIN
    -- Extract user information from JWT
    user_id_val := auth.jwt() ->> 'sub';
    org_id_val := auth.jwt() ->> 'org_id';
    
    -- Get additional context
    ip_addr := inet_client_addr();
    user_agent_val := current_setting('request.headers', true)::json ->> 'user-agent';
    session_id_val := current_setting('request.headers', true)::json ->> 'x-session-id';
    
    -- Insert audit log entry
    INSERT INTO audit_log (
        table_name, record_id, action, new_values,
        user_id, org_id, ip_address, user_agent, session_id
    ) VALUES (
        'patients', patient_id, 'SELECT', 
        jsonb_build_object('access_type', access_type),
        user_id_val, org_id_val, ip_addr, user_agent_val, session_id_val
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_patients_trigger
    AFTER INSERT OR UPDATE OR DELETE ON patients
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_appointments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON appointments
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_doctors_trigger
    AFTER INSERT OR UPDATE OR DELETE ON doctors
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON audit_log TO authenticated;
GRANT EXECUTE ON FUNCTION log_patient_access(TEXT, TEXT) TO authenticated;

-- Create function to get audit trail for a specific patient
CREATE OR REPLACE FUNCTION get_patient_audit_trail(patient_id TEXT)
RETURNS TABLE (
    id UUID,
    action TEXT,
    old_values JSONB,
    new_values JSONB,
    user_id TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    -- Check if user can access this patient
    IF NOT user_can_access_patient(patient_id) THEN
        RAISE EXCEPTION 'Access denied: You do not have permission to view this patient audit trail';
    END IF;
    
    RETURN QUERY
    SELECT 
        a.id,
        a.action,
        a.old_values,
        a.new_values,
        a.user_id,
        a.created_at
    FROM audit_log a
    WHERE a.table_name = 'patients' 
    AND a.record_id = patient_id
    AND a.org_id = auth.jwt() ->> 'org_id'
    ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_patient_audit_trail(TEXT) TO authenticated;

-- Create audit log cleanup function (for data retention compliance)
CREATE OR REPLACE FUNCTION cleanup_audit_logs(retention_days INTEGER DEFAULT 2555) -- 7 years default
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_log 
    WHERE created_at < NOW() - INTERVAL '1 day' * retention_days;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment explaining the audit system
COMMENT ON TABLE audit_log IS 'HIPAA-compliant audit trail for all healthcare data access and modifications';
COMMENT ON FUNCTION audit_trigger_function() IS 'Automatically logs all INSERT, UPDATE, DELETE operations on audited tables';
COMMENT ON FUNCTION log_patient_access(TEXT, TEXT) IS 'Manually log patient data access (SELECT operations)';
COMMENT ON FUNCTION get_patient_audit_trail(TEXT) IS 'Retrieve audit trail for a specific patient (organization-scoped)';
COMMENT ON FUNCTION cleanup_audit_logs(INTEGER) IS 'Clean up old audit logs based on retention policy';