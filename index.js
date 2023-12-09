import  Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import userModel from "./models/users.js"
import userRouter from "./routes/user.js"
import commentRouter from "./routes/comments.js"
import videoRouter from "./routes/video.js"
import authRouter from "./routes/auth.js"
import cookieParser from "cookie-parser";
import cors from 'cors'
const app=Express();

app.use(cors());
dotenv.config();

const URI=process.env.MONGO_URI;
const connect= ()=>{
  mongoose.connect(URI).then(()=>{console.log("connected to database")})
  .catch(err=>{console.log("not connected",err)})
}

app.use(cookieParser())
app.use(Express.json())
app.use("/api/users",userRouter)
app.use("/api/comment",commentRouter)
app.use("/api/video",videoRouter)
app.use("/api/auth",authRouter)

app.use((err,req,res,next)=>{
  const status=err.status || 500;
  const message =err.message || "something went wrong";
  return res.status(status).json({
    success:false,
    status,
    message
  })
})

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
  connect();
  console.log(`http://localhost:${PORT}`)
})
