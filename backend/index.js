import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './db/connectDB.js'
import userAuthRouter from './routes/userAuth.route.js'
import cookieParser from 'cookie-parser'
import studentProfile from './routes/studentProfile.route.js'
import capsuleRouter from './routes/Capsule.route.js'
import postsRouter from './routes/posts.route.js'
dotenv.config()

const PORT = process.env.PORT || 5000
const __dirname = path.resolve()

const app = express()
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ extended: true , limit: '50mb'}))

app.use("/api/auth", userAuthRouter)
app.use("/api/profile",studentProfile)
app.use("/api/capsule" , capsuleRouter)
app.use("/api/posts" , postsRouter)

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
    console.log("connecting to database...")
    connectDB()
    console.log(`Server is running on http://localhost:${PORT}`)
})

