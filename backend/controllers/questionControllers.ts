import { db } from "../db/db.ts";
import type { Request, Response } from 'express'
import { Questions } from "@codemasters/db";
import { RunRequestBody } from "../types/RunRequestBody.ts"
import { PistonResponseBody } from "../types/PistonResponseBody.ts";
import { getRunOutputBody } from "../helpers/getRunOutputBody.ts";
import { Submissions } from "@codemasters/db"
import { eq, and } from "drizzle-orm";
import type {SubmitRequestBody} from "../types/SubmitRequestBody.ts";
import { SingletonContainer } from "../helpers/SingletonContainer.ts";

const redis = SingletonContainer.getRedis();
const runQueue = SingletonContainer.getRunQueue();
const submitQueue = SingletonContainer.getSubmitQueue();


// POST /question
export async function createQuestion(req: Request, res: Response) {
    try {
        const {
            title,
            description,
            testcase,
            expected_output,
            difficulty,
            contestId,
            topics,
            run_timeout,
            compile_timeout,
            run_memory_limit,
            compile_memory_limit
        } = req.body;

        const result = await db.insert(Questions).values({
            title,
            description,
            testcase,
            expected_output,
            difficulty,
            contestId,
            topics,
            run_timeout,
            compile_timeout,
            run_memory_limit,
            compile_memory_limit
        }).returning({ id: Questions.id });

        res.status(201).json({ id: result[0].id, message: 'Question created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// GET /question/:id
export async function getQuestion(req: Request, res: Response) {
    try {
        const question = await db.select().from(Questions).where(eq(Questions.id, req.params.id));
        
        if (question.length === 0) {
            res.status(404).json({ message: 'Question not found' });
            return
        }
        
        res.json(question[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// POST /question/run
export async function runQuestion(req: Request, res: Response) {
    const reqBody: RunRequestBody = req.body
    await runQueue.add('run-task', reqBody)
    res.sendStatus(200)
}

// GET /question/run
export async function getRunQuestion(req: Request, res: Response) {
    const userId = req.query.userId as string
    const questionId = req.query.questionId as string
    const key = 'run' + userId + questionId
    const outputString = await redis.get(key)
    if (outputString === null) {
        res.sendStatus(204)
        return
    }
    const pistonOutput: PistonResponseBody = JSON.parse(outputString)
    const output = getRunOutputBody(pistonOutput)
    await redis.del(key)
    res.json(output)
}

// POST /question/submit
export async function submitQuestion(req: Request, res: Response) {
    const reqBody: SubmitRequestBody = req.body
    const result = await db.select().from(Questions).where(eq(Questions.id, parseInt(reqBody.questionId)))
    reqBody.stdin = result[0].testcase
    reqBody.expected_output = result[0].expected_output
    const pendingSubmission = await db
        .insert(Submissions)
        .values({
            userId: parseInt(reqBody.userId),
            quesId: parseInt(reqBody.questionId),
            contestId: result[0].contestId,
            status: "pending"
        })
        .returning({ id: Submissions.id })
    reqBody.submissionId = pendingSubmission[0].id
    console.log("pending submission id:", pendingSubmission[0].id)
    await submitQueue.add('submit-task', reqBody)
    res.json({ submissionId: pendingSubmission[0].id })
}

// GET /question/submit
export async function getSubmitQuestion(req: Request, res: Response) {
    const submissionId = req.query.submissionId as string
    const submission = await db
        .select()
        .from(Submissions)
        .where(and(eq(Submissions.id, parseInt(submissionId))))
        .limit(1)
    if (submission[0].status === "pending") {
        res.sendStatus(204)
        return
    }
    res.json(submission[0])
}
