import { CodeRequestBody } from "@/types/CodeRequestBody";
import type { Question } from "@/types/question";

export async function submitCode(userId: number, question: Question, code: string, language: string, _input: string) {
    
    let url = import.meta.env.VITE_BACKEND_URL + '/question/submit';
    const body: CodeRequestBody = {
        userId: userId.toString(),
        questionId: question.id.toString(),
        code: code,
        languageId: language,
        compile_memory_limit: question.compile_memory_limit,
        compile_timeout: question.compile_timeout,
        run_memory_limit: question.run_memory_limit,
        run_timeout: question.run_timeout,
    }

    return fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
}