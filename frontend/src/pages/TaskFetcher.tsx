import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from './Editor';
import ActionBar from './ActionBar';
import QuestionCard from './QuestionCard';
import { TaskResult, createTask } from '../types/Task';
import { FullQuestionProps } from '@/types/question';






const TaskFetcher: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [code, setCode] = useState<string>('// Start coding here...');
  const [language, setLanguage] = useState<string>('js');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<string | null>(null);
  const [currentOutput, setCurrentOutput] = useState<string | null>(null);
  const userid = localStorage.getItem('token');
  const [submission, setSubmission] = useState(false);

  // Fetch question details from the API using questionId
  const [question, setQuestion] = useState<FullQuestionProps | null>(null);
  
  // Helper function to normalize strings for comparison (was referenced but not defined)
  const normalizeString = (str: string | null): string => {
    return (str ? str.trim().replace(/\s+/g, ' ') : '');
  };

  useEffect(() => {
    if (questionId) {
      axios.get(`http://localhost:3000/question/${questionId}`)
        .then(response => {
          for(let i =1;i<=response.data.visible_test_cases;i++){
            response.data.example_input[i] = "1\n" + response.data.example_input[i];
          }
          setQuestion(response.data);
          setCurrentInput(response.data.example_input["1"]);

          setCurrentOutput(response.data.expected_output["1"]);
        })
        .catch(error => {
          console.error('Error fetching question details:', error);
        });
    }
  }, [questionId]);
   
  const pollTaskResult = async (taskId: string) => {
    try {
      setSubmission(false);
      const { data } = await axios.get(`http://localhost:3000/task/${taskId}`);
      console.log(data);
      if (data.run.status === "completed") {
        if(data.run.output != "Wrong Answer")setSubmission(true);
        setResult(data.run.output || null);
        setIsPolling(false);
        setIsLoading(false);
      } else if (data.run.status === "failed") {
        setError("Task processing failed");
        setIsPolling(false);
        setIsLoading(false);
      } else {
        setTimeout(() => pollTaskResult(taskId), 500);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setTimeout(() => pollTaskResult(taskId), 500);
      } else {
        setError(err.message || "Failed to fetch result");
        setIsPolling(false);
        setIsLoading(false);
      }
    }
  };  

  const handleLanguageChange = (newLanguage: string): void => {
    setLanguage(newLanguage);
  };

  const handleAction = async (actionType: 'run' | 'submit'): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!questionId) {
        throw new Error('Question ID is missing');
      }

      const task = createTask({
        code,
        language,
        questionId
      });

      await axios.post(
        'http://localhost:3000/task',
        {
          ...task,
          action: actionType,
          userId: userid,
          stdin: (currentInput),
          output: currentOutput
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setIsPolling(true);
      pollTaskResult(task.taskId);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${actionType} code`);
      setIsLoading(false);
    }
  };

  if (!question) {
    return <div className="p-8 text-center">Question not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-900 text-white p-4">
        <h1 className="text-xl font-bold">IEEE Code Platform</h1>
      </nav>
      <div className="container mx-auto p-4">
        <div className="flex gap-10">
          <div className="w-[30%]">
            <QuestionCard
              title={question.title}
              description={question.description}
              difficulty={question.difficulty}
              category={question.category}
              timeLimit={question.timeLimit}
              acceptance={question.acceptance}
              example_input={question.example_input}
              expected_output={question.expected_output}
              constraint_data={question.constraint_data}
              visible_test_cases={question.visible_test_cases}
              currentInput={currentInput}
              setcurrentInput={setCurrentInput}
              currentOutput={currentOutput}
              setcurrentOutput={setCurrentOutput}
            />
          </div>
          <div className="w-[70%]">
            <Editor
              code={code}
              setCode={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
            />
            <ActionBar
              onRun={() => handleAction('run')}
              onSubmit={() => handleAction('submit')}
              isLoading={isLoading}
            />
            {isPolling && (
              <div className="mt-4 p-4 bg-blue-100 border border-blue-500 rounded-lg shadow">
                <p className="flex items-center">
                  <span className="animate-spin mr-2">⌛</span>
                  Processing your code...
                </p>
              </div>
            )}
            {result && (
              <div
                className={`mt-4 p-6 border rounded-lg shadow ${submission || (normalizeString(result) === normalizeString(currentOutput)) ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
              >
                <h2
                  className={`font-bold text-lg ${(submission || normalizeString(result) === normalizeString(currentOutput)) ? 'text-green-800' : 'text-red-800'} mb-2`}
                >
                  {submission || (normalizeString(result) === normalizeString(currentOutput)) ? 'Correct' : 'Wrong'}
                </h2>
                <div className="bg-white p-4 rounded-md font-mono">
                  <pre className={`whitespace-pre-wrap ${submission || (normalizeString(result) === normalizeString(currentOutput)) ? 'text-green-900' : 'text-red-900'}`}>
                    {result}
                  </pre>
                </div>
              </div>
            )}
            {error && (
              <div className="mt-4 p-6 bg-red-50 border border-red-500 rounded-lg shadow">
                <h2 className="font-bold text-lg text-red-800 mb-2">Error:</h2>
                <div className="bg-white p-4 rounded-md">
                  <p className="text-red-900">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFetcher;