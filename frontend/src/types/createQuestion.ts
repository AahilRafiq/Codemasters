export interface CreateQuestionRequest {
    title: string;
    description: string;
    testcase: string;
    expected_output: string;
    difficulty?: string;
    contestId?: number;
    topics?: string[];
    run_timeout?: number;
    compile_timeout?: number;
    run_memory_limit?: number;
    compile_memory_limit?: number;
}

export interface CreateQuestionResponse {
    id: number;
    message: string;
}