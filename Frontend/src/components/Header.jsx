import GetStartedIcon from "@/lib/icons/GetStartedIcon";
import LoginIcon from "@/lib/icons/LoginIcon";
import Logout from "@/pages/auth/Logout";
import { Link, useLocation} from "react-router-dom"

const Header = ()=>{

    const location = useLocation();

    return (
        <div className="flex justify-between font-mono">
            <Link to={"/"}><h1 className="font-extrabold text-3xl">InvoiceEasy</h1></Link>
            { location.pathname==="/dashboard" ?(
                <Logout />    
            ) : ( !["/login", "/register"].includes(location.pathname) ?
                <div className="space-x-4 flex justify-between">
                    <Link to="/login" className="flex items-center gap-1">
                        <span>Login</span>
                        <LoginIcon />
                    </Link>
                    
                    <Link to={"/register"} className={'p-2 flex items-center gap-1 bg-blue-300 rounded-lg '}>
                        <span>Get Started</span>
                        <GetStartedIcon />
                    </Link>
                </div>
            :null)}
        </div>
    )
}

export default Header;
