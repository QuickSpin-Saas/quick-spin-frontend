import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, Service, AdminDashboardStats, SystemHealth, AnalyticsData } from '@/types'

interface AdminState {
  allUsers: User[]
  allServices: Service[]
  dashboardStats: AdminDashboardStats | null
  systemHealth: SystemHealth | null
  analytics: AnalyticsData | null
  loading: boolean
  error: string | null
  userFilters: {
    search?: string
    role?: string
    status?: string
  }
  serviceFilters: {
    type?: string
    status?: string
    region?: string
    userId?: string
  }
}

const initialState: AdminState = {
  allUsers: [],
  allServices: [],
  dashboardStats: null,
  systemHealth: null,
  analytics: null,
  loading: false,
  error: null,
  userFilters: {},
  serviceFilters: {},
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAllUsers: (state, action: PayloadAction<User[]>) => {
      state.allUsers = action.payload
      state.loading = false
      state.error = null
    },
    setAllServices: (state, action: PayloadAction<Service[]>) => {
      state.allServices = action.payload
      state.loading = false
      state.error = null
    },
    setDashboardStats: (state, action: PayloadAction<AdminDashboardStats>) => {
      state.dashboardStats = action.payload
      state.loading = false
      state.error = null
    },
    setSystemHealth: (state, action: PayloadAction<SystemHealth>) => {
      state.systemHealth = action.payload
      state.loading = false
      state.error = null
    },
    setAnalytics: (state, action: PayloadAction<AnalyticsData>) => {
      state.analytics = action.payload
      state.loading = false
      state.error = null
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.allUsers.findIndex(u => u.id === action.payload.id)
      if (index !== -1) {
        state.allUsers[index] = action.payload
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.allUsers = state.allUsers.filter(u => u.id !== action.payload)
    },
    updateService: (state, action: PayloadAction<Service>) => {
      const index = state.allServices.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.allServices[index] = action.payload
      }
    },
    deleteService: (state, action: PayloadAction<string>) => {
      state.allServices = state.allServices.filter(s => s.id !== action.payload)
    },
    setUserFilters: (state, action: PayloadAction<{
      search?: string
      role?: string
      status?: string
    }>) => {
      state.userFilters = action.payload
    },
    setServiceFilters: (state, action: PayloadAction<{
      type?: string
      status?: string
      region?: string
      userId?: string
    }>) => {
      state.serviceFilters = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setAllUsers,
  setAllServices,
  setDashboardStats,
  setSystemHealth,
  setAnalytics,
  updateUser,
  deleteUser,
  updateService,
  deleteService,
  setUserFilters,
  setServiceFilters,
  setLoading,
  setError,
  clearError,
} = adminSlice.actions

export default adminSlice.reducer