import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {
Form,
FormItem,
FormField,
FormLabel,
FormControl,
FormDescription,
FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from "@/api/axios"
import {Link} from "react-router-dom"
import { useContext, useState } from "react"
import AuthContext from "@/context/AuthContext"
import {useNavigate} from 'react-router-dom'

const RegisterSchema = z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(8,{
        message:"Password must be atleast 8 characters long"
    }),
    confirmPassword:z.string(),
    businessName:z.string().optional()
}).refine(data=>data.password===data.confirmPassword,{
    message:"password and confirm password must match",
    path:["confirmPassword"]
});

const RegisterForm = ()=>{
    const form = useForm({
        resolver:zodResolver(RegisterSchema),
    defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        businessName: "",
    },
    });
    const navigate = useNavigate();
    const {setUser} = useContext(AuthContext);
    const [errorMsg,setErrorMsg] = useState("");

    const onSubmit = async (data)=>{
        setErrorMsg("");
        try{
            const response = await api.post("/auth/register",{
                name:data.name,
                email:data.email,
                password:data.password,
                businessName:data.businessName
            });
            const userResponse = await api.post("/auth/me");
            if(userResponse?.data?.error){
                setErrorMsg(userResponse.data.error);
                return;
            }
            setUser(userResponse.data.user);
            navigate("/dashboard",{replace:true}) 
        }catch(err){
            setErrorMsg(err.message || "Something went wrong");
        }
        

    }

    return(
        <div className={"flex justify-center items-center min-h-screen"}>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"w-full max-w-md p-6 rounded-xl shadow-xl space-y-6 bg-white/30 backdrop-blur-md border border-white/20 font-mono"}>
                {errorMsg && (
                    <p className="text-red-500 text-sm mt-2">
                        {errorMsg}
                    </p>
                )}
                <FormField
                    name="name"
                    control={form.control}
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="coolcoder45" {...field} className={"bg-white"}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="email"
                    control={form.control}
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} className={"bg-white"}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="password"
                    control={form.control}
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Password
                            </FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="At least 8 characters" {...field} className={"bg-white"}/>
                            </FormControl>
                            <FormDescription>Include a mix of uppercase and lowercase letters, numbers, and symbols.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Confirm Password
                            </FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Retype your password" {...field} className={"bg-white"}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    
                />
                <FormField
                    name="businessName"
                    control={form.control}
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Business Name
                            </FormLabel>
                            <FormControl>
                                <Input type={"text"} placeholder="FlexiGigs" {...field} className={"bg-white"}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    
                />
                <Button type="submit" className={"w-full hover:cursor-pointer"}>Submit</Button>
                <p className="text-sm text-center text-gray-500 font-extralight">Already an user? <Link to={"/login"} className={"underline text-blue-500"}>Login</Link></p>
            </form>
        </Form>
        </div>
    )
}

export default RegisterForm;