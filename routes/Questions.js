import express from "express"

import {AskQuestion, getAllquestions,deleteQuestion,voteQuestion} from "../controllers/Questions.js"
import auth from "../middlewares/auth.js"

const router =express.Router()

router.post('/Ask',auth,AskQuestion)// if auth is true only then it will allow to perform the AskQuestion"here AskQuestion is next() from middleware"
router.get("/get", getAllquestions)
router.delete("/delete/:id",auth, deleteQuestion)
router.patch('/vote/:id',auth,voteQuestion)

export default router