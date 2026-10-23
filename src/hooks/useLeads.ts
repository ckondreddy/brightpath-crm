import { useState, useEffect, useCallback, useRef } from 'react'
import { LeadStatus, LeadSource } from '../types'
import { 
  fetchLeads, 
  fetchLeadStatusCounts, 
  LeadWithRelations, 
  LeadStatusCounts 
} from '../services/leadService'
import { useLeadModal } from '../context/useLeadModal'

export interface UseLeadsReturn {
  leads: LeadWithRelations[]
  totalCount: number
  statusCounts: LeadStatusCounts
  loading: boolean
  error: string | null
  // Active Filters
  searchQuery: string
  setSearchQuery: (val: string) => void
  statusFilter: LeadStatus | 'all'
  setStatusFilter: (val: LeadStatus | 'all') => void
  sourceFilter: LeadSource | 'all'
  setSourceFilter: (val: LeadSource | 'all') => void
  counsellorFilter: string | 'all'
  setCounsellorFilter: (val: string | 'all') => void
  // Sorting & Pagination
  sortBy: 'created_at' | 'full_name' | 'status'
  setSortBy: (val: 'created_at' | 'full_name' | 'status') => void
  sortOrder: 'asc' | 'desc'
  toggleSort: (column: 'created_at' | 'full_name' | 'status') => void
  page: number
  setPage: (val: number) => void
  pageSize: number
  totalPages: number
  hasActiveFilters: boolean
  resetFilters: () => void
  refetch: () => Promise<void>
}

export function useLeads(initialPageSize = 15): UseLeadsReturn {
  const { lastCreatedLead } = useLeadModal()

  // Data state
  const [leads, setLeads] = useState<LeadWithRelations[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [statusCounts, setStatusCounts] = useState<LeadStatusCounts>({
    all: 0,
    New: 0,
    Contacted: 0,
    Qualified: 0,
    Converted: 0,
    Lost: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter & Query states
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all')
  const [counsellorFilter, setCounsellorFilter] = useState<string | 'all'>('all')
  const [sortBy, setSortBy] = useState<'created_at' | 'full_name' | 'status'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [manualRefreshKey, setManualRefreshKey] = useState(0)
  const pageSize = initialPageSize

  // 300ms Search Debounce
  const searchTimeoutRef = useRef<number | null>(null)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
      setLoading(true)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Fetch status counts asynchronously without synchronous setState in effect
  useEffect(() => {
    let isMounted = true

    fetchLeadStatusCounts().then((counts) => {
      if (isMounted) {
        setStatusCounts(counts)
      }
    })

    return () => {
      isMounted = false
    }
  }, [lastCreatedLead, manualRefreshKey])

  // Fetch leads asynchronously without synchronous setState in effect
  useEffect(() => {
    let isMounted = true

    fetchLeads({
      searchQuery: debouncedSearch,
      status: statusFilter,
      source: sourceFilter,
      assignedTo: counsellorFilter,
      sortBy,
      sortOrder,
      page,
      pageSize,
    }).then((result) => {
      if (!isMounted) return

      if (result.error) {
        setError(result.error)
      } else {
        setLeads(result.data)
        setTotalCount(result.count)
        setError(null)
      }
      setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [
    debouncedSearch,
    statusFilter,
    sourceFilter,
    counsellorFilter,
    sortBy,
    sortOrder,
    page,
    pageSize,
    lastCreatedLead,
    manualRefreshKey,
  ])

  const toggleSort = useCallback((column: 'created_at' | 'full_name' | 'status') => {
    setLoading(true)
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
    setPage(1)
  }, [sortBy])

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    statusFilter !== 'all' ||
    sourceFilter !== 'all' ||
    counsellorFilter !== 'all'
  )

  const resetFilters = useCallback(() => {
    setLoading(true)
    setSearchQuery('')
    setDebouncedSearch('')
    setStatusFilter('all')
    setSourceFilter('all')
    setCounsellorFilter('all')
    setPage(1)
  }, [])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return {
    leads,
    totalCount,
    statusCounts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter: (val) => {
      setLoading(true)
      setStatusFilter(val)
      setPage(1)
    },
    sourceFilter,
    setSourceFilter: (val) => {
      setLoading(true)
      setSourceFilter(val)
      setPage(1)
    },
    counsellorFilter,
    setCounsellorFilter: (val) => {
      setLoading(true)
      setCounsellorFilter(val)
      setPage(1)
    },
    sortBy,
    setSortBy: (val) => {
      setLoading(true)
      setSortBy(val)
      setPage(1)
    },
    sortOrder,
    toggleSort,
    page,
    setPage: (val) => {
      setLoading(true)
      setPage(val)
    },
    pageSize,
    totalPages,
    hasActiveFilters,
    resetFilters,
    refetch: async () => {
      setLoading(true)
      setManualRefreshKey((k) => k + 1)
    },
  }
}
