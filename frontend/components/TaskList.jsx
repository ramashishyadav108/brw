'use client';

import TaskItem from '@/components/TaskItem';

export default function TaskList({ tasks = [], onEdit, onDelete }) {
  if (!tasks.length) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        No tasks found. Try adjusting the filters or creating a new task.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id || task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
