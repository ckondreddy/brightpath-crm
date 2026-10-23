# BrightPath CRM — Master Project Plan & Execution Context

> **Master Specification**: `BrightPath_CRM_Full_Master_Build_Prompt.docx` (BrightPath CRM Antigravity Full Build Prompt)  
> **Repository**: `ckondreddy/brightpath-crm`  
> **Hosting & CI/CD**: Vercel (connected to GitHub `origin/main`)  
> **Backend / Database**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)  

---

## 1. Project Overview & Business Problem

**BrightPath Academy** is a coaching institute handling student enquiries across multiple channels (website, phone calls, walk-ins, messaging, referrals). Currently, enquiries and follow-ups are tracked across spreadsheets and messages, causing:
- Missed enquiries and lost students.
- Unclear ownership between counsellors and managers.
- Forgotten follow-ups without overdue visibility.
- Zero live reporting into admission conversion rates.

**The Solution**: A focused, modern SaaS CRM built with React 19, TypeScript, Vite, and Supabase.

---

## 2. The 5-Step Continuous Delivery Lifecycle

Every single feature phase follows this strict sequential cycle:

```
[1. Develop Feature] ➔ [2. Test Locally (Build & Lint)] ➔ [3. Verify Acceptance] ➔ [4. Deploy to Vercel (Git Push)] ➔ [5. Retest on Live Cloud URL]
```

1. **Develop**: Build the designated feature in isolated TypeScript modules and CSS tokens.
2. **Test (Local)**: Run `tsc -b`, `npm run lint`, and `vite build`. Zero errors/warnings allowed.
3. **Verify Checkpoint**: Validate specific acceptance criteria (validation rules, UX states, data boundaries).
4. **Deploy**: Stage and commit to GitHub `main` with a conventional commit message, triggering Vercel CI/CD.
5. **Retest on Live Cloud**: Verify that the deployed production URL behaves as expected before starting the next feature.

---

## 3. 13-Phase Order-Wise Feature Roadmap

| Phase | Feature Milestone | Status | Key Deliverables & Acceptance Criteria |
| :---: | :--- | :---: | :--- |
| **01** | **Foundation, TypeScript & High-End Startup UI Shell** | **COMPLETED** | Transformed shell into a 0% AI-generated, tier-1 startup product (Attio/Linear aesthetic): bespoke typography, layered slate surfaces, workspace switcher, grouped sidebar with live count pills, command search (`⌘K`), realistic academy domain data, and tactile micro-interactions. (Commit: `a1e4fca`) |
| **02** | **Supabase Client & Config Diagnostics** | **COMPLETED** | Installed `@supabase/supabase-js`, built safe client singleton with health check probe in `lib/supabaseClient.ts`, `.env.example`, fluid animations in `animations.css`, collapsible diagnostic sheet, and animated header status pill. (Commit: `88ffb8f`) |
| **03** | **PostgreSQL Schema, Migrations & RLS** | **COMPLETED** | Author repeatable SQL migrations in `supabase/migrations/` for all 4 tables (`profiles`, `leads`, `follow_ups`, `activities`), indexes, foreign keys, triggers on `auth.users`, anti-role escalation, and RLS policies. TypeScript database types generated. (Commit: `7c4421e`) |
| **04** | **Authentication & Role-Based Lifecycle** | **COMPLETED** | Supabase Auth (Sign In, Sign Up, Sign Out), session persistence via `onAuthStateChange`, profile auto-sync (`profiles` row hydrated), role-guarded routes (`admin`, `manager`, `counsellor`), Linear-style AuthPage with tabs and demo credentials auto-fill, and live user profile indicator in Header/Sidebar. |
| **05** | **Lead Creation & Validation (CRM Core I)** | *NEXT* | Create lead modal, validation (name/phone required, email regex, whitespace trim), Supabase insert, activity log creation. |
| **06** | **Lead Listing, Filter, Search & Sorting (CRM Core II)** | *Pending* | Leads table, search debounce (name, phone, course), multi-criteria filters (status, source, assignee), date sorting, status badges. |
| **07** | **Lead Detail View, Editing & Status Lifecycle (CRM Core III)** | *Pending* | Lead detail view (`/leads/:id`), edit details modal, status transitions (mandatory `lost_reason` when status marked `Lost`). |
| **08** | **Follow-up Engine & Overdue Tasks** | *Pending* | Schedule follow-ups, `due_at` date picker, task tabs (Pending, Overdue, Completed), dynamic overdue logic (`due_at < now()`), completion audit. |
| **09** | **Activity Logging & Historical Timeline** | *Pending* | Chronological audit feed per lead tracking creation, status updates, counsellor notes, and completed follow-ups. |
| **10** | **Executive Dashboard & Live Metric Reconciliation** | *Pending* | Live KPI cards (Total Leads, New, Converted, Overdue, Conversion Rate %), status distribution, source funnel, overdue action queue. |
| **11** | **Reports, Pipeline Analytics & CSV Export** | *Pending* | Conversion breakdown by source/counsellor, date-range filters, sanitized CSV lead export download. |
| **12** | **Production Hardening, Accessibility & Polish** | *Pending* | Toast notification system, keyboard navigation & focus traps, WCAG AA contrast check, network disconnect/error handling. |
| **13** | **End-to-End Verification, Handover & Documentation** | *Pending* | Full role regression testing pass, comprehensive `README.md` with SQL setup instructions, live Vercel production verification. |

---

## 3.1 Phase 01 Revision: High-End Startup Design System & "0% AI" Architecture

To achieve a tier-1, high-end startup aesthetic (similar to **Attio**, **Linear**, **Stripe**, and **Folk CRM**) and eliminate any generic AI-generated feel, Phase 01 incorporates the following design standards:

### 1. Eliminating the "Generic AI" Traps
* **No clunky rainbow gradients**: Replaced with layered, high-contrast monochrome slate surfaces (`#090D16` deep navy, `#0F172A`, `#F8FAFC`, `#FFFFFF`) with intentional, surgical cobalt accents (`#2563EB`).
* **No oversized icon boxes**: Icons are refined to 15px–18px stroke-width 1.75, integrated harmoniously into typography rather than placed inside massive neon squares.
* **No cookie-cutter dummy text**: All page shells use authentic coaching institute context (e.g. *"IIT-JEE & NEET Fastrack 2026"*, *"SAT / GRE Admissions"*, *"Walk-in Bangalore Center"*, *"Counsellor Batch Shift: Morning"*).
* **No floating generic cards**: Cards use crisp, physical 1px borders (`rgba(15, 23, 42, 0.08)`) with micro-bevel inset shadows (`box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 0 0 1px rgba(16, 24, 40, 0.04)`).

### 2. High-End Startup Components to Implement
* **Workspace Switcher in Sidebar**:
  - `BrightPath Academy • Indiranagar Center` with a subtle verified green shield and dropdown chevron.
* **Segmented Navigation with Live Metric Pills**:
  - Grouped sections with micro-uppercase headers: `MAIN PIPELINE`, `STUDENT DIRECTORY`, `INTELLIGENCE`, `PREFERENCES`.
  - Live count pills on navigation links (e.g. `Leads` with a subtle badge `148`, `Follow-ups` with an alert pill `4 overdue`).
* **Command Bar & Global Quick Search (`⌘K`)**:
  - Integrated header search bar with keyboard shortcut tag (`⌘K` / `Ctrl+K`).
  - Action shortcut buttons (e.g. `+ New Lead`, `Quick Note`) with keyboard hints.
* **Counsellor Live Shift Presence**:
  - Avatar badge in header and sidebar footer with status dot (`🟢 On Duty • Priya Sharma - Senior Counsellor`).
* **Executive Metric Cards**:
  - Linear/Stripe-style typography with tabular numbers (`font-variant-numeric: tabular-nums`).
  - Positive/negative delta badges (`↑ 12.4% vs last week`), subtle micro-sparkline indicators, and contextual comparative notes.
* **Segmented View Switchers & Realistic Filter Bars**:
  - Segmented pill controls (`All Enquiries`, `High Intent`, `Contacted`, `Admitted`).
  - Tactile micro-buttons with physical press effect (`active: scale(0.98)`).

---

## 4. Target Database Schema (PostgreSQL via Supabase)

### 1. `profiles`
- `id`: `UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
- `full_name`: `TEXT NOT NULL`
- `role`: `TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'counsellor')) DEFAULT 'counsellor'`
- `created_at`, `updated_at`: `TIMESTAMPTZ DEFAULT now()`

### 2. `leads`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `full_name`: `TEXT NOT NULL`
- `email`: `TEXT` (nullable, validated format)
- `phone`: `TEXT NOT NULL`
- `course_interest`: `TEXT NOT NULL`
- `source`: `TEXT NOT NULL` (`Website`, `Walk-in`, `Phone`, `Social Media`, `Referral`, `Other`)
- `status`: `TEXT NOT NULL CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')) DEFAULT 'New'`
- `lost_reason`: `TEXT` (mandatory when status is 'Lost')
- `assigned_to`: `UUID REFERENCES profiles(id) ON DELETE SET NULL`
- `created_by`: `UUID REFERENCES profiles(id) ON DELETE SET NULL`
- `notes`: `TEXT`
- `created_at`, `updated_at`: `TIMESTAMPTZ DEFAULT now()`

### 3. `follow_ups`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `lead_id`: `UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE`
- `assigned_to`: `UUID REFERENCES profiles(id) ON DELETE SET NULL`
- `due_at`: `TIMESTAMPTZ NOT NULL`
- `note`: `TEXT NOT NULL`
- `status`: `TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending'`
- `completed_at`: `TIMESTAMPTZ`
- `created_by`: `UUID REFERENCES profiles(id) ON DELETE SET NULL`
- `created_at`: `TIMESTAMPTZ DEFAULT now()`

### 4. `activities`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `lead_id`: `UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE`
- `actor_id`: `UUID REFERENCES profiles(id) ON DELETE SET NULL`
- `activity_type`: `TEXT NOT NULL` (`lead_created`, `status_updated`, `note_added`, `follow_up_scheduled`, `follow_up_completed`, `lead_edited`)
- `description`: `TEXT NOT NULL`
- `metadata`: `JSONB DEFAULT '{}'::jsonb`
- `created_at`: `TIMESTAMPTZ DEFAULT now()`

---

## 5. Security & Row-Level Security (RLS) Rules

1. **Role-Based Authorization**:
   - `counsellor`: Access only to leads they created or are assigned to, and related follow-ups/activities.
   - `manager`: Access to all team leads, follow-ups, and reports. Can assign leads.
   - `admin`: Full access including user role assignment and settings.
2. **Prevent Privilege Escalation**:
   - No user can modify their own `profiles.role` column through the frontend client. Role changes are restricted to admin operations or direct SQL.
3. **Secret Segregation**:
   - Never expose `SUPABASE_SERVICE_ROLE_KEY` or database passwords in browser bundles or Git.
   - Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are used in client code.

---

## 6. Commands Run Every Phase

```powershell
# 1. Quality verification
npm run lint
npm run build

# 2. Git deployment
git status
git add <files>
git commit -m "feat(<scope>): <description>"
git push origin main
```
