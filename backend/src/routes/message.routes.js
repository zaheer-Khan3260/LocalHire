
import { Router } from "express";
import { deleteMessage, getConversation, getConversationById, getMessage, sendMessage } from "../controllers/message.controller.js";

const router = Router();


router.route("/sendMessage").post( sendMessage )
router.route("/getMessage").post( getMessage )
router.route("/getConversation").post(getConversation)
router.route("/getConversationById").post(getConversationById)
router.route("/deleteMessage").post(deleteMessage)

export default router;
