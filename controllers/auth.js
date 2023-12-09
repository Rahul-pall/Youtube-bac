import userModel from "../models/users.js"
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
   service: 'gmail', // e.g., 'gmail'
   auth: {
     user: 'r.kumar111998a@gmail.com',
         pass: 'klni tyzu hidu xhcv',
   },
 });

export const signup= async(req,res,next)=>{ 
         try{
            console.log(req.body)
            const saltValue = await bcrypt.genSalt(10);
            const hashPassword= await bcrypt.hash(req.body.password,saltValue)
            const newuser=new userModel({...req.body,password:hashPassword})

            await newuser.save();
            res.status(200).json({msg:"suucessfully data send"})
         }
         catch(err){
            console.log("error found at the time of signup")
            next(err) 
         }
}


// export const signIn= async(req,res,next)=>{
//          try{
//             const user =await userModel.findOne({name:req.body.name});
//             if(!user){
//             return next(createError(404,"user not found"))
//             }

//             const cmppaswd=  bcrypt.compare(req.body.password,user.password)
//             if(!cmppaswd){
//               return next(createError(404,"password not match"))
//             }


//             const {password,...others}=user._doc;
//             const token=jwt.sign({id:user._id},process.env.JWT_KEY)
//             res.cookie("access_token",token,{
//                httpOnly:true
//             })
//             .status(200)
//             .json(others)
//          } 
//          catch(err){
//             console.log("error found at the time of signup")
//             next(err) 
//          }
// } 

export const google=async(req,res,next)=>{
   try{
         const user= await userModel.findOne({email:req.body.email});
         if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_KEY);
            res
            .cookie("access_token",token,{
               httpOnly:true,
            })
            .status(200)
            .json(user._doc)
         }
         else{
            const newUser=new userModel({
               ...req.body,
               fromGoogle:true
            })
            const savedUser=await newUser.save();
            const token=jwt.sign({id:savedUser._id},process.env.JWT_KEY);
            res
            .cookie("access_token",token,{
               httpOnly:true,
            })
            .status(200)
            .json(savedUser._doc)
         }
   }
   catch(err){
      next(err)
   }
}




async function sendEmail(to, subject, text) {
   try {
     const mailOptions = {
       from: 'r.kumar111998a@gmail.com',
       to,
       subject,
       text,
     };
 
     const info = await transporter.sendMail(mailOptions);
     console.log('Email sent:', info.response);
   } catch (error) {
     console.error('Error sending email:', error);
   }
 }

export const signIn = async (req, res, next) => {
   try {
     const user = await userModel.findOne({ name: req.body.name });
     if (!user) {
       return next(createError(404, "User not found"));
     }
 
     const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
     if (!isPasswordMatch) {
       // Increment login attempts
       user.loginAttempts = (user.loginAttempts || 0) + 1;
       await user.save();
 
       // Check if login attempts reach 3
       if (user.loginAttempts === 3) {
         // Send email notification after 3 failed attempts
         await sendEmail(user.email, 'Multiple Failed Login Attempts', 'There have been multiple failed login attempts on your account. Please review your login credentials.');
         console.log("send email to you after 3 login attempt")
       }
 
       // Check if login attempts reach 5
       if (user.loginAttempts === 5) {
         // Send email notification after 5 failed attempts
         await sendEmail(user.email, 'Account Blocked', 'Your account has been blocked for 1 hour due to multiple unsuccessful login attempts.');
 
         // Block the account for 1 hour (set the blockUntil timestamp)
         user.blockUntil = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
         await user.save();
         console.log("send email to you after 5 login attempt you are block now")
 
         return res.status(400).json({ error: 'Account blocked. Please try again after 1 hour.' });
       }
 
       return next(createError(401, 'Password does not match'));
     }
 
     // Reset login attempts on successful login
     user.loginAttempts = 0;
     await user.save();
 
     const { password, ...others } = user._doc;
     const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
     res.cookie('access_token', token, {
       httpOnly: true,
     })
       .status(200)
       .json(others);
       console.log("data send successfully")
   } catch (err) {
     console.error('Error found at the time of sign-in:', err);
     next(err);
   }
 };
 
 // Extracted function for sending emails
 