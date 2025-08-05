-- Seed data for Healthrive with organization_id: org_30ml1ttUdsl67pQecd3KPXnBVHT

-- Insert patients with organization_id
INSERT INTO patients (id, organization_id, name, date_of_birth, gender, address, phone, email, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, insurance_provider, insurance_policy_number, smoking_status, alcohol_consumption, allergies, family_history, status, registration_date) VALUES
('PT-001', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Sarah Johnson', '1985-03-15', 'female', '123 Oak Street, Springfield, IL 62701', '(555) 123-4567', 'sarah.johnson@email.com', 'John Johnson', '(555) 123-4568', 'Spouse', 'Blue Cross Blue Shield', 'BCBS123456789', 'never', 'occasional', ARRAY['Penicillin'], ARRAY['Hypertension (mother)', 'Diabetes Type 2 (father)'], 'active', '2023-01-15T00:00:00'),
('PT-002', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Michael Chen', '1978-11-22', 'male', '456 Pine Avenue, Springfield, IL 62702', '(555) 234-5678', 'michael.chen@email.com', 'Lisa Chen', '(555) 234-5679', 'Wife', 'Aetna', 'AET987654321', 'former', 'moderate', ARRAY['Sulfa drugs'], ARRAY['Diabetes Type 2 (both parents)', 'Heart disease (father)'], 'active', '2022-08-20T00:00:00'),
('PT-003', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Emily Davis', '1992-07-08', 'female', '789 Maple Drive, Springfield, IL 62703', '(555) 345-6789', 'emily.davis@email.com', 'Robert Davis', '(555) 345-6790', 'Father', 'United Healthcare', 'UHC456789123', 'never', 'none', ARRAY['Shellfish', 'Tree nuts'], ARRAY['Allergies (mother)', 'Asthma (sister)'], 'active', '2023-05-10T00:00:00');

-- Insert doctors with organization_id  
INSERT INTO doctors (id, organization_id, name, date_of_birth, gender, specialization, phone, email) VALUES
('DR-001', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. James Smith', '1975-04-12', 'male', 'Internal Medicine', '(555) 101-2001', 'james.smith@healthrive.com'),
('DR-002', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. Sarah Johnson', '1982-09-25', 'female', 'Cardiology', '(555) 101-2002', 'sarah.johnson@healthrive.com'),
('DR-003', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. Michael Wilson', '1978-11-08', 'male', 'Dermatology', '(555) 101-2003', 'michael.wilson@healthrive.com'),
('DR-004', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. Emily Martinez', '1985-02-14', 'female', 'Emergency Medicine', '(555) 101-2004', 'emily.martinez@healthrive.com'),
('DR-005', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. David Lee', '1980-07-30', 'male', 'Orthopedic Surgery', '(555) 101-2005', 'david.lee@healthrive.com'),
('DR-006', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. Lisa Taylor', '1973-12-03', 'female', 'Pediatrics', '(555) 101-2006', 'lisa.taylor@healthrive.com'),
('DR-007', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. Robert Anderson', '1970-06-18', 'male', 'Surgery', '(555) 101-2007', 'robert.anderson@healthrive.com'),
('DR-008', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. Jennifer Brown', '1987-03-22', 'female', 'Psychiatry', '(555) 101-2008', 'jennifer.brown@healthrive.com'),
('DR-009', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. Christopher Davis', '1976-10-15', 'male', 'Neurology', '(555) 101-2009', 'christopher.davis@healthrive.com'),
('DR-010', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. Amanda Garcia', '1984-08-07', 'female', 'Obstetrics & Gynecology', '(555) 101-2010', 'amanda.garcia@healthrive.com'),
('DR-011', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. Mark Thompson', '1981-01-28', 'male', 'Radiology', '(555) 101-2011', 'mark.thompson@healthrive.com'),
('DR-012', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Dr. Rachel White', '1979-05-11', 'female', 'Anesthesiology', '(555) 101-2012', 'rachel.white@healthrive.com');

-- Insert sample appointments with organization_id
INSERT INTO appointments (id, organization_id, patient_name, patient_id, time, type, status, doctor, notes) VALUES
('apt-001', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Sarah Johnson', 'PT-001', '2024-08-04T09:00:00', 'consultation', 'scheduled', 'Dr. Smith', 'Annual checkup'),
('apt-002', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Michael Chen', 'PT-002', '2024-08-04T10:30:00', 'follow-up', 'in-progress', 'Dr. Johnson', 'Post-surgery follow-up'),
('apt-003', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Emily Davis', 'PT-003', '2024-08-04T11:15:00', 'consultation', 'scheduled', 'Dr. Wilson', 'Skin condition consultation'),
('apt-004', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Robert Brown', NULL, '2024-08-04T14:00:00', 'emergency', 'scheduled', 'Dr. Martinez', 'Urgent care - chest pain'),
('apt-005', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'Lisa Anderson', NULL, '2024-08-04T15:30:00', 'follow-up', 'completed', 'Dr. Lee', 'Blood test results review'),
('apt-006', 'org_30ml1ttUdsl67pQecd3KPXnBVHT', 'David Wilson', NULL, '2024-08-04T16:15:00', 'surgery', 'scheduled', 'Dr. Taylor', 'Minor surgical procedure');

-- Insert diagnoses for patients
INSERT INTO diagnoses (patient_id, code, description, date_of_diagnosis, status) VALUES
('PT-001', 'I10', 'Essential Hypertension', '2024-06-10T00:00:00', 'active'),
('PT-001', 'Z00.00', 'Encounter for general adult medical examination without abnormal findings', '2024-08-04T00:00:00', 'resolved'),
('PT-002', 'E11.9', 'Type 2 diabetes mellitus without complications', '2024-02-08T00:00:00', 'active'),
('PT-002', 'K35.9', 'Acute appendicitis, unspecified', '2024-07-15T00:00:00', 'resolved'),
('PT-003', 'L20.9', 'Atopic dermatitis, unspecified', '2024-08-04T00:00:00', 'active'),
('PT-003', 'T78.40XA', 'Allergy, unspecified, initial encounter', '2024-05-12T00:00:00', 'resolved');

-- Insert medications for patients
INSERT INTO medications (patient_id, name, dosage, frequency, route, start_date, reason) VALUES
('PT-001', 'Lisinopril', '10mg', 'Once daily', 'oral', '2024-06-10T00:00:00', 'Hypertension management'),
('PT-002', 'Metformin', '500mg', 'Twice daily', 'oral', '2024-02-08T00:00:00', 'Type 2 diabetes management'),
('PT-003', 'Hydrocortisone cream', '1%', 'Apply twice daily', 'topical', '2024-08-04T00:00:00', 'Eczema treatment'),
('PT-003', 'EpiPen', '0.3mg', 'As needed', 'injection', '2024-05-12T00:00:00', 'Emergency allergic reaction treatment');

-- Insert procedures for patients
INSERT INTO procedures (patient_id, code, description, date_of_procedure, provider) VALUES
('PT-001', '99213', 'Office visit for established patient', '2024-08-04T09:00:00', 'Dr. Smith'),
('PT-002', '44970', 'Laparoscopic appendectomy', '2024-07-15T08:00:00', 'Dr. Taylor'),
('PT-002', '99214', 'Office visit for established patient', '2024-08-04T10:30:00', 'Dr. Johnson'),
('PT-003', '99213', 'Office visit for established patient', '2024-08-04T11:15:00', 'Dr. Wilson');

-- Insert lab results for patients
INSERT INTO lab_results (patient_id, test_name, result, units, reference_range, date_of_test) VALUES
('PT-001', 'Complete Blood Count', 'Normal', 'Various', 'Within normal limits', '2024-08-04T00:00:00'),
('PT-001', 'Lipid Panel', '185', 'mg/dL', '< 200', '2024-08-04T00:00:00'),
('PT-002', 'Hemoglobin A1C', '7.2', '%', '< 7.0', '2024-08-01T00:00:00'),
('PT-002', 'Fasting Glucose', '145', 'mg/dL', '70-100', '2024-08-01T00:00:00'),
('PT-003', 'Allergen Panel', 'Positive for shellfish', 'Various', 'Negative', '2024-05-15T00:00:00');

-- Insert vital signs for patients
INSERT INTO vital_signs (patient_id, date_time, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, temperature, respiratory_rate, weight, height) VALUES
('PT-001', '2024-08-04T09:00:00', 128, 82, 72, 98.6, 16, 145, 65),
('PT-002', '2024-08-04T10:30:00', 135, 88, 78, 98.4, 18, 180, 70),
('PT-003', '2024-08-04T11:15:00', 118, 75, 68, 98.7, 14, 125, 64);

-- Insert clinical notes for patients
INSERT INTO clinical_notes (patient_id, date_time, note_type, content, provider) VALUES
('PT-001', '2024-08-04T09:00:00', 'progress', 'Patient presents for annual physical examination. Reports feeling well with no new complaints. Blood pressure well controlled on current medication. Continue current regimen.', 'Dr. Smith'),
('PT-002', '2024-08-04T10:30:00', 'progress', 'Post-surgical follow-up visit. Incision sites healing well, no signs of infection. Patient reports good energy levels. Diabetes management discussed, A1C improving but still above target.', 'Dr. Johnson'),
('PT-003', '2024-08-04T11:15:00', 'progress', 'Patient presents with eczema flare-up on arms and face. Skin appears inflamed with mild scaling. Prescribed topical steroid. Discussed trigger avoidance and skin care routine.', 'Dr. Wilson');