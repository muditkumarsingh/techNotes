import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const userAdaptor = createEntityAdapter({})

const initialState = userAdaptor.getInitialState()

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }), //keepunusedDataFor:5, //no subscription
            transformResponse: repsonseData => {
                const loadedUsers = repsonseData.map(user => {
                    user.id = user._id //in normalised data it looks for "id" property not "_id" property
                    return user
                });
                return userAdaptor.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                }
                else
                    return [{ type: 'User', id: 'LIST' }]
            }
        }),
        addNewUser: builder.mutation({
            query: (initialUserData) => ({
                url: '/users',
                method: "POST",
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [
                { type: "User", id: "LIST" }
            ]
        }),
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: "PATCH",
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: "DELETE",
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        })

    })
})

export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userApiSlice

//returns query result
export const selectUsersResults = userApiSlice.endpoints.getUsers.select()

//create memoized selector
const selectUsersData = createSelector(
    selectUsersResults,
    usersResult => usersResult.data //normalised satte object with ids and entities
)

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    //pass in a selector that returns the users slive of state
} = userAdaptor.getSelectors(state => selectUsersData(state) ?? initialState)