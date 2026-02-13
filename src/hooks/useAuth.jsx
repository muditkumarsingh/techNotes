import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {

    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let status = "Employee"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        const rolesArray = Array.isArray(roles) ? roles : [roles]

        isManager = rolesArray.includes('Manager')
        isAdmin = rolesArray.includes('Admin')

        if (isAdmin) status = "Admin"
        else if (isManager) status = "Manager"

        return { username, roles: rolesArray, status, isManager, isAdmin }
    }



    return { username: '', roles: [], isManager, isAdmin, status }
}

export default useAuth
