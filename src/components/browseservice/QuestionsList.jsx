import React from "react";
import { useSelector } from "react-redux";
import { useGetQuestionsByTaskIdQuery } from "@/lib/features/question/questionApi";
import QuestionForm from "./QuestionForm";
import QuestionItem from "./QuestionItem";

const QuestionsList = ({ task }) => {
  const role = useSelector((state) => state?.auth?.user?.role);
  
  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch: refetchQuestions
  } = useGetQuestionsByTaskIdQuery(task?._id, {
    skip: !task?._id,
  });

  const questions = questionsData?.data || questionsData || [];

  if (isLoadingQuestions) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to load questions.</p>
        <button
          onClick={refetchQuestions}
          className="mt-2 px-4 py-2 bg-[#115E59] text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="p-4 border-b border-gray-200">
        {role === "provider" && (
          <QuestionForm 
            task={task}
            refetchQuestions={refetchQuestions}
          />
        )}
      </div>

      <div>
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No questions yet. Be the first to ask a question!</p>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionItem 
              key={question._id} 
              question={question} 
              task={task}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionsList;