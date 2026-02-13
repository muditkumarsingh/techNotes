import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials } from "../../features/auth/authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://technotes-api-cvmn.onrender.com',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {

    // console.log(args) // req url , method ,body
    // console.log(api) // signal , dispatch , getState()
    // console.log(extraOptions)

    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403 || [401, 403].includes(result?.error?.status)) {
        console.log('sending refresh token')

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {

            api.dispatch(setCredentials({ ...refreshResult.data }))

            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = 'Your Login window has expired. '
            }
            return refreshResult
        }
    }
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: (builder) => ({})
})