import { baseApi } from './baseApi'
import { Service, GetServicesParams, CreateServiceData, ApiResponse } from '@/types'

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<Service[], GetServicesParams>({
      query: (params) => ({
        url: '/services',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Service' as const, id })),
              { type: 'Service', id: 'LIST' },
            ]
          : [{ type: 'Service', id: 'LIST' }],
    }),
    
    getService: builder.query<Service, string>({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    
    createService: builder.mutation<Service, CreateServiceData>({
      query: (data) => ({
        url: '/services',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),
    
    updateService: builder.mutation<Service, { id: string; data: Partial<Service> }>({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Service', id },
        { type: 'Service', id: 'LIST' },
      ],
    }),
    
    deleteService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Service', id },
        { type: 'Service', id: 'LIST' },
      ],
    }),
    
    startService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    
    stopService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}/stop`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    
    restartService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}/restart`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    
    getServiceMetrics: builder.query<{
      cpu: any[]
      memory: any[]
      network: any[]
      requests: any[]
    }, string>({
      query: (id) => `/services/${id}/metrics`,
      providesTags: (result, error, id) => [{ type: 'Metrics', id }],
    }),
    
    getServiceLogs: builder.query<any[], string>({
      query: (id) => `/services/${id}/logs`,
      providesTags: (result, error, id) => [{ type: 'Logs', id }],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useStartServiceMutation,
  useStopServiceMutation,
  useRestartServiceMutation,
  useGetServiceMetricsQuery,
  useGetServiceLogsQuery,
} = servicesApi