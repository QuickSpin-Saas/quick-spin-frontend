import { baseApi } from './baseApi'
import { UserStats } from '@/types'

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserStats: builder.query<UserStats, void>({
      query: () => '/users/stats',
      providesTags: ['User'],
    }),
  }),
})

export const {
  useGetUserStatsQuery,
} = usersApi