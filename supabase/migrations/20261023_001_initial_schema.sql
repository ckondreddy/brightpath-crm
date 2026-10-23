-- ==============================================================================
-- BRIGHTPATH CRM — INITIAL DATABASE SCHEMA MIGRATION
-- Migration Version: 20261023_001_initial_schema
-- Compatibility: PostgreSQL 14+ / Supabase PostgreSQL with Row Level Security
-- ==============================================================================

-- 1. Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- PROFILES (Maps 1:1 to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'counsellor' CHECK (role IN ('admin', 'manager', 'counsellor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- LEADS (Student admissions enquiries)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  course_interest TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')),
  lost_reason TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FOLLOW_UPS (Scheduled callback and consultation tasks)
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  due_at TIMESTAMPTZ NOT NULL,
  note TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ACTIVITIES (Historical audit trail and interaction timeline)
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('lead_created', 'status_updated', 'note_added', 'follow_up_scheduled', 'follow_up_completed', 'lead_edited')),
  description TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_leads_status_source ON public.leads(status, source);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_by ON public.leads(created_by);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_follow_ups_lead_id ON public.follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_assigned_due ON public.follow_ups(assigned_to, due_at, status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due_status ON public.follow_ups(due_at, status);

CREATE INDEX IF NOT EXISTS idx_activities_lead_id_created ON public.activities(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_actor_id ON public.activities(actor_id);

-- ==============================================================================
-- 4. SECURITY & HELPER FUNCTIONS (SECURITY DEFINER with safe search_path)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()), false);
$$;

CREATE OR REPLACE FUNCTION public.is_manager_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role IN ('admin', 'manager') FROM public.profiles WHERE id = auth.uid()), false);
$$;

-- Trigger: Automatically create public.profiles row on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Academy Staff'),
    'counsellor'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Prevent users from escalating their own role column
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only enforce when called by an authenticated user client (auth.uid() is not null)
  -- Allows database administrators, SQL Editor, and service role to manage roles
  IF auth.uid() IS NOT NULL THEN
    IF OLD.role IS DISTINCT FROM NEW.role AND NOT is_admin() THEN
      RAISE EXCEPTION 'Access Denied: Only administrators can modify user roles.';
    END IF;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_self_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_self_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_escalation();

-- Trigger: Automatically update updated_at on leads
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_leads_updated_at ON public.leads;
CREATE TRIGGER trg_set_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone authenticated can view colleague profiles (for assignment dropdowns)
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can update only their own profile details
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile (e.g. for role management)
CREATE POLICY "profiles_admin_manage"
  ON public.profiles FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ------------------------------------------------------------------------------
-- LEADS POLICIES
-- ------------------------------------------------------------------------------
-- Managers and Admins can view all leads; Counsellors view assigned or created
CREATE POLICY "leads_select_policy"
  ON public.leads FOR SELECT
  TO authenticated
  USING (
    is_manager_or_admin()
    OR assigned_to = auth.uid()
    OR created_by = auth.uid()
  );

-- Any authenticated staff member can create a new student lead
CREATE POLICY "leads_insert_policy"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Managers and Admins can update any lead; Counsellors update assigned/created
CREATE POLICY "leads_update_policy"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (
    is_manager_or_admin()
    OR assigned_to = auth.uid()
    OR created_by = auth.uid()
  )
  WITH CHECK (
    is_manager_or_admin()
    OR assigned_to = auth.uid()
    OR created_by = auth.uid()
  );

-- Only Managers or Admins can delete leads
CREATE POLICY "leads_delete_policy"
  ON public.leads FOR DELETE
  TO authenticated
  USING (is_manager_or_admin());

-- ------------------------------------------------------------------------------
-- FOLLOW-UPS POLICIES
-- ------------------------------------------------------------------------------
-- Staff can view follow-ups for leads they have access to
CREATE POLICY "follow_ups_select_policy"
  ON public.follow_ups FOR SELECT
  TO authenticated
  USING (
    is_manager_or_admin()
    OR assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = follow_ups.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  );

-- Staff can create follow-ups for accessible leads
CREATE POLICY "follow_ups_insert_policy"
  ON public.follow_ups FOR INSERT
  TO authenticated
  WITH CHECK (
    is_manager_or_admin()
    OR assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = follow_ups.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  );

-- Staff can update/complete follow-ups assigned to them or associated leads
CREATE POLICY "follow_ups_update_policy"
  ON public.follow_ups FOR UPDATE
  TO authenticated
  USING (
    is_manager_or_admin()
    OR assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = follow_ups.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  )
  WITH CHECK (
    is_manager_or_admin()
    OR assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = follow_ups.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  );

-- Only Managers and Admins can delete follow-up records
CREATE POLICY "follow_ups_delete_policy"
  ON public.follow_ups FOR DELETE
  TO authenticated
  USING (is_manager_or_admin());

-- ------------------------------------------------------------------------------
-- ACTIVITIES POLICIES
-- ------------------------------------------------------------------------------
-- Staff can view activity logs for leads they have access to
CREATE POLICY "activities_select_policy"
  ON public.activities FOR SELECT
  TO authenticated
  USING (
    is_manager_or_admin()
    OR EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = activities.lead_id
      AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
    )
  );

-- Any authenticated staff member can log activity
CREATE POLICY "activities_insert_policy"
  ON public.activities FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
  );
