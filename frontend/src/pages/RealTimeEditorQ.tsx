import { useEffect, useState } from "react";
import RealTimeCodeEditor from "./RealTimeEditor";
import QuestionCard from "./QuestionCard";
import axios from "axios";
import config from "@/config";


const RealTimeEditorWithSidebar = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [currentInput, setcurrentInput] = useState<string | null>(null);
  const [currentOutput, setcurrentOutput] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${config.HOST}/question`)
      .then(res => setQuestions(res.data))
      .catch(err => console.error("Failed to fetch questions", err));
  }, []);

  const handleQuestionClick = async (id: string) => {
    try {
      const res = await axios.get(`${config.HOST}/question/${id}`);
      setSelectedQuestion(res.data);
      setcurrentInput(null);
      setcurrentOutput(null);
    } catch (error) {
      console.error("Error fetching question details:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {!selectedQuestion ? (
        // Sidebar
        <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Questions</h2>
          <ul className="space-y-2">
            {questions.map((q: any) => (
              <li
                key={q._id}
                className="cursor-pointer hover:bg-gray-300 p-2 rounded-md transition"
                onClick={() => handleQuestionClick(q.id)}
              >
                {q.title}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Main Content (QuestionCard + Editor)
        <div className="w-100 p-4 flex flex-col gap-4 overflow-y-auto">
          <QuestionCard
            {...(selectedQuestion || {})}
            currentInput={currentInput}
            setcurrentInput={setcurrentInput}
            currentOutput={currentOutput}
            setcurrentOutput={setcurrentOutput}
          />
          
        </div>
      )}
      <RealTimeCodeEditor />
    </div>
  );
};

export default RealTimeEditorWithSidebar;
