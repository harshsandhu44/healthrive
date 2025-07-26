-- Optimize database queries with proper indexing for better performance
-- This migration adds performance optimizations for healthcare data queries

-- Drop existing indexes that might be suboptimal
DROP INDEX IF EXISTS idx_patients_full_name;
DROP INDEX IF EXISTS idx_patients_email;
DROP INDEX IF EXISTS idx_patients_phone_number;

-- Create optimized composite indexes for common query patterns

-- 1. Optimized full-text search index for patients
-- Combines name, email, and phone for efficient search across all fields
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_full_text_search 
ON patients USING gin(
    to_tsvector('english', 
        coalesce(full_name, '') || ' ' || 
        coalesce(email, '') || ' ' || 
        coalesce(phone_number, '')
    )
);

-- 2. Optimized unique constraints with better performance
-- Partial index for non-null phone numbers only
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_phone_unique 
ON patients(phone_number) 
WHERE phone_number IS NOT NULL AND phone_number != '';

-- Partial index for non-null emails only
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_email_unique 
ON patients(email) 
WHERE email IS NOT NULL AND email != '';

-- 3. Optimize appointment-patient relationship queries
-- This index is crucial for the new RLS policies
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_patient_org_lookup 
ON appointments(patient_id, org_id, created_at DESC);

-- 4. Optimize doctor queries by organization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_doctors_org_status 
ON doctors(org_id, created_at DESC) 
WHERE org_id IS NOT NULL;

-- 5. Optimize department queries by organization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_departments_org_status 
ON departments(org_id, created_at DESC) 
WHERE org_id IS NOT NULL;

-- 6. Optimize appointment queries for dashboard analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_org_date_status 
ON appointments(org_id, scheduled_at, status, created_at DESC);

-- 7. Optimize patient record access tracking (for audit logs)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_patient_access 
ON audit_log(table_name, record_id, action, created_at DESC) 
WHERE table_name = 'patients';

-- 8. Create index for time-based queries (common in healthcare analytics)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_created_month 
ON patients(date_trunc('month', created_at), org_id) 
WHERE created_at >= '2024-01-01';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_scheduled_month 
ON appointments(date_trunc('month', scheduled_at), org_id, status) 
WHERE scheduled_at >= '2024-01-01';

-- 9. Optimize medical records JSONB queries
-- Create GIN index for medical records JSON queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_medical_records_gin 
ON patients USING gin(medical_records) 
WHERE medical_records IS NOT NULL;

-- Create specific indexes for common medical record searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_allergies 
ON patients USING gin((medical_records -> 'allergies')) 
WHERE medical_records ? 'allergies';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_medications 
ON patients USING gin((medical_records -> 'medications')) 
WHERE medical_records ? 'medications';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_conditions 
ON patients USING gin((medical_records -> 'conditions')) 
WHERE medical_records ? 'conditions';

-- 10. Optimize audit log queries for compliance reporting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_compliance 
ON audit_log(org_id, user_id, created_at DESC, action);

-- Create index for audit log retention queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_retention 
ON audit_log(created_at) 
WHERE created_at < NOW() - INTERVAL '1 year';

-- 11. Add performance optimization functions

-- Function to get patient statistics efficiently
CREATE OR REPLACE FUNCTION get_patient_stats_for_org(org_id_param TEXT)
RETURNS TABLE (
    total_patients BIGINT,
    patients_with_appointments BIGINT,
    patients_this_month BIGINT,
    avg_appointments_per_patient NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH patient_data AS (
        SELECT DISTINCT p.id, p.created_at
        FROM patients p
        INNER JOIN appointments a ON a.patient_id = p.id
        WHERE a.org_id = org_id_param
    ),
    appointment_counts AS (
        SELECT patient_id, COUNT(*) as appointment_count
        FROM appointments
        WHERE org_id = org_id_param
        GROUP BY patient_id
    )
    SELECT 
        COUNT(*)::BIGINT as total_patients,
        COUNT(*)::BIGINT as patients_with_appointments,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()))::BIGINT as patients_this_month,
        COALESCE(AVG(ac.appointment_count), 0)::NUMERIC as avg_appointments_per_patient
    FROM patient_data pd
    LEFT JOIN appointment_counts ac ON ac.patient_id = pd.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to efficiently search patients with ranking
CREATE OR REPLACE FUNCTION search_patients_ranked(
    org_id_param TEXT,
    search_term TEXT,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    id TEXT,
    full_name TEXT,
    email TEXT,
    phone_number TEXT,
    rank REAL,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.email,
        p.phone_number,
        ts_rank(
            to_tsvector('english', 
                coalesce(p.full_name, '') || ' ' || 
                coalesce(p.email, '') || ' ' || 
                coalesce(p.phone_number, '')
            ),
            plainto_tsquery('english', search_term)
        ) as rank,
        p.created_at
    FROM patients p
    INNER JOIN appointments a ON a.patient_id = p.id
    WHERE a.org_id = org_id_param
    AND to_tsvector('english', 
        coalesce(p.full_name, '') || ' ' || 
        coalesce(p.email, '') || ' ' || 
        coalesce(p.phone_number, '')
    ) @@ plainto_tsquery('english', search_term)
    ORDER BY rank DESC, p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_patient_stats_for_org(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_patients_ranked(TEXT, TEXT, INTEGER) TO authenticated;

-- Add table statistics update for better query planning
ANALYZE patients;
ANALYZE appointments;
ANALYZE doctors;
ANALYZE departments;
ANALYZE audit_log;

-- Comments for maintenance
COMMENT ON INDEX idx_patients_full_text_search IS 'Full-text search across patient name, email, and phone';
COMMENT ON INDEX idx_appointments_patient_org_lookup IS 'Critical for RLS policy performance on patient access';
COMMENT ON INDEX idx_appointments_org_date_status IS 'Optimizes dashboard analytics queries';
COMMENT ON FUNCTION get_patient_stats_for_org(TEXT) IS 'Efficiently calculates patient statistics for organization dashboard';
COMMENT ON FUNCTION search_patients_ranked(TEXT, TEXT, INTEGER) IS 'Full-text search with relevance ranking for patient lookup';