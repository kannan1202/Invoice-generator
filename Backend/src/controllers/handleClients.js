import { PrismaClient } from "@prisma/client";
import * as z from "zod";


const prisma = new PrismaClient();

const clientSchema = z.object({
    name:z.string(),
    company:z.string(),
    email:z.string().email(),
    phoneNumber:z.string()
});

const updateClientSchema = z.object({
    name:z.string().optional(),
    company:z.string().optional(),
    email:z.string().email().optional(),
    phoneNumber:z.string().optional()
}).refine(data=>{
    return data.name!==undefined||data.company!==undefined||data.email!==undefined||data.phoneNumber!==undefined,
    {
        message:"Atleast one field must be provided!",
        path:[]
    }
});


export const createClient = async (req)=>{
    const result = clientSchema.safeParse(req.body);
    if(!result.success){
        return {error:"Input is invalid"}
    } 
    const {name,company,email,phoneNumber} = result.data;
    try{
        const client = await prisma.client.create({
        data:{
            name,
            company,
            email,
            phoneNumber,
            userId:req.userId
        },
        select:{
            id:true
        }
        })                  
        return {"message":`Client created successfully with the clientID:${client.id}`}
    }catch(err){
        return {error:"Failed to create client!"}
    }
}

export const getAllClients = async (req)=>{
    try{
        const clients = await prisma.client.findMany({
        where:{
            userId:req.userId
        },
        include:{
            invoices:{
                select:{
                    uuid:true,
                    amount:true,
                    dueDate:true,
                    status:true
                }
            }
        }
    });
    return clients;
    }catch(err){
        return {error:"Failed to fetch clients!"}
    }

}

export const getClient = async (req)=>{
    try{
        const client = await prisma.client.findFirst({
        where:{
            id:req.params.id,
            userId:req.userId
        },
        include:{
            invoices:{
                select:{
                    uuid:true,
                    amount:true,
                    dueDate:true,
                    status:true
                }
            }
        }
    });
    return client;
    }catch(err){
        return {error:`Failed to fetch client with id:${req.params.id}`}
    }
}

export const updateClientDetails = async (req)=>{

    const client = await prisma.client.findFirst({
    where: {
        id: req.params.id,
        userId: req.userId
    }
    });

    if (!client) {
    return { error: "Client not found or unauthorized" };
    }

    const result = updateClientSchema.safeParse(req.body);
    if(!result.success){
        return {error:"Input(s) are invalid!"}
    }
    const validated = result.data;
    const updateData = {}

    if(validated.name!==undefined){
        updateData.name = validated.name
    }

    if(validated.company!==undefined){
        updateData.company = validated.company
    }

    if(validated.email!==undefined){
        updateData.email = validated.email
    }

    if(validated.phoneNumber!==undefined){
        updateData.phoneNumber = validated.phoneNumber
    }

    try{
        const updatedClient = await prisma.client.update({
        where:{
            id:req.params.id
        },
        data:updateData,
        select:{
            id:true,
            name:true,
            company:true
        }
    });
    return updatedClient;
    }catch(err){
        return {error:"Failed to update client!"}
    }

}

export const deleteClient = async (req)=>{
    try{
        const client = await prisma.client.findFirst({
            where:{
                id:req.params.id,
                userId:req.userId
            }
        });

        if(!client){
            return {error:"Client not found"}
        }
        const deletedClient = await prisma.client.delete({
            where:{
                id:req.params.id
            }
            });
        return deletedClient;
    }catch(err){
        return {error:"Failed to delete client!"}
    }
}