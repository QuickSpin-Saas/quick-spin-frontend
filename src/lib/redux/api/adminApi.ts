import { baseApi } from './baseApi'
import { User, Service, AdminDashboardStats, SystemHealth, AnalyticsData } from '@/types'

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], { search?: string; role?: string; status?: string }>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['User'],
    }),
    
    getAllServices: builder.query<Service[], { type?: string; status?: string; region?: string; userId?: string }>({
      query: (params) => ({
        url: '/admin/services',
        params,
      }),
      providesTags: ['Service'],
    }),
    
    getDashboardStats: builder.query<AdminDashboardStats, void>({
      query: () => '/admin/dashboard',
    }),
    
    getSystemHealth: builder.query<SystemHealth, void>({
      query: () => '/admin/health',
    }),
    
    getAnalytics: builder.query<AnalyticsData, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin/analytics',
        params,
      }),
    }),
    
    // User management
    suspendUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/suspend`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    unsuspendUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/unsuspend`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    
    resetUserPassword: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/reset-password`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Service management
    bulkStartServices: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: '/admin/services/bulk/start',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['Service'],
    }),
    
    bulkStopServices: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: '/admin/services/bulk/stop',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['Service'],
    }),
    
    bulkDeleteServices: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: '/admin/services/bulk/delete',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['Service'],
    }),
    
    // Billing analytics
    getRevenueAnalytics: builder.query<{
      mrr: number
      arr: number
      growthRate: number
      breakdownByPlan: Array<{ plan: string; revenue: number; users: number }>
      topSpendingUsers: Array<{ user: User; totalSpent: number }>
    }, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin/billing/analytics',
        params,
      }),
    }),
    
    getFailedPayments: builder.query<any[], { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/admin/billing/failed-payments',
        params,
      }),
    }),
    
    processRefund: builder.mutation<void, { paymentId: string; amount: number; reason: string }>({
      query: (data) => ({
        url: '/admin/billing/refunds',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useGetAllUsersQuery,
  useGetAllServicesQuery,
  useGetDashboardStatsQuery,
  useGetSystemHealthQuery,
  useGetAnalyticsQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useDeleteUserMutation,
  useResetUserPasswordMutation,
  useBulkStartServicesMutation,
  useBulkStopServicesMutation,
  useBulkDeleteServicesMutation,
  useGetRevenueAnalyticsQuery,
  useGetFailedPaymentsQuery,
  useProcessRefundMutation,
} = adminApi