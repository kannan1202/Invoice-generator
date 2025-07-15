import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:"true"
}));
app.use(express.json());


app.use("api/v1/auth", require("./routes/auth") );
app.use("api/v1/clients", require("./routes/clients"));
app.use("api/v1/invoices", require("./routes/invoices"));

app.listen(process.env.PORT||3000,(err)=>{
    if(!err){
        console.log(`Server running at port: ${process.env.PORT||3000}`);
    }
})