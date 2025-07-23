import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/api/axios"
import {Link} from "react-router-dom"
import AuthContext from "@/context/AuthContext";
import { useContext, useState } from "react";
import {useNavigate} from "react-router-dom"


const LoginSchema = z.object({
    email:z.string().email(),
    password:z.string().min(8,{
        message:"Password must be atleast 8 characters long"
    })
});

const LoginForm = ()=>{
    const form = useForm({
        resolver:zodResolver(LoginSchema),
        defaultValues:{
            email:"",
            password:""
        }
    })

    const {setUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const [errorMsg,setErrorMsg] = useState("");

    const onSubmit = async (data)=>{
        setErrorMsg("");
        try{
            const response = await api.post("/auth/login",{
                email:data.email,
                password:data.password
            });
            const userResponse = await api.post("/auth/me");
            if(userResponse?.data?.error){
                setErrorMsg(userResponse.data.error);
                return
            }
            setUser(userResponse.data.user);
            navigate("/dashboard", { replace: true });

        }catch(err){
            setErrorMsg(err.message || "Something went wrong");
        }
    }
    return(
        <div className="flex justify-center items-center min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md p-6 rounded-xl shadow-xl space-y-6 bg-white/30 backdrop-blur-md border border-white/20 font-mono">
                    {errorMsg && (
                        <p className="text-red-500 text-sm mt-2">
                            {errorMsg}
                        </p>
                    )}
                    <FormField 
                        name="email"
                        control={form.control}
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type={"email"} placeholder="johndoe@example.com" {...field} className={"bg-white"}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField 
                        name="password"
                        control={form.control}
                        render={
                            ({field})=>(
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type={"password"} placeholder={"••••••••"} {...field} className={"bg-white"}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }
                    />
                    <Button type={"submit"} className={"w-full hover:cursor-pointer"}>Submit</Button>
                    <p className="text-sm text-center text-gray-500 font-extralight">Don't have an account? <Link to={"/register"} className={"underline text-blue-500"}>Register</Link></p>
                </form>
            </Form>
        </div>
    )
}

export default LoginForm;