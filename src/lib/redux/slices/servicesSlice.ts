import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Service, TimeSeriesData, LogEntry } from '@/types'

interface ServicesState {
  services: Service[]
  currentService: Service | null
  serviceMetrics: {
    [serviceId: string]: {
      cpu: TimeSeriesData[]
      memory: TimeSeriesData[]
      network: TimeSeriesData[]
      requests: TimeSeriesData[]
    }
  }
  serviceLogs: {
    [serviceId: string]: LogEntry[]
  }
  loading: boolean
  error: string | null
  filters: {
    type?: string
    status?: string
    search?: string
  }
}

const initialState: ServicesState = {
  services: [],
  currentService: null,
  serviceMetrics: {},
  serviceLogs: {},
  loading: false,
  error: null,
  filters: {},
}

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<Service[]>) => {
      state.services = action.payload
      state.loading = false
      state.error = null
    },
    setCurrentService: (state, action: PayloadAction<Service | null>) => {
      state.currentService = action.payload
    },
    addService: (state, action: PayloadAction<Service>) => {
      state.services.push(action.payload)
    },
    updateService: (state, action: PayloadAction<Service>) => {
      const index = state.services.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.services[index] = action.payload
      }
      if (state.currentService?.id === action.payload.id) {
        state.currentService = action.payload
      }
    },
    deleteService: (state, action: PayloadAction<string>) => {
      state.services = state.services.filter(s => s.id !== action.payload)
      if (state.currentService?.id === action.payload) {
        state.currentService = null
      }
    },
    setServiceMetrics: (state, action: PayloadAction<{
      serviceId: string
      metrics: {
        cpu: TimeSeriesData[]
        memory: TimeSeriesData[]
        network: TimeSeriesData[]
        requests: TimeSeriesData[]
      }
    }>) => {
      state.serviceMetrics[action.payload.serviceId] = action.payload.metrics
    },
    setServiceLogs: (state, action: PayloadAction<{
      serviceId: string
      logs: LogEntry[]
    }>) => {
      state.serviceLogs[action.payload.serviceId] = action.payload.logs
    },
    addServiceLog: (state, action: PayloadAction<{
      serviceId: string
      log: LogEntry
    }>) => {
      if (!state.serviceLogs[action.payload.serviceId]) {
        state.serviceLogs[action.payload.serviceId] = []
      }
      state.serviceLogs[action.payload.serviceId].push(action.payload.log)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
    setFilters: (state, action: PayloadAction<{
      type?: string
      status?: string
      search?: string
    }>) => {
      state.filters = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setServices,
  setCurrentService,
  addService,
  updateService,
  deleteService,
  setServiceMetrics,
  setServiceLogs,
  addServiceLog,
  setLoading,
  setError,
  setFilters,
  clearError,
} = servicesSlice.actions

export default servicesSlice.reducer