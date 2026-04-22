import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [statusUpdates, setStatusUpdates] = useState({}); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchTasks();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post('/tasks', newTask);
      setNewTask({ title: '', description: '' });
      await fetchTasks();
    } catch (err) {
      console.error('Error creating task', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingTaskId(id);
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error('Error deleting task', err);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setStatusUpdates({ ...statusUpdates, [taskId]: newStatus });
  };

  const submitStatusUpdate = async (task) => {
    const newStatus = statusUpdates[task.id] || task.status;
    if (newStatus === task.status) return; // No change made

    setUpdatingTaskId(task.id);
    try {
      // Send the full task data but with the updated status
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: newStatus
      });
      
      // Clear the local update state and refresh
      const updatedState = { ...statusUpdates };
      delete updatedState[task.id];
      setStatusUpdates(updatedState);
      await fetchTasks();
    } catch (err) {
      console.error('Error updating status', err);
      alert(err.response?.data?.message || "Failed to update task");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm border-t-4 border-blue-600">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Logged in as <span className="font-semibold text-gray-800">{user?.name}</span> 
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded uppercase tracking-wide">
                {user?.role}
              </span>
            </p>
          </div>
          <button onClick={handleLogout} className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-300 font-medium transition">
            Logout
          </button>
        </div>

        {/* Create Task Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Task</h2>
          <form onSubmit={handleCreateTask} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" placeholder="Task Title" required 
              className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
            />
            <input 
              type="text" placeholder="Description (Optional)" 
              className="flex-[2] p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
            />
            <button 
              type="submit" 
              disabled={createLoading}
              className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 font-bold transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {createLoading ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your Tasks</h2>
          {taskLoading ? (
            <div className="bg-white p-8 text-center rounded-lg shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-lg shadow-sm text-gray-500">
              No tasks found. Create one above!
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white p-5 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 border-blue-500 gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                  
                  {/* Status Indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Current Status:</span>
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wide
                      ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {task.status || 'pending'}
                    </span>
                  </div>
                </div>

                {/* Actions: Update Status & Delete */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border w-full sm:w-auto">
                    <select 
                      className="p-2 border rounded bg-white text-sm focus:outline-none"
                      value={statusUpdates[task.id] || task.status || 'pending'}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      disabled={updatingTaskId === task.id}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button 
                      onClick={() => submitStatusUpdate(task)}
                      disabled={!statusUpdates[task.id] || statusUpdates[task.id] === task.status || updatingTaskId === task.id}
                      className="bg-green-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {updatingTaskId === task.id ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(task.id)} 
                    disabled={deletingTaskId === task.id}
                    className="text-red-500 hover:bg-red-50 px-4 py-2 rounded font-medium transition w-full sm:w-auto border border-transparent hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}