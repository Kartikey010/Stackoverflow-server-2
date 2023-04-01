import express from "express"
import {Subscribe,updateCount,getCount,check_silver,check_free,check_gold} from "../controllers/Subscription.js"


const router = express.Router();

router.post("/Pricing",Subscribe)
router.post("/update",updateCount)
router.post("/getCount",getCount)
router.post("/check/silver",check_silver)
router.post("/check/free",check_free)
router.post("/check/gold",check_gold)


export default router