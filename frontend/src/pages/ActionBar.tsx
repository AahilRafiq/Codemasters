import React from 'react';
import { Send, Play, Loader2 } from 'lucide-react';
interface ActionBarProps {
  onRun: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({ onRun, onSubmit, isLoading }) => {
  return (
    <div className="flex gap-4 py-4">
      <button
        onClick={onRun}
        disabled={isLoading}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
        Run Code
      </button>
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
        Submit
      </button>
    </div>
  );
};

export default ActionBar;