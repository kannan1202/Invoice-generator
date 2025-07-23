import express from "express";
import verifyUser from "../middlewares/authMiddleware.js";
import {createInvoice,getAllInvoices,getInvoice,updateInvoice,deleteInvoice} from "../controllers/handleInvoice.js";

const router = express.Router();

router.use(verifyUser);

router.post("/create",async (req,res,next)=>{
    const response = await createInvoice(req);
    if(response.error){
        res.status(500).json({
            "message":response.error
        })
    }else{
        res.status(200).json({
            "message":`Invoice generated successfully. Invoice UUID:${response}`
        })
    }
});

router.get("/invoices",async (req,res,next)=>{
    const response =await getAllInvoices(req);
    if(response.error){
        res.status(500).json({
            "message":response.error
        })
    }else{
        res.status(200).json({
            "invoices":response
        })
    }
});

router.get("/invoice/:id",async (req,res,next)=>{
    const invoice = await getInvoice(req);
    if(!invoice){
        res.status(404).json({
            "message":"Invoice not found"
        })
    }else{
        res.status(200).json({
            "message":invoice
        })
    }
})

router.put("/updateInvoice/:id",async (req,res)=>{
    const response = await updateInvoice(req);
    if(response.error){
        res.status(403).json({
            "message":response.error
        })
    }else{
        res.status(200).json({
            "message":response
        })
    }
});

router.delete("/deleteInvoice/:id",async (req,res)=>{
    const response = await deleteInvoice(req);
    if(response.error){
        res.status(403).json({
            "message":response.error
        })
    }else{
        res.status(200).json({
            "message":`Invoice with uuid:${response.uuid} deleted successfully!`
        })
    }
})

export default router;
