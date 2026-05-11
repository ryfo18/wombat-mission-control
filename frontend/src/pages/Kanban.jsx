import React, { useEffect, useState } from 'react';
import api from '../api';

const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await api.getTasks();
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // Set mock data if API fails
        setTasks([
          { id: 1, title: "Learn React", description: "Study React hooks and context", status: "todo", created_at: new Date().toISOString() },
          { id: 2, title: "Build Dashboard", description: "Create the mission control dashboard", status: "in_progress", created_at: new Date().toISOString() },
          { id: 3, title: "Deploy App", description: "Deploy to production server", status: "done", created_at: new Date().toISOString() }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await api.createTask({
        title: newTaskTitle,
        description: newTaskDescription
      });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await api.updateTask(task.id, {
        ...task,
        status: newStatus
      });
      setTasks(tasks.map(t => t.id === task.id ? res.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <div className="flex h-[200px] items-center justify-center">Loading...</div>;
  }

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            📋 To Do (<span className="text-indigo-400">{todoTasks.length}</span>)
          </h3>
          <form onSubmit={handleAddTask} className="mb-6">
            <div className="mb-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={!newTaskTitle.trim()}
            >
              Add Task
            </button>
          </form>
          <div className="space-y-3">
            {todoTasks.map(task => (
              <div key={task.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{task.title}</h4>
                  <span className="px-2 py-1 bg-indigo-500 text-xs rounded">todo</span>
                </div>
                {task.description && <p className="text-slate-400 text-sm mb-3">{task.description}</p>}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStatusChange(task, 'in_progress')}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded hover:bg-indigo-200"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {todoTasks.length === 0 && <p className="text-center text-slate-500 py-4">No tasks in progress</p>}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            ⏳ In Progress (<span className="text-yellow-400">{inProgressTasks.length}</span>)
          </h3>
          <div className="space-y-3">
            {inProgressTasks.map(task => (
              <div key={task.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{task.title}</h4>
                  <span className="px-2 py-1 bg-yellow-500 text-xs rounded">in_progress</span>
                </div>
                {task.description && <p className="text-slate-400 text-sm mb-3">{task.description}</p>}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStatusChange(task, 'todo')}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded hover:bg-indigo-200"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => handleStatusChange(task, 'done')}
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {inProgressTasks.length === 0 && <p className="text-center text-slate-500 py-4">No tasks in progress</p>}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            ✅ Done (<span className="text-green-400">{doneTasks.length}</span>)
          </h3>
          <div className="space-y-3">
            {doneTasks.map(task => (
              <div key={task.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{task.title}</h4>
                  <span className="px-2 py-1 bg-green-500 text-xs rounded">done</span>
                </div>
                {task.description && <p className="text-slate-400 text-sm mb-3">{task.description}</p>}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStatusChange(task, 'in_progress')}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded hover:bg-indigo-200"
                  >
                    ← In Progress
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {doneTasks.length === 0 && <p className="text-center text-slate-500 py-4">No completed tasks</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kanban;