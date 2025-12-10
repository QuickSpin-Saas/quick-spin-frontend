import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BillingSummary, PaymentMethod, Invoice } from '@/types'

interface BillingState {
  billingSummary: BillingSummary | null
  paymentMethods: PaymentMethod[]
  invoices: Invoice[]
  loading: boolean
  error: string | null
}

const initialState: BillingState = {
  billingSummary: null,
  paymentMethods: [],
  invoices: [],
  loading: false,
  error: null,
}

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setBillingSummary: (state, action: PayloadAction<BillingSummary>) => {
      state.billingSummary = action.payload
      state.loading = false
      state.error = null
    },
    setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.paymentMethods = action.payload
    },
    addPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethods.push(action.payload)
    },
    removePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods = state.paymentMethods.filter(
        method => method.id !== action.payload
      )
    },
    setDefaultPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods = state.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === action.payload
      }))
    },
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.invoices = action.payload
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.unshift(action.payload)
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
  setBillingSummary,
  setPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  setInvoices,
  addInvoice,
  setLoading,
  setError,
  clearError,
} = billingSlice.actions

export default billingSlice.reducer