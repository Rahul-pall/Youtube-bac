import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email:{
      type:String,
      required:true
    },
    password: {
      type: String
    },
    img: {
      type: String,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: { 
      type: [String],
    },
    fromGoogle:{
       type:Boolean,
       default:false
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    blockUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User",userSchema) 