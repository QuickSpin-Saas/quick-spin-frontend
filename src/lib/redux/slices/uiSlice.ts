import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '@/types'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  notifications: Notification[]
  loadingStates: {
    [key: string]: boolean
  }
  modals: {
    [key: string]: {
      isOpen: boolean
      data?: any
    }
  }
  toasts: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>
}

const initialState: UIState = {
  theme: 'system',
  sidebarCollapsed: false,
  notifications: [],
  loadingStates: {},
  modals: {},
  toasts: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loadingStates[action.payload.key] = action.payload.loading
    },
    openModal: (state, action: PayloadAction<{ key: string; data?: any }>) => {
      state.modals[action.payload.key] = {
        isOpen: true,
        data: action.payload.data,
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].isOpen = false
      }
    },
    addToast: (state, action: PayloadAction<{
      id: string
      type: 'success' | 'error' | 'warning' | 'info'
      message: string
      duration?: number
    }>) => {
      state.toasts.push(action.payload)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
    },
    clearToasts: (state) => {
      state.toasts = []
    },
  },
})

export const {
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  setLoading,
  openModal,
  closeModal,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions

export default uiSlice.reducer