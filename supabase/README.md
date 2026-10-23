# BrightPath CRM — Database Schema & Setup Guide

This directory contains the production PostgreSQL schema migrations, Row-Level Security (RLS) policies, and demo seed data for BrightPath CRM.

---

## Quick Setup via Supabase Dashboard (1-Click SQL Editor)

### Step 1: Run the Initial Schema Migration
1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/wysqzeyqbxmozdaxgobd](https://supabase.com/dashboard/project/wysqzeyqbxmozdaxgobd)
2. In the left sidebar, click on **SQL Editor** (icon `>_`).
3. Click **"New query"** (green button).
4. Open [`migrations/20261023_001_initial_schema.sql`](./migrations/20261023_001_initial_schema.sql), copy the full content, paste it into the editor, and click **"Run"**.
5. This automatically provisions:
   - `public.profiles` (1:1 mapping with `auth.users`)
   - `public.leads` (Student admissions enquiries)
   - `public.follow_ups` (Scheduled callbacks and tasks)
   - `public.activities` (Historical timeline and audit trail)
   - Triggers: `on_auth_user_created` (auto-creates profile upon sign up) and `trg_prevent_self_role_escalation`.
   - Security helper functions (`is_admin()`, `is_manager_or_admin()`).
   - RLS policies for `admin`, `manager`, and `counsellor`.

---

### Step 2 (Optional): Load Demo Seed Data
1. In the Supabase **SQL Editor**, click **"New query"**.
2. Copy and paste the contents of [`seed_demo_data.sql`](./seed_demo_data.sql) and click **"Run"**.
3. This will populate realistic student enquiries (*IIT-JEE*, *NEET*, *SAT/GRE*), urgency follow-ups, and activity history.

---

### Step 3: Promoting Your First User to Administrator
When you register your initial account (in Phase 04), new profiles default to `'counsellor'`. To promote your account to `'admin'`, execute this single query in the SQL Editor:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1);
```
