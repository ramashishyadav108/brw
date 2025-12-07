'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';

// Icons
import { FiPlus, FiRefreshCw, FiLayers, FiCheckSquare, FiClock, FiPieChart } from 'react-icons/fi';

// Components
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';

export default function Dashboard() {
  const router = useRouter();
  
  // State
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });

  // --------------------------------------------------------------------------
  // 1. Fetch Data (FIXED)
  // --------------------------------------------------------------------------
  const fetchTasks = useCallback(async () => {
    // Only show full-screen loader on initial mount, not on refresh
    if (!refreshing && tasks.length === 0) setLoading(true);
    
    try {
      const response = await api.get('/tasks');
      
      // ✅ THE FIX: Access response.data.data 
      // The API returns { success: true, count: 2, data: [...] }
      const tasksArray = response.data.data || response.data;
      
      setTasks(Array.isArray(tasksArray) ? tasksArray : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.response?.status === 401) router.push('/login');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router, refreshing, tasks.length]);

  // --------------------------------------------------------------------------
  // 2. Auth Check
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // --------------------------------------------------------------------------
  // 3. Filter & Stats Logic
  // --------------------------------------------------------------------------
  useEffect(() => {
    let result = [...tasks];

    // Status Filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }

    // Search Filter
    if (filters.search) {
      const lowerSearch = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(lowerSearch)) ||
          (t.description && t.description.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredTasks(result);

    // Calc Stats
    setStats({
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'To Do').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      done: tasks.filter((t) => t.status === 'Done').length,
    });
  }, [tasks, filters]);

  // --------------------------------------------------------------------------
  // 4. Handlers
  // --------------------------------------------------------------------------
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = useCallback((status) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const handleSearchChange = useCallback((search) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      setShowForm(false);
      handleRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    try {
      await api.put(`/tasks/${editingTask._id || editingTask.id}`, taskData);
      setShowForm(false);
      setEditingTask(null);
      handleRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      handleRefresh();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  // --------------------------------------------------------------------------
  // 5. Loading View
  // --------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium animate-pulse">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 6. Main Render
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Workspace</h1>
            <p className="text-gray-500 mt-1">Manage your tasks and track progress.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-all ${refreshing ? 'animate-spin' : ''}`}
              title="Refresh Tasks"
            >
              <FiRefreshCw size={20} />
            </button>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            >
              <FiPlus size={20} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks" value={stats.total} icon={FiLayers} color="blue" />
          <StatCard label="To Do" value={stats.todo} icon={FiClock} color="gray" />
          <StatCard label="In Progress" value={stats.inProgress} icon={FiPieChart} color="amber" />
          <StatCard label="Completed" value={stats.done} icon={FiCheckSquare} color="emerald" />
        </section>

        {/* Filters */}
        <FilterBar 
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />

        {/* Content Area */}
        <div className="flex flex-col gap-6">
          {/* Results Count */}
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold text-gray-800">
              {filters.status === 'all' && !filters.search ? 'All Tasks' : 'Search Results'}
            </h2>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
            </span>
          </div>

          {/* Task List */}
          <div className="w-full">
            <TaskList 
              tasks={filteredTasks} 
              onEdit={openEditModal} 
              onDelete={handleDeleteTask} 
            />
          </div>
        </div>
      </main>

      {/* Modal - Rendered conditionally */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// Sub-component for Stats
// --------------------------------------------------------------------------
function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    gray: 'bg-gray-100 text-gray-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1">
      <div className={`p-3.5 rounded-xl ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}