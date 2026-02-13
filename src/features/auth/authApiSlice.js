import { apiSlice } from "../../app/api/apiSlice";
import { logout,setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            //this allows us to avoid
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled //cookie clear
                    console.log(data)

                    dispatch(logout())//set token to null
                    

                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }), 
            async onQueryStarted(arg,{dispatch,queryFulfilled}){
                try{
                    const {data} = await queryFulfilled
                    console.log(data)
                    const {accessToken}=data
                    dispatch(setCredentials({accessToken}))
                }catch(err){
                    console.log(err)
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation
} = authApiSlice