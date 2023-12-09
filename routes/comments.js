import Express from "express";
import {verifyToken} from "../verifyToken.js"
import { addcomment, deletecomment, getcomment } from "../controllers/comment.js";

const router=Express.Router();
router.post("/",verifyToken,addcomment)
router.delete("/:id",verifyToken,deletecomment)
router.get("/:videoId",getcomment)
export default router;