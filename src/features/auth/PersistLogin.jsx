import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";


const PersistLogin = () => {

    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,//refresh function is not called
        isLoading,
        isSuccess, //succresful when credential are set
        isError,
        error
    }] = useRefreshMutation()

    //this is done to avoid twice run by strict mode
    useEffect(() => {
        if (!persist) return

        const verifyRefreshToken = async () => {
            console.log('verifying refresh token')
            try {
                await refresh().unwrap()
                setTrueSuccess(true)
            } catch (err) {
                console.error(err)
            }
        }

        if (!token) {
            verifyRefreshToken()
        }
    }, [persist, token, refresh])


    let content;
    if (!persist) { //no persist 
        console.log("No persist")
        content = <Outlet />
    } else if (isLoading) {// persist:yes , token: no
        console.log('loading')
        content = <p>Loading...</p>
    } else if (isError) { //persist : yes, token:no
        console.log('error')
        content = (
            <p className="errmsg">
                {`${error?.data?.message} - `} <Link to='/login' >Please login again</Link>
            </p>
        )
    } else if (isSuccess || trueSuccess) { // persist - yes , token - yes
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) {
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}

export default PersistLogin
