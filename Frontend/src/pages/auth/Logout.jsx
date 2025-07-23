import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import AuthContext from "@/context/AuthContext"
import LogoutIcon from "@/lib/icons/LogoutIcon";
import { useContext } from "react"
import {useNavigate} from "react-router-dom";

const Logout = ()=>{
    const {setUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const clickHandler = async ()=>{
        try{
            await api.post("/auth/logout");
            setUser(null);
            navigate("/",{replace:true});
        }catch(err){
            console.error("Logout failed", err);
        }
    }   

    return (
        <Button onClick={clickHandler} className={"p-2 flex items-center gap-1 rounded-lg hover:cursor-pointer"}>
                <span>Logout</span>
                <LogoutIcon/>
        </Button>
    )
}

export default Logout;