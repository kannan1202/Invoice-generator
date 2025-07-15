import express from "express";
const router = express.Router();
import { registerUser, loginUser } from "../controllers/handleAuth";


router.post('/register',(req,res)=>{
    const response = registerUser(req);
    if(response instanceof Error){
        res.status(401).json({
            "message":"Error while registering.Invalid input!"
        });
    }else{
        res.cookie(token,response,{
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

router.post('/login',(req,res)=>{
    const response = loginUser(req);
    if(response instanceof Error){
        res.status(404).json({
            "message":`${response}`
        })
    }
    res.cookie(token,response,{
        httpOnly:true,
        sameSite:"strict",
        secure:false,
        maxAge:60*60*1000
    });
    res.status(400).json({
        "message":"Login successfull!"
    });
});

export default router;
