"use client";
import { useGetQuestionsByTaskIdQuery } from "@/lib/features/question/questionApi";
import { HelpCircle, Inbox, MessageSquare, RefreshCw } from "lucide-react";
import { useSelector } from "react-redux";
import QuestionForm from "./QuestionForm";
import QuestionItem from "./QuestionItem";

const QuestionsList = ({ task }) => {
  const role = useSelector((state) => state?.auth?.user?.role);

  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useGetQuestionsByTaskIdQuery(task?._id, {
    skip: !task?._id,
  });

  const questions = questionsData?.data || questionsData || [];

  // Loading State with Skeleton-like feel
  if (isLoadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative">
          <div className="h-12 w-12 border-4 border-teal-50 border-t-teal-500 rounded-full animate-spin" />
          <MessageSquare className="absolute inset-0 m-auto h-5 w-5 text-teal-200" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Loading Discussion...
        </p>
      </div>
    );
  }

  // Error State
  if (questionsError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-rose-50/50 rounded-[2rem] border border-rose-100 mx-4">
        <HelpCircle className="w-10 h-10 text-rose-300 mb-3" />
        <p className="text-sm font-bold text-rose-900">Failed to sync questions</p>
        <button
          onClick={refetchQuestions}
          className="mt-4 flex items-center gap-2 px-6 py-2 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[400px]">
      {/* Ask Question Header Section */}
      <div className="px-6 py-6 border-b border-slate-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-teal-500 rounded-full" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Public Discussion
            </h3>
          </div>
          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight">
            {questions.length} Questions
          </span>
        </div>

        {role === "provider" && task?.status === "OPEN_FOR_BID" ? (
          <div className="bg-slate-50 rounded-[1.5rem] p-1 border border-slate-100">
            <QuestionForm task={task} refetchQuestions={refetchQuestions} />
          </div>
        ) : (
          <div className="px-4 py-3 bg-teal-50/50 border border-teal-100 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-xs font-medium text-teal-800">
              Only logged-in providers can post questions.
            </p>
          </div>
        )}
      </div>

      {/* Questions Thread */}
      <div className="divide-y divide-slate-50">
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6">
              <Inbox className="w-8 h-8 text-slate-200" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">No questions yet</h4>
            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
              Have a doubt about this task? Ask the customer for clarification.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {questions.map((question) => (
              <QuestionItem key={question._id} question={question} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Subtle Footer */}
      {questions.length > 0 && (
        <div className="p-8 flex justify-center border-t border-slate-50">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            End of Discussion
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionsList;
