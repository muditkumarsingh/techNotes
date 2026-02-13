import { useGetNotesQuery } from "../notes/notesApiSlice"
import User from "./User";
import { useGetUsersQuery } from "./usersApiSlice";
const UsersList = () => {

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000,
        refetchOnFocus: true, //on changing the data  
        refetchOnMountOrArgChange: true //
    })

    // if more then one employee have open same data , so if one changes , we might get stale data , refresh data at some type of interval

    let content;

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = users;


        const tableContent = ids?.length && ids.map(userId => <User key={userId} userId={userId} />)


        content = (
            <table className="table table--users">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table_th user__username">Username</th>
                        <th scope="col" className="table_th user__roles">Roles</th>
                        <th scope="col" className="table_th user__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }
    //flatent structure to table to apply grid

    return content

}

export default UsersList
