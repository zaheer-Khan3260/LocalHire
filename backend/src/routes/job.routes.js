import { Router } from "express";
import { createJob, deleteJob, fetchJobByWorkerId, getNotification, updateJobStatus } from "../controllers/job.controller.js";


const router = Router()

router.route("/createJob").post(createJob)
router.route("/fetchjobsByWorkerId/:id").get(fetchJobByWorkerId)
router.route("/updateStatus/:id").post(updateJobStatus)
router.route("/getNotification/:id").get(getNotification);
router.route("/deleteJob/:id").get(deleteJob)


export default router;