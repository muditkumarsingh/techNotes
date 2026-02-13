import { useEffect } from "react"
import { store } from "../../app/store"
import { noteApiSlice } from "../notes/notesApiSlice"
import { userApiSlice } from "../users/usersApiSlice"
import { Outlet } from "react-router-dom"

const Prefetch = () => {
    //we neeed that data is avilable for the entire duration of the 
    useEffect(() => {
        console.log('subscribing');
        const notes = store.dispatch(noteApiSlice.util.prefetch('getNotes', 'notesList', { force: true }))
        const users = store.dispatch(userApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
        //we create a manual subscription to notes then
        //allows to to get all the state including prefilling all our forms on reload

    }, [])
    //only run once

    return (<Outlet />)
}

export default Prefetch
