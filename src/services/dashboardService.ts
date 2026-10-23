import { supabase } from '../lib/supabaseClient'
import { FollowUpWithLead } from './followupService'

export interface StatusDistributionItem {
  status: string
  count: number
  percentage: number
  color: string
}

export interface SourceFunnelItem {
  source: string
  count: number
  percentage: number
}

export interface CourseTrackItem {
  course: string
  enquiries: number
  enrolled: number
  conversionRate: number
}

export interface RecentLeadItem {
  id: string
  full_name: string
  phone: string
  course_interest: string
  status: string
  source: string
  created_at: string
  assignee_name?: string
}

export interface DashboardMetrics {
  totalLeads: number
  newLeadsCount: number
  contactedLeadsCount: number
  qualifiedLeadsCount: number
  convertedLeadsCount: number
  lostLeadsCount: number
  conversionRate: number
  newThisWeekCount: number
  overdueFollowUpsCount: number
  todayFollowUpsCount: number
  statusDistribution: StatusDistributionItem[]
  sourceFunnel: SourceFunnelItem[]
  courseTrackDistribution: CourseTrackItem[]
  recentLeads: RecentLeadItem[]
  priorityFollowUps: FollowUpWithLead[]
}

const STATUS_COLORS: Record<string, string> = {
  New: '#3b82f6',
  Contacted: '#f59e0b',
  Qualified: '#8b5cf6',
  Converted: '#10b981',
  Lost: '#ef4444',
}

/**
 * Reconciles live metrics for the executive dashboard
 */
export async function fetchDashboardMetrics(): Promise<{
  data: DashboardMetrics | null
  error: string | null
}> {
  if (!supabase) {
    return { data: null, error: 'Database client is not configured.' }
  }

  try {
    const now = new Date()
    const nowTime = now.getTime()
    const sevenDaysAgo = new Date(nowTime - 7 * 24 * 60 * 60 * 1000).toISOString()
    const nowIso = now.toISOString()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString()
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()

    // 1. Fetch all leads with assignee
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select(`
        id,
        full_name,
        phone,
        course_interest,
        source,
        status,
        created_at,
        assigned_to,
        assignee:profiles!leads_assigned_to_fkey(full_name)
      `)
      .order('created_at', { ascending: false })

    if (leadsError) {
      console.error('Error fetching dashboard leads:', leadsError)
      return { data: null, error: leadsError.message }
    }

    const leads = leadsData || []
    const totalLeads = leads.length

    // Status breakdown
    let newLeadsCount = 0
    let contactedLeadsCount = 0
    let qualifiedLeadsCount = 0
    let convertedLeadsCount = 0
    let lostLeadsCount = 0
    let newThisWeekCount = 0

    const sourceCounts: Record<string, number> = {}
    const courseStats: Record<string, { enquiries: number; enrolled: number }> = {}

    for (const lead of leads) {
      // Status counting
      if (lead.status === 'New') newLeadsCount++
      else if (lead.status === 'Contacted') contactedLeadsCount++
      else if (lead.status === 'Qualified') qualifiedLeadsCount++
      else if (lead.status === 'Converted') convertedLeadsCount++
      else if (lead.status === 'Lost') lostLeadsCount++

      // This week
      if (lead.created_at >= sevenDaysAgo) {
        newThisWeekCount++
      }

      // Source distribution
      const src = lead.source || 'Other'
      sourceCounts[src] = (sourceCounts[src] || 0) + 1

      // Course track distribution
      const course = lead.course_interest || 'General Academic Track'
      if (!courseStats[course]) {
        courseStats[course] = { enquiries: 0, enrolled: 0 }
      }
      courseStats[course].enquiries++
      if (lead.status === 'Converted') {
        courseStats[course].enrolled++
      }
    }

    const conversionRate = totalLeads > 0
      ? Number(((convertedLeadsCount / totalLeads) * 100).toFixed(1))
      : 0

    // Build status distribution array
    const statusKeys = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost']
    const statusCountsMap: Record<string, number> = {
      New: newLeadsCount,
      Contacted: contactedLeadsCount,
      Qualified: qualifiedLeadsCount,
      Converted: convertedLeadsCount,
      Lost: lostLeadsCount,
    }

    const statusDistribution: StatusDistributionItem[] = statusKeys.map((s) => ({
      status: s,
      count: statusCountsMap[s],
      percentage: totalLeads > 0 ? Number(((statusCountsMap[s] / totalLeads) * 100).toFixed(1)) : 0,
      color: STATUS_COLORS[s] || '#64748b',
    }))

    // Build source funnel
    const sourceFunnel: SourceFunnelItem[] = Object.entries(sourceCounts)
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalLeads > 0 ? Number(((count / totalLeads) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    // Build course track distribution
    const courseTrackDistribution: CourseTrackItem[] = Object.entries(courseStats)
      .map(([course, stats]) => ({
        course,
        enquiries: stats.enquiries,
        enrolled: stats.enrolled,
        conversionRate: stats.enquiries > 0
          ? Number(((stats.enrolled / stats.enquiries) * 100).toFixed(1))
          : 0,
      }))
      .sort((a, b) => b.enquiries - a.enquiries)
      .slice(0, 5)

    // Recent leads
    const recentLeads: RecentLeadItem[] = leads.slice(0, 5).map((l) => ({
      id: l.id,
      full_name: l.full_name,
      phone: l.phone,
      course_interest: l.course_interest,
      status: l.status,
      source: l.source,
      created_at: l.created_at,
      assignee_name: (l.assignee as unknown as { full_name: string })?.full_name || 'Unassigned',
    }))

    // 2. Fetch follow-up tasks for overdue and priority list
    const { data: followUpsData, error: followUpsError } = await supabase
      .from('follow_ups')
      .select(`
        *,
        lead:leads(id, full_name, phone, course_interest, status, assigned_to),
        assignee:profiles!follow_ups_assigned_to_fkey(id, full_name, role)
      `)
      .eq('status', 'pending')
      .order('due_at', { ascending: true })

    if (followUpsError) {
      console.error('Error fetching dashboard follow-ups:', followUpsError)
    }

    const pendingTasks = (followUpsData as unknown as FollowUpWithLead[]) || []
    let overdueFollowUpsCount = 0
    let todayFollowUpsCount = 0

    for (const task of pendingTasks) {
      if (task.due_at < nowIso) {
        overdueFollowUpsCount++
      } else if (task.due_at >= startOfToday && task.due_at <= endOfToday) {
        todayFollowUpsCount++
      }
    }

    const priorityFollowUps = pendingTasks.slice(0, 4)

    return {
      data: {
        totalLeads,
        newLeadsCount,
        contactedLeadsCount,
        qualifiedLeadsCount,
        convertedLeadsCount,
        lostLeadsCount,
        conversionRate,
        newThisWeekCount,
        overdueFollowUpsCount,
        todayFollowUpsCount,
        statusDistribution,
        sourceFunnel,
        courseTrackDistribution,
        recentLeads,
        priorityFollowUps,
      },
      error: null,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected error loading dashboard metrics.'
    return { data: null, error: msg }
  }
}
