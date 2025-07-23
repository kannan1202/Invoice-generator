import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.js";
import clientRoutes from "./src/routes/clients.js";
import invoiceRoutes from "./src/routes/invoices.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}));
app.use(express.json());


app.use("/api/v1/auth", authRoutes );
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v1/invoices", invoiceRoutes);

app.listen(process.env.PORT||3000,(err)=>{
    if(!err){
        console.log(`Server running at port: ${process.env.PORT||3000}`);
    }
})