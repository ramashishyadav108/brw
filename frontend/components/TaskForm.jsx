'use client';

import { useState, useEffect } from 'react';
import { FiX, FiSave, FiCalendar, FiFlag, FiActivity, FiType, FiAlignLeft } from 'react-icons/fi';

// ✅ FIX: Moved InputGroup OUTSIDE the main component so it doesn't re-render and lose focus
const InputGroup = ({ label, error, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
      {Icon && <Icon className="text-gray-400" />} {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 font-medium animate-pulse">{error}</p>}
  </div>
);

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'To Do'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority || 'medium',
        status: task.status || 'To Do'
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length > 200) newErrors.title = 'Title is too long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Fill in the details below</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="task-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Input */}
            <InputGroup label="Task Title" error={errors.title} icon={FiType}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Q3 Financial Report Review"
                autoFocus
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
            </InputGroup>

            {/* Description Input */}
            <InputGroup label="Description" icon={FiAlignLeft}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add necessary details, links, or sub-tasks..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </InputGroup>

            {/* Grid for Date, Priority, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputGroup label="Due Date" icon={FiCalendar}>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                />
              </InputGroup>

              <InputGroup label="Priority" icon={FiFlag}>
                <div className="relative">
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  {/* Custom Chevron */}
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </InputGroup>

              <div className="sm:col-span-2">
                <InputGroup label="Current Status" icon={FiActivity}>
                  <div className="flex gap-3 p-1 bg-gray-100/50 rounded-xl border border-gray-200">
                    {['To Do', 'In Progress', 'Done'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.status === s
                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </InputGroup>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            form="task-form"
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
            ) : (
              <FiSave size={16} />
            )}
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}