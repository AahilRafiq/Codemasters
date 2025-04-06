import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import config from "@/config";

interface FormData {
  language: string;
  source: string;
  stdin?: string;
}

export const CodeSubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    language: "python",
    source: "",
    stdin: "",
  });
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [responseType, setResponseType] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseMessage(null);

    try {
      const response = await fetch(`${config.HOST}/api/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, version: "*" }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseType("success");
        setResponseMessage("Code submitted successfully!");
      } else {
        setResponseType("error");
        setResponseMessage(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error: any) {
      setResponseType("error");
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Code Submission Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Programming Language Select */}
        <div className="space-y-2">
          <Label htmlFor="language">Programming Language:</Label>
          <Select
            value={formData.language}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, language: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="c++">C++</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="ruby">Ruby</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="php">PHP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Source Code Input */}
        <div className="space-y-2">
          <Label htmlFor="source">Source Code:</Label>
          <Textarea
            id="source"
            placeholder="Enter your code here..."
            value={formData.source}
            onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value }))}
            required
          />
        </div>

        {/* Standard Input */}
        <div className="space-y-2">
          <Label htmlFor="stdin">Standard Input (Optional):</Label>
          <Textarea
            id="stdin"
            placeholder="Enter input data here..."
            value={formData.stdin}
            onChange={(e) => setFormData((prev) => ({ ...prev, stdin: e.target.value }))}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Submit Code
        </Button>
      </form>

      {/* Response Message */}
      {responseMessage && (
        <div
          className={cn(
            "mt-4 p-4 rounded-md",
            responseType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}
        >
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default CodeSubmissionForm;
