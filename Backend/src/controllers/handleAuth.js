import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import * as z from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const userSchema = z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(8),
    businessName:z.string().optional()
})


export const registerUser = async (req)=>{
    const result = userSchema.safeParse(req.body);
    if(!result.success){
        return result.error;
    }else{
        const {name,email,password,businessName} = result.data;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new Error("User already exists with this email.");
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword,
                businessName
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
    const email = req.body.email;
    const password = req.body.password;
    const user = await prisma.user.findUnique({
        where:{
            email
        },
        select:{
            id:true,
            email:true,
            password:true
        }
    });
    if(!user){
        return new Error("User not found!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return new Error("Incorrect password");
    }

    const token = jwt.sign({ id: user.id, email: user.email },process.env.JWT_SECRET,{expiresIn:"1hr"});
    return token;
};


export const getMe = (req)=>{
    const token = req.cookies.token;
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        return decoded;
    }catch(err){
        return {error:err.message}
    }
    
}
