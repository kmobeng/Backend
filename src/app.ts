import express from "express"
import morgan from "morgan"
import router from "./routes/note.route"

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

app.use("/api", router)

export default app