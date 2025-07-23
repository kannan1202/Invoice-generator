import { useContext, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import AuthContext  from "@/context/AuthContext";

const ProtectedRoute = ({children})=>{
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(()=>{
        if(!user){
            navigate("/");
        }
    },[user,navigate]);

    if(!user) return <p>Loading...</p>;

    return children;
}

export default ProtectedRoute;