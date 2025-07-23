import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/handleAuth.js"
const router = express.Router();


router.post('/register',async (req,res)=>{
    const response = await registerUser(req);
    if(response instanceof Error){
        res.status(401).json({
            "message":"Error while registering.Invalid input!"
        });
    }else{
        res.cookie("token",response,{
            httpOnly:true,
            sameSite:"strict",
            secure:false,
            maxAge:60*60*1000
        });
        res.status(200).json({
            "message":"User created successfully!"
        })
    }
});

router.post('/login',async (req,res)=>{
    const response = await loginUser(req);
    if(response instanceof Error){
        res.status(404).json({
            "message":`${response}`
        })
    }
    res.cookie("token",response,{
        httpOnly:true,
        sameSite:"strict",
        secure:false,
        maxAge:60*60*1000
    });
    res.status(200).json({
        "message":"Login successfull!"
    });
});


router.post("/me", (req,res)=>{
    const response = getMe(req);
    if(response.error){
        res.status(401).json(response);
    }
    res.status(200).json({
        user:response,
    })
})


router.post("/logout",(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
        sameSite:"strict",
        secure:false
    });
    res.status(200).json({
        message:"User logged out successfully"
    })
})

export default router;
