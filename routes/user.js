import Express from "express";
import { deleteuser, dislike, getuser, like, subscribe, unsbscribe, update } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";  
const router=Express.Router();

//update a user
router.put("/:id",verifyToken, update)

//delete user
router.delete("/:id",verifyToken,deleteuser)

//get a user
router.get("/find/:id",getuser)

//subscribe a user
router.put("/sub/:id",verifyToken,subscribe)

//unsbscribe a user
router.put("/unsub/:id",verifyToken,unsbscribe)

//like a video
router.put("/like/:videoId",verifyToken,like)

//dislike a video
router.put("/dislike/:videoId",verifyToken,dislike)

export default router;