import React from 'react';
import { FileCode } from 'lucide-react';
interface EditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const Editor: React.FC<EditorProps> = ({ code, setCode, language, onLanguageChange }) => {
  const languages = [
    { value: 'js', label: 'JavaScript' },
    { value: 'py', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full h-[700px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileCode className="text-blue-400" size={20} />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-gray-800 text-white px-2 py-1 rounded-md border border-gray-700"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-[calc(100%-40px)] bg-gray-900 text-gray-100 font-mono p-4 resize-none focus:outline-none"
        spellCheck={false}
      />
    </div>
  );
};

export default Editor;
