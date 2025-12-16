import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import client from "../../../public/client.png";
import { useCreateQuestionMutation } from "@/lib/features/question/questionApi";
import { toast } from "sonner";

const QuestionForm = ({ task, refetchQuestions }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [questionImagePreview, setQuestionImagePreview] = useState(null);
  const [createQuestion, { isLoading: isSubmittingQuestion }] = useCreateQuestionMutation();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPG, PNG, GIF, WEBP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setQuestionImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestionImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setQuestionImage(null);
    setQuestionImagePreview(null);
  };

  const handleQuestionSubmit = async () => {
    if (!newQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }

    try {
      const formData = new FormData();
      const questionData = {
        task: task?._id,
        details: newQuestion.trim()
      };

      formData.append('data', JSON.stringify(questionData));

      if (questionImage) {
        formData.append('question_image', questionImage);
      }

      const result = await createQuestion(formData).unwrap();

      if (result.success) {
        toast.success("Question submitted successfully!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });

        setNewQuestion("");
        setQuestionImage(null);
        setQuestionImagePreview(null);
        refetchQuestions();
      }
    } catch (error) {
      console.error("Failed to submit question:", error);
      toast.error(
        error?.data?.message || "Failed to submit question. Please try again.",
        {
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderLeft: "6px solid #ef4444",
          },
          duration: 3000,
        }
      );
    }
  };

  return (
    <div className="flex gap-3">
      <Image
        src={client}
        alt="Your profile"
        width={64}
        height={64}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question about this task..."
          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-[#115E59] focus:border-transparent"
          rows="3"
        />

        <div className="mt-3">
          {questionImagePreview ? (
            <div className="relative inline-block">
              <img
                src={questionImagePreview}
                alt="Question preview"
                className="h-24 w-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <ImageIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Add Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex justify-end items-center mt-3">
          <button
            onClick={handleQuestionSubmit}
            disabled={!newQuestion.trim() || isSubmittingQuestion}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              newQuestion.trim() && !isSubmittingQuestion
                ? "bg-[#115E59] text-white hover:bg-teal-700 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmittingQuestion ? "Submitting..." : "Send Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;