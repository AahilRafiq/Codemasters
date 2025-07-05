import express from 'express'
import { getQuestion,getRunQuestion,getSubmitQuestion,runQuestion,submitQuestion,createQuestion } from "../controllers/questionControllers.ts"

const router = express.Router()

router.post('/', createQuestion)
router.post('/run', runQuestion)
router.get('/run', getRunQuestion)
router.get('/:id', getQuestion)
router.post('/submit', submitQuestion)
router.get('/submit', getSubmitQuestion)


export default router