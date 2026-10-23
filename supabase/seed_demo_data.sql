-- ==============================================================================
-- BRIGHTPATH CRM — OPTIONAL DEMO SEED DATA
-- Fictional Coaching Institute Admissions Data
-- Note: Safe to execute after running 20261023_001_initial_schema.sql
-- ==============================================================================

DO $$
DECLARE
  v_staff_id UUID;
  v_lead_1 UUID;
  v_lead_2 UUID;
  v_lead_3 UUID;
  v_lead_4 UUID;
  v_lead_5 UUID;
BEGIN
  -- Grab the first existing profile (if any registered user exists)
  SELECT id INTO v_staff_id FROM public.profiles LIMIT 1;

  -- 1. Insert Fictional Student Enquiries
  INSERT INTO public.leads (
    id, full_name, email, phone, course_interest, source, status, lost_reason, assigned_to, created_by, notes, created_at
  ) VALUES 
  (
    'a1111111-1111-1111-1111-111111111111',
    'Aarav Sharma',
    'aarav.sharma@gmail.com',
    '+91 98452 11029',
    'IIT-JEE 2-Year Intensive',
    'Walk-in Center',
    'Qualified',
    NULL,
    v_staff_id,
    v_staff_id,
    'Top scorer in 10th ICSE (94%). Parent inquired about weekend batch timings and scholarship test.',
    now() - INTERVAL '3 days'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Diya Patel',
    'diya.patel@outlook.com',
    '+91 97120 44581',
    'NEET Repeater Batch',
    'Meta Ads',
    'Contacted',
    NULL,
    v_staff_id,
    v_staff_id,
    'Attended physics webinar on Saturday. Requested curriculum brochure and faculty bio.',
    now() - INTERVAL '2 days'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Rohan Mehta',
    'rohan.mehta@yahoo.com',
    '+91 94481 99230',
    'SAT & GRE Global Track',
    'Website Form',
    'New',
    NULL,
    v_staff_id,
    v_staff_id,
    'High-intent student planning Fall 2027 US intake. Wants counselor phone appointment.',
    now() - INTERVAL '4 hours'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Ananya Deshmukh',
    'ananya.d@gmail.com',
    '+91 98220 56712',
    'Class 11-12 Integrated CBSE',
    'Parent Referral',
    'Converted',
    NULL,
    v_staff_id,
    v_staff_id,
    'Enrolled in Morning Batch A. Full term tuition fees deposited via UPI.',
    now() - INTERVAL '10 days'
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'Vikramaditya Nair',
    'vikram.nair@icloud.com',
    '+91 99450 78219',
    'IIT-JEE 1-Year Fastrack',
    'School Seminar',
    'Lost',
    'Chose residential competitor offering hostel package.',
    v_staff_id,
    v_staff_id,
    'Candidate loved faculty demo but required boarding facility.',
    now() - INTERVAL '12 days'
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. Insert Follow-up Consultation Tasks
  INSERT INTO public.follow_ups (
    id, lead_id, assigned_to, due_at, note, status, completed_at, created_by, created_at
  ) VALUES 
  (
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    v_staff_id,
    now() - INTERVAL '1 hour', -- OVERDUE task
    'Call father regarding 10% sibling fee concession details for admission confirmation.',
    'pending',
    NULL,
    v_staff_id,
    now() - INTERVAL '1 day'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    v_staff_id,
    now() + INTERVAL '2 hours', -- Scheduled today
    'Send physics demo class Zoom link and Saturday schedule.',
    'pending',
    NULL,
    v_staff_id,
    now() - INTERVAL '1 day'
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'a3333333-3333-3333-3333-333333333333',
    v_staff_id,
    now() + INTERVAL '1 day', -- Upcoming tomorrow
    'Introductory counseling call for SAT track diagnostic test.',
    'pending',
    NULL,
    v_staff_id,
    now() - INTERVAL '2 hours'
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    'a4444444-4444-4444-4444-444444444444',
    v_staff_id,
    now() - INTERVAL '5 days',
    'Collect signed admission form and fee acknowledgment receipt.',
    'completed',
    now() - INTERVAL '5 days',
    v_staff_id,
    now() - INTERVAL '7 days'
  )
  ON CONFLICT (id) DO NOTHING;

  -- 3. Insert Historical Activity Timeline Logs
  INSERT INTO public.activities (
    lead_id, actor_id, activity_type, description, metadata, created_at
  ) VALUES 
  (
    'a1111111-1111-1111-1111-111111111111',
    v_staff_id,
    'lead_created',
    'Student walked into Indiranagar center accompanied by father.',
    '{"channel": "Walk-in Center", "scholarship_eligible": true}'::jsonb,
    now() - INTERVAL '3 days'
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    v_staff_id,
    'status_updated',
    'Status advanced from New to Qualified after diagnostic assessment score 88%.',
    '{"previous_status": "New", "new_status": "Qualified"}'::jsonb,
    now() - INTERVAL '2 days'
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    v_staff_id,
    'follow_up_scheduled',
    'Scheduled callback with parent for fee concession review.',
    '{"due_at": "Today"}'::jsonb,
    now() - INTERVAL '1 day'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    v_staff_id,
    'status_updated',
    'Student converted to Enrolled. Tuition deposit verified by administration.',
    '{"batch": "Morning Batch A", "receipt_no": "BP-2026-904"}'::jsonb,
    now() - INTERVAL '10 days'
  );

END $$;
