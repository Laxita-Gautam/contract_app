import express from "express"
import dotenv from "dotenv"
import contractRouter from "./routes/contract.route.js"
import cors from "cors"
import connectDB from "./config/db.js"
dotenv.config()

const app=express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true
}))
app.use(express.json())

connectDB()

app.use("/api/contract", contractRouter)

const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})