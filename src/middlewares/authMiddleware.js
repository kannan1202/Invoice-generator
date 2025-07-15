import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function verifyUser(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            "message": "Access denied!"
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const userId = await prisma.user.findUnique({
            where:{
                email:decoded.email
            },
            select:{
                id:true
            }
        })
        req.userId = userId;
        next()
    }catch(err){
        return res.status(400).json({
            "error":err.message
        })
    }
    
}

export default verifyUser;
