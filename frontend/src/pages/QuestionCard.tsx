import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Timer, BarChart2, Brain } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { FullQuestionProps, getDifficultyColor } from '@/types/question';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Properly type the component props
interface QuestionCardProps extends FullQuestionProps {
  currentInput: string | null;
  setcurrentInput: React.Dispatch<React.SetStateAction<string | null>>;
  currentOutput: string | null;
  setcurrentOutput: React.Dispatch<React.SetStateAction<string | null>>;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  title,
  description,
  difficulty,
  category,
  timeLimit,
  acceptance,
  example_input,
  expected_output,
  constraint_data,
  currentInput,
  setcurrentInput,
  currentOutput,
  setcurrentOutput
}) => {
  const [selectedTestCase, setSelectedTestCase] = useState<string>("1");

  // Maintaining the original behavior exactly as in your code
  const handleTestCaseChange = (value: string) => {
    if (value === "custom") {
      setSelectedTestCase(value);
      // console.log("Custom test case selected");
      return;
    }
    setSelectedTestCase(value);
    
    // console.log(`Test case ${value} selected`);
    setcurrentInput(example_input[value]);
    setcurrentOutput(expected_output[value]);
    // console.log(currentInput, currentOutput);

  };

  useEffect(() => {
    
  }, [example_input]);


  const isCustom = selectedTestCase === "custom";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow min-h-[90%] w-full max-w-md">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="text-gray-600 mb-6 h-auto overflow-visible break-words">
        {description}
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <Badge className={`${getDifficultyColor(difficulty)} text-white text-sm min-w-auto max-w-[30%] px-3 py-1`}>
          {difficulty}
        </Badge>
        <div className="text-xs flex flex-col text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            <span>{timeLimit}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="w-4 h-4" />
            <span>{acceptance} acceptance</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            <span>{category}</span>
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <h3 className="font-semibold text-sm mb-4">Constraints:</h3>
        <div className="bg-gray-100 p-2 rounded-md text-xs overflow-y-auto max-h-32 whitespace-pre-wrap">
          {constraint_data}
        </div>
      </div>

      <div className="space-y-4">
        <p>The first line of input will contain a single integer T,denoting the number of test cases.</p>
        <h3 className="font-semibold text-sm">Select Test Case:</h3>
        <Select onValueChange={handleTestCaseChange} defaultValue="1">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a test case" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(example_input).map((key) => (
              <SelectItem key={key} value={key}>Test Case {key}</SelectItem>
            ))}
            <SelectItem value="custom">Custom Test Case</SelectItem>
          </SelectContent>
        </Select>

        <div className="bg-gray-100 p-4 rounded-md text-xs">
          <h3 className='py-2'>Input:</h3>
          <Textarea
            className="w-full"
            value={isCustom ? (currentInput ?? '') : ((example_input[selectedTestCase] ?? ''))}
            onChange={(e) => isCustom && setcurrentInput(e.target.value)}
            disabled={!isCustom}
          />
          <h3 className='py-2'>Output:</h3>
          <Textarea
            className="w-full"
            value={isCustom ? currentOutput ?? '' : expected_output[selectedTestCase] ?? ''}
            onChange={(e) => isCustom && setcurrentOutput(e.target.value)}
            disabled={!isCustom}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;