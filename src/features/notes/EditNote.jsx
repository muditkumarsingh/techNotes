import { useParams } from "react-router-dom"
import {  useGetUsersQuery } from "../users/usersApiSlice"
import EditNoteForm from "./EditNoteForm"
import { useGetNotesQuery } from "./notesApiSlice"
import useAuth from "../../hooks/useAuth"
import PulseLoader from "react-spinners/PulseLoader"

const EditNote = () => {

    const { id } = useParams()

    const {username , isManager,isAdmin} = useAuth()

    const {note} = useGetNotesQuery("notesList",{
        selectFromResult:({data})=>({
            note:data?.entities[id]
        })
    })

    const {users} = useGetUsersQuery("usersList",{
        selectFromResult:({data})=>({
            users:data?.ids.map(id=>data?.entities[id])
        })
    })
    //entities cannot be interated 

    if(!note||!users?.length)return <PulseLoader color={"#FFF"} />

    if(!isManager||!isAdmin){
        if(note.username!==username){
            return <p className="errmsg">No Access</p> //adds an extra layer of security so that no other use can change any ones data
        }
    }

    const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>

    return (content)
}

export default EditNote
