import { baseApi } from './baseApi'
import { BillingSummary, PaymentMethod, Invoice } from '@/types'

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBillingSummary: builder.query<BillingSummary, void>({
      query: () => '/billing/summary',
      providesTags: ['Billing'],
    }),
    
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => '/billing/payment-methods',
      providesTags: ['Billing'],
    }),
    
    addPaymentMethod: builder.mutation<PaymentMethod, { type: 'card'; cardDetails: any }>({
      query: (data) => ({
        url: '/billing/payment-methods',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Billing'],
    }),
    
    removePaymentMethod: builder.mutation<void, string>({
      query: (id) => ({
        url: `/billing/payment-methods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Billing'],
    }),
    
    setDefaultPaymentMethod: builder.mutation<void, string>({
      query: (id) => ({
        url: `/billing/payment-methods/${id}/default`,
        method: 'POST',
      }),
      invalidatesTags: ['Billing'],
    }),
    
    getInvoices: builder.query<Invoice[], void>({
      query: () => '/billing/invoices',
      providesTags: ['Billing'],
    }),
    
    downloadInvoice: builder.mutation<Blob, string>({
      query: (id) => ({
        url: `/billing/invoices/${id}/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    updateBillingAlerts: builder.mutation<void, { enabled: boolean; threshold?: number }>({
      query: (data) => ({
        url: '/billing/alerts',
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
})

export const {
  useGetBillingSummaryQuery,
  useGetPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useRemovePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useGetInvoicesQuery,
  useDownloadInvoiceMutation,
  useUpdateBillingAlertsMutation,
} = billingApi