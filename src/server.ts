import app from "./app";
import dotenv from "dotenv"
import { connectDB } from "./config/db.config";
dotenv.config()

const port = process.env.PORT

const startServer = async ()=>{
    try {
        await connectDB()
        app.listen(port, ()=>{
            console.log(`Server has started on port ${port}`)
        })
    } catch (error) {
        console.log("Unable to start server")
    }
}
 
startServer()