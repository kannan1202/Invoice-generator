import { PrismaClient } from "@prisma/client"
import * as z from "zod";


const prisma = new PrismaClient();

const updateInvoiceSchema = z.object({
    amount:z.string().optional(),
    dueDate:z.string().optional(),
    status:z.enum(["PENDING,PAID,OVERDUE"]).optional()
}).refine(data=>data.amount!==undefined||data.dueDate!==undefined||data.status!==undefined,
    {
        message:"At least one field (amount, dueDate, or status) must be provided.",
        path:[] //applies error to entire object,not to single field.
    });


export const createInvoice = async (req)=>{
    const client = await prisma.client.findFirst({
        where:{
            id:req.body.clientId,
            userId:req.userId
        }
    });
    if(!client){
        return new Error("You do not own this client.");
    }else{
        const {amount,dueDate,status,clientId} = req.body;
        try{
            const invoiceUuid = await prisma.invoice.create({
            data:{
                amount,
                dueDate,
                status,
                userId:req.userId,
                clientId
            },
            select:{
                uuid:true
            }
            });
            return invoiceUuid;
        }catch(err){
            return {error:"Failed to create invoice.Something went wrong!"};
        }

    }
};


export const getAllInvoices = async (req)=>{
    try{
        const invoices = await prisma.invoice.findMany({
        where:{
            userId:req.userId
        },
        include:{
            client:{
                select:{
                    name:true,
                    company:true,
                    email:true
                }
            }
        }
    })
        return invoices;
    }catch(err){
        return { error: "Failed to fetch invoices" };
    }
};

export const getInvoice = async (req)=>{
    const invoice = await prisma.invoice.findFirst({
        where:{
            id:req.params.id,
            userId:req.userId
        },
        include:{
            client:{
                select:{
                    name:true,
                    email:true,
                    company:true
                }
            }
        }
    })
    return invoice;
}

export const updateInvoice = async(req)=>{
    const result = updateInvoiceSchema.safeParse(req.body);
    if(!result.success){
        return { error: result.error.format() }
    }
    const validated = result.data;
    const updateData = {};

    if (validated.amount !== undefined) {
    updateData.amount = validated.amount;
    }
    if (validated.dueDate !== undefined) {
    updateData.dueDate = validated.dueDate;
    }
    if (validated.status !== undefined) {
    updateData.status = validated.status;
    }

    await prisma.invoice.update({
        where:{
            id:req.params.id
        },
        data:updateData
    })

    return "Invoice updated successfully!"
}


export const deleteInvoice = async (req)=>{
    try{
        const invoice = await prisma.invoice.findUnique({
            where:{
                id:req.params.id
            }
        }) 

        if(!invoice.userId!==req.userId || !invoice){
            return { error: "Invoice not found or unauthorized" }
        }

        const deletedInvoice = await prisma.invoice.delete({
        where:{
            id:req.params.id,
        }
    });
    return deletedInvoice;
    }catch(err){
        return {error:"Failed to delete Invoice!"};
    }
}