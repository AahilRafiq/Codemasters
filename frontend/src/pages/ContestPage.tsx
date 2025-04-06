import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { Contest, DSAQuestion, MCQQuestion } from '@/types/contest';
import config from '@/config';
// import {Countdown} from '@/components/countdown';
const ContestPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [authorized, setAuthorized] = useState(false);
  const [contest, setContest] = useState<Contest | null>(null);
  const [dsaQuestions, setDsaQuestions] = useState<DSAQuestion[]>([]);
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [error, setError] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
      navigate('/contests');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`${config.HOST}/contests/${id}`);
        console.log(response);
        const contestData = response.data[0];
        setContest(contestData);
      } catch (err) {
        setError('Failed to load contest');
        console.error(err);
      }
    };

    if (id) {
      fetchContest();
    }
  }, [id]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch DSA questions
        const dsaResponse = await axios.get(`${config.HOST}/question/`);
        console.log("dsa questions fetch", dsaResponse.data);
        
        // Only filter if contest and contest.questions exist
        if (contest && contest.questions) {
          filterDsaQuestions(dsaResponse.data);
        }
        
        // Fetch MCQ questions
        const mcqResponse = await axios.get(`${config.HOST}/question/mcqs`);
        
        // Only filter if contest and contest.MCQ exist
        if (contest && contest.MCQ) {
          filterMcqQuestions(mcqResponse.data);
        }
      } catch (err) {
        setError('Failed to load questions');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (contest) {
      fetchQuestions();
    }
    
    console.log("contest data", contest);
    console.log("dsa question", dsaQuestions);
    console.log("mcq question", mcqQuestions);
  }, [contest]);

  const filterDsaQuestions = (questions: DSAQuestion[]) => {
    if(!authorized) return;
    if (questions && contest && contest.questions) {
      const reqQuestions = questions.filter((question) => {
        return contest.questions.includes(question.id);
      });
      console.log("filtered dsa questions", reqQuestions);
      setDsaQuestions(reqQuestions);
    }
  }

  const filterMcqQuestions = (mcqs: MCQQuestion[]) => {
    if (mcqs && contest && contest.MCQ) {
      const reqMcq = mcqs.filter((mcq) => {
        if (contest.MCQ.includes(mcq.id)) {
          // Create a copy of the object without modifying the original
          const mcqCopy = {...mcq};
          delete mcqCopy.answer;
          return true;
        }
        return false;
      });
      console.log("filtered mcq questions", reqMcq);
      setMcqQuestions(reqMcq);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="mt-2">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isLoading && !contest) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading contest data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Contest Header */}
      {contest && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{contest.name}</h1>
          <p className="text-gray-600 mb-4">{contest.desc}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            {/* <Countdown endTime={contest.end_time}/> */}
            
          </div>
        </div>
      )}

      {/* DSA Questions Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Programming Questions
        </h2>
        {isLoading ? (
          <div className="text-gray-500">Loading questions...</div>
        ) : dsaQuestions.length === 0 ? (
          <div className="text-gray-500 italic">No programming questions available</div>
        ) : (
          <div className="space-y-4">
            {dsaQuestions.map((question, index) => (
              <div key={question.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-800">{question.title}</h3>
                    {/* Add more details if needed */}
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <button 
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    onClick={() => navigate(`/contest/${id}/solve/${question.id}`)}
                  >
                    Solve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MCQ Questions Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Multiple Choice Questions
        </h2>
        {isLoading ? (
          <div className="text-gray-500">Loading questions...</div>
        ) : mcqQuestions.length === 0 ? (
          <div className="text-gray-500 italic">No MCQ questions available</div>
        ) : (
          <div className="space-y-6">
            {mcqQuestions.map((mcq, index) => (
              <div key={mcq.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-3">
                  <span className="bg-purple-100 text-purple-800 font-medium px-2 py-1 rounded mr-2">
                    Q{index + 1}
                  </span>
                  <span className="text-gray-800 font-medium">{mcq.description}</span>
                </div>
                <div className="space-y-2 mt-3 pl-2">
                  <div className="flex items-center p-2 rounded hover:bg-gray-50">
                    <input 
                      type="radio" 
                      id={`q${mcq.id}-1`} 
                      name={`mcq-${mcq.id}`} 
                      className="mr-2" 
                    />
                    <label htmlFor={`q${mcq.id}-1`}>{mcq.option1}</label>
                  </div>
                  <div className="flex items-center p-2 rounded hover:bg-gray-50">
                    <input 
                      type="radio" 
                      id={`q${mcq.id}-2`} 
                      name={`mcq-${mcq.id}`} 
                      className="mr-2" 
                    />
                    <label htmlFor={`q${mcq.id}-2`}>{mcq.option2}</label>
                  </div>
                  <div className="flex items-center p-2 rounded hover:bg-gray-50">
                    <input 
                      type="radio" 
                      id={`q${mcq.id}-3`} 
                      name={`mcq-${mcq.id}`} 
                      className="mr-2" 
                    />
                    <label htmlFor={`q${mcq.id}-3`}>{mcq.option3}</label>
                  </div>
                  <div className="flex items-center p-2 rounded hover:bg-gray-50">
                    <input 
                      type="radio" 
                      id={`q${mcq.id}-4`} 
                      name={`mcq-${mcq.id}`} 
                      className="mr-2" 
                    />
                    <label htmlFor={`q${mcq.id}-4`}>{mcq.option4}</label>
                  </div>
                </div>
              </div>
            ))}
            {mcqQuestions.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                  Submit Answers
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContestPage