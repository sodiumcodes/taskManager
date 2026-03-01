import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [category, setCategory] = useState("Personal");
  const [status, setStatus] = useState("Not Started");
  const [priority, setPriority] = useState("Low");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/task/get-tasks");
      setTasks(response.data.tasks || []);
    } catch (err) {
      // Show server-provided message when available
      setError(err.response?.data?.message || "Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    try {
      const payload = { title: taskInput, category, status, priority };
      const response = await api.post("/task/create-task", payload);
      setTasks([...tasks, response.data.task]);
      setTaskInput("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
      console.error(err.response || err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/task/delete-task/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
      console.error(err.response || err);
    }
  };

  const handleUpdateTaskClick = (taskId, currentStatus) => {
    setEditingTaskId(taskId);
    setUpdatingStatus(currentStatus);
  };

  const handleUpdateTask = async (taskId) => {
    try {
      await api.patch(`/task/update-status/${taskId}`, { status: updatingStatus });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status: updatingStatus } : task));
      setEditingTaskId(null);
      setUpdatingStatus("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
      console.error(err.response || err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-yellow-100 px-3 mb-8 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-1xl font-bold py-2 text-gray-800">Task Manager</h1>
          <div className="bg-white px-2 py-1 bg-yellow-100 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0">
            <span className="text-gray-600 bg-yellow-100 font-medium">{user?.name}</span>
            <button
              className="bg-red-500 hover:bg-red-600 p-1 text-sm text-white rounded font-semibold transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="">
        {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white px-3 py-2 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Enter task title..."
              required
              className="w-2/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className=" px-4 py-2 border border-gray-300 rounded focus:outline-none"
            >
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Work">Work</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none hidden"
            >
              <option value="Not Started" selected>Not Started</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded font-semibold transition"
            >
              Add Task
            </button>
          </form>
        </div>

        <div className="bg-blue-100 p-4 my-2 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No tasks yet. Create one to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-4 rounded-lg border-l-4 border-indigo-500 hover:bg-gray-200 transition"
                >
                  <div className="task-content">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-bold">
                        Category   
                      </span>: {task.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-bold">
                        Priority
                      </span>: {task.priority}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-bold"> 
                      Status
                      </span>: {task.status}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                    {editingTaskId !== task._id && (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold transition mt-2 sm:mt-0"
                        onClick={() => handleDeleteTask(task._id)}
                        >
                        Delete
                      </button>
                    )}
                    {editingTaskId === task._id ? (
                      <div className="flex flex-col gap-2 w-full">
                        <select
                          value={updatingStatus}
                          onChange={(e) => setUpdatingStatus(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded focus:outline-none text-sm"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <div className="flex gap-2">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded font-semibold transition text-sm"
                            onClick={() => handleUpdateTask(task._id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded font-semibold transition text-sm"
                            onClick={() => setEditingTaskId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-semibold transition mt-2 sm:mt-0 ml-2"
                        onClick={() => handleUpdateTaskClick(task._id, task.status)}
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
