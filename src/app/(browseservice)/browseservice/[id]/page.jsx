"use client";

import { useParams } from "next/navigation";
import { useGetTaskByIdQuery } from "@/lib/features/task/taskApi";
import TaskDetails from "@/components/browseservice/TaskDetails";

const TaskDetailPage = () => {
  const params = useParams();
  const taskId = params.id;

  console.log("🔄 Task ID from URL:", taskId);

  const { 
    data: taskData, 
    isLoading, 
    error 
  } = useGetTaskByIdQuery(taskId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Task Not Found</h2>
        <p className="text-gray-600">The task you're looking for doesn't exist or failed to load.</p>
        <p className="text-sm text-gray-500 mt-2">Error: {error?.data?.message}</p>
      </div>
    );
  }

  if (!taskData?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Unable to load task details.</p>
      </div>
    );
  }

  return <TaskDetails task={taskData.data} />;
};

export default TaskDetailPage;