import Express from "express";
import { google, signIn, signup } from "../controllers/auth.js";
const router=Express.Router();

// create user
router.post("/signup", signup)

//login user
router.post("/signin",signIn)

//google authentication
router.post("/google",google)

export default router;