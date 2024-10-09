import { Router } from "express";
import { uploadImage } from "../controllers/cloudinary.controller.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();

router.route("/uploadImage").post(upload.single("profileImage"), uploadImage);



export default router
