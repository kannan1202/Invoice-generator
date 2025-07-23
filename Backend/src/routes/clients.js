import express from "express"
import verifyUser from "../middlewares/authMiddleware.js";
import { createClient,getAllClients,getClient,updateClientDetails,deleteClient } from "../controllers/handleClients.js";

const router = express.Router();

router.use(verifyUser);

router.post("/createClient",async (req,res)=>{
    const response = await createClient(req);
    if(response.error){
        res.status(403).json({
            "message":response.error
        })
    }
    res.status(200).json(response);
});

router.get("/clients",async (req,res)=>{
    const response = await getAllClients(req);
    if(response.error){
        res.status(500).json({
            "message":response.error
        })
    }
    return res.status(200).json({
        "message":response
    })
})

router.get("/client/:id",async (req,res)=>{
    const response = await getClient(req);
    if(response.error){
        res.status(403).json({
            "message":response.error
        })
    }
    res.status(200).json({
        "message":response
    })
})

router.put("/client/:id",async (req,res)=>{
    const response = await updateClientDetails(req);
    if(response.error){
        res.status(400).json({
            "message":response.error
        })
    }
    res.status(200).json({
        "message": "Client updated successfully",
        "client": response
    })
});

router.delete("/client/:id", async (req, res) => {
  const response = await deleteClient(req);

  if (response.error) {
    return res.status(403).json({ "message": response.error });
  }

  res.status(200).json({
    "message": `Client with ID ${response.id} deleted successfully`,
  });
});

export default router;