import { useState, useEffect } from "react";

const usePersist = () => {
    const [persisit , setPersist] =useState(JSON.parse(localStorage.getItem("persist"))||false)

    useEffect(()=>{
        localStorage.setItem("persist",JSON.stringify(persisit))
    },[persisit])


    return [persisit,setPersist]
}

export default usePersist
