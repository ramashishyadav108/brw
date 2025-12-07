'use client';

import { format, isPast, isToday, isTomorrow, formatDistanceToNow } from 'date-fns';
import { FiEdit3, FiTrash2, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi';

export default function TaskItem({ task, onEdit, onDelete }) {
  // 1. Dynamic Colors based on Priority
  const priorityColors = {
    low: 'border-l-emerald-400',
    medium: 'border-l-amber-400',
    high: 'border-l-rose-500'
  };

  const badgeStyles = {
    'To Do': 'bg-gray-100 text-gray-600',
    'In Progress': 'bg-blue-50 text-blue-600',
    'Done': 'bg-emerald-50 text-emerald-600'
  };

  // 2. Smart Date Logic
  const getDueDateInfo = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    
    // Logic for "Today", "Tomorrow", "Overdue"
    let text = '';
    const isOver = isPast(date) && !isToday(date) && task.status !== 'Done';
    
    if (isToday(date)) text = 'Today';
    else if (isTomorrow(date)) text = 'Tomorrow';
    else text = format(date, 'MMM dd'); // Default date format

    // Calculate generic distance if not today/tomorrow (e.g., "in 3 days")
    const distance = formatDistanceToNow(date, { addSuffix: true });

    return { text, fullText: distance, isOver, dateObj: date };
  };

  const dateInfo = getDueDateInfo();
  const priorityClass = priorityColors[task.priority] || priorityColors.medium;

  return (
    <div className={`group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 relative overflow-hidden border-l-4 ${priorityClass}`}>
      
      {/* Header: Badges & Actions */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          {/* Status Badge */}
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${badgeStyles[task.status]}`}>
            {task.status}
          </span>
          
          {/* Priority Label (Only if High) */}
          {task.priority === 'high' && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600">
              <FiAlertCircle size={12} /> High Priority
            </span>
          )}
        </div>

        {/* Action Buttons (Visible on hover for desktop) */}
        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)} 
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <FiEdit3 size={16} />
          </button>
          <button 
            onClick={() => onDelete(task._id || task.id)} 
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-4">
        <div className="flex items-start gap-3">
          {/* Visual Checkbox (Decorative or Functional if you add handler) */}
          <div className={`mt-1 min-w-[20px] h-5 rounded-full border-2 flex items-center justify-center 
            ${task.status === 'Done' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
            {task.status === 'Done' && <FiCheck size={12} className="text-white" />}
          </div>
          
          <div>
            <h3 className={`text-base font-bold text-gray-800 leading-tight mb-1 ${task.status === 'Done' ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </h3>
            <p className={`text-sm line-clamp-2 ${task.status === 'Done' ? 'text-gray-300' : 'text-gray-500'}`}>
              {task.description || "No additional details provided."}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between pl-8 mt-2">
        {dateInfo ? (
          <div 
            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors
            ${dateInfo.isOver ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}
            title={dateInfo.fullText}
          >
            <FiClock size={14} />
            <span>{dateInfo.isOver ? 'Overdue: ' : 'Due: '}{dateInfo.text}</span>
          </div>
        ) : (
          <div className="text-xs text-gray-300 italic pl-2">No Date</div>
        )}
      </div>
    </div>
  );
}