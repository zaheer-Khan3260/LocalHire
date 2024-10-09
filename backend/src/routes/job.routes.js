import { Router } from "express";
import { createJob } from "../controllers/job.controller.js";


const router = Router()

router.route("/createJob").post(createJob)


export default router;