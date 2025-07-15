import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import * as z from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(8)
})


export const registerUser = async (req)=>{
    const result = userSchema.safeParse(req.body);
    if(!result.success){
        return result.error;
    }else{
        const {name,email,password} = result.data;
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password
            },
            select:{
                id:true,
                email:true
            }
        });
        const token = jwt.sign(user,process.env.JWT_SECRET,{expiresIn:"1hr"});
        return token;
    }
};

export const loginUser = async (req)=>{
    const email = req.email;
    const user = await prisma.user.findUnique({
        where:{
            email
        },
        select:{
            name:true,
            email:true
        }
    });
    if(!user){
        return new Error("User not found!");
    }
    const token = jwt.sign(user,process.env.JWT_SECRET,{expiresIn:"1hr"});
    return token;
};