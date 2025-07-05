import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Difficulty } from '@/enums/difficultyEnum';
import { CreateQuestionRequest, CreateQuestionResponse } from '@/types/createQuestion';
import { X } from 'lucide-react';

export default function NewQuestion() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');

  const [formData, setFormData] = useState<CreateQuestionRequest>({
    title: '',
    description: '',
    testcase: '',
    expected_output: '',
    difficulty: Difficulty.Easy,
    topics: [],
    run_timeout: 5,
    compile_timeout: 10,
    run_memory_limit: -1,
    compile_memory_limit: -1,
  });

  const handleInputChange = (field: keyof CreateQuestionRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      const updatedTopics = [...topics, newTopic.trim()];
      setTopics(updatedTopics);
      setFormData(prev => ({ ...prev, topics: updatedTopics }));
      setNewTopic('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    const updatedTopics = topics.filter(topic => topic !== topicToRemove);
    setTopics(updatedTopics);
    setFormData(prev => ({ ...prev, topics: updatedTopics }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      const result: CreateQuestionResponse = await response.json();
      navigate(`/question/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Create New Problem</CardTitle>
            <CardDescription>
              Design a coding problem with test cases and expected outputs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Problem Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Two Sum, Binary Search Tree Validation"
                  required
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange('difficulty', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Difficulty.Easy}>Easy</SelectItem>
                    <SelectItem value={Difficulty.Medium}>Medium</SelectItem>
                    <SelectItem value={Difficulty.Hard}>Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Topics */}
              <div className="space-y-2">
                <Label htmlFor="topics">Topics</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add a topic (e.g., Arrays, Dynamic Programming)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                  />
                  <Button type="button" onClick={addTopic} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                      {topic}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeTopic(topic)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Problem Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the problem in detail. You can use markdown formatting."
                  rows={8}
                  required
                />
              </div>

              {/* Test Cases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="testcase">Test Input</Label>
                  <Textarea
                    id="testcase"
                    value={formData.testcase}
                    onChange={(e) => handleInputChange('testcase', e.target.value)}
                    placeholder="Enter the test input"
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expected_output">Expected Output</Label>
                  <Textarea
                    id="expected_output"
                    value={formData.expected_output}
                    onChange={(e) => handleInputChange('expected_output', e.target.value)}
                    placeholder="Enter the expected output"
                    rows={6}
                    required
                  />
                </div>
              </div>

              {/* Execution Limits */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="run_timeout">Run Timeout (seconds)</Label>
                  <Input
                    id="run_timeout"
                    type="number"
                    value={formData.run_timeout || ''}
                    onChange={(e) => handleInputChange('run_timeout', parseInt(e.target.value) || 5)}
                    placeholder="5"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compile_timeout">Compile Timeout (seconds)</Label>
                  <Input
                    id="compile_timeout"
                    type="number"
                    value={formData.compile_timeout || ''}
                    onChange={(e) => handleInputChange('compile_timeout', parseInt(e.target.value) || 10)}
                    placeholder="10"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="run_memory_limit">Run Memory Limit (MB)</Label>
                  <Input
                    id="run_memory_limit"
                    type="number"
                    value={formData.run_memory_limit === -1 ? '' : formData.run_memory_limit}
                    onChange={(e) => handleInputChange('run_memory_limit', parseInt(e.target.value) || -1)}
                    placeholder="Unlimited (-1)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compile_memory_limit">Compile Memory Limit (MB)</Label>
                  <Input
                    id="compile_memory_limit"
                    type="number"
                    value={formData.compile_memory_limit === -1 ? '' : formData.compile_memory_limit}
                    onChange={(e) => handleInputChange('compile_memory_limit', parseInt(e.target.value) || -1)}
                    placeholder="Unlimited (-1)"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Creating...' : 'Create Problem'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}