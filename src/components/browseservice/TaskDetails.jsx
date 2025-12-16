import React from 'react'
import TaskDetailsPage from './TaskDetailsPage'

const TaskDetails = ({task}) => {
  console.log("taskDetails==>",task)
  return (
    <div>
      <TaskDetailsPage 
      task={task}
      />
    </div>
  )
}

export default TaskDetails