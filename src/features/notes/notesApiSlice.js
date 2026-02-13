import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const noteAdaptor = createEntityAdapter({
    sortComparer: (a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1
})

const initialState = noteAdaptor.getInitialState()

export const noteApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotes: builder.query({
            query: () => ({
                url: '/notes',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }),
            transformResponse: repsonseData => {
                const loadedNotes = repsonseData.map(note => {
                    note.id = note._id //in normalised data it looks for "id" property not "_id" property
                    return note
                });
                return noteAdaptor.setAll(initialState, loadedNotes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                }
                else
                    return [{ type: 'Note', id: 'LIST' }]
            }
        }),
        addNewNote: builder.mutation({
            query: intiialNote => ({
                url: '/notes',
                method: "POST",
                body: {
                    ...intiialNote
                }
            }),
            invalidatesTags: [
                { type: 'Note', id: 'LIST' }
            ]
        }),
        updateNote: builder.mutation({
            query: intialNote => ({
                url: '/notes',
                method: 'PATCH',
                body: {
                    ...intialNote
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Note", id: arg.id }
            ]
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: '/notes',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Note", id: arg.id }
            ]
        })
    })
})

export const {
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = noteApiSlice

//returns query result
export const selectNotesResults = noteApiSlice.endpoints.getNotes.select()

//create memoized selector
const selectNotesData = createSelector(
    selectNotesResults,
    notesResult => notesResult.data //normalised satte object with ids and entities
)

export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
    //pass in a selector that returns the notes slive of state
} = noteAdaptor.getSelectors(state => selectNotesData(state) ?? initialState)