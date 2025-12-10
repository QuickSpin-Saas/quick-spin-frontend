import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from './slices/authSlice'
import servicesReducer from './slices/servicesSlice'
import billingReducer from './slices/billingSlice'
import uiReducer from './slices/uiSlice'
import adminReducer from './slices/adminSlice'
import { baseApi } from './api/baseApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    billing: billingReducer,
    ui: uiReducer,
    admin: adminReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(baseApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch