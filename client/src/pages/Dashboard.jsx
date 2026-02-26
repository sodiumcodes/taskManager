import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Dashboard.css";

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading && !user) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Task Manager</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        <div className="add-task-section">
          <h2>Add New Task</h2>
          <form onSubmit={handleAddTask}>
            <div className="input-group">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Enter task title..."
                required
              />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Work">Work</option>
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Not Started">Not Started</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button type="submit">Add Task</button>
            </div>
          </form>
        </div>

        <div className="tasks-section">
          <h2>Your Tasks</h2>
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Create one to get started!</p>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task._id} className="task-card">
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    <p className="task-date">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
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
