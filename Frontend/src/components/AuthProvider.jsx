import { useState, useEffect } from "react";
import api from "@/api/axios";
import AuthContext from "@/context/AuthContext";


const AuthProvider = ({children})=>{
    const [user,setUser] = useState(null);
    
    const getMe = async()=>{
        try{
            const response = await api.get("/me");
            setUser((user)=>response.data.user);
        }catch(err){   
            if (err.response?.status === 401) {
                console.warn("Unauthorized or token expired");
            }
            setUser(null);
        }
    }

    useEffect(()=>{
        getMe();
    },[]);


    return(
        <AuthContext.Provider value={{user,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthProvider;