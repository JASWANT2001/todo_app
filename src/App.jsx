import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const getStoredTasks = () => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  };

  const [tasks, setTasks] = useState(getStoredTasks);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") {
      setError("Task cannot be empty!");
      return;
    }
    setError("");
    const task = { id: Date.now(), text: newTask, completed: false };
    setTasks((prevTasks) => [...prevTasks, task]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditedText(task.text);
  };

  const saveEditedTask = (id) => {
    if (editedText.trim() === "") {
      setError("Task description cannot be empty!");
      return;
    }
    setError("");
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: editedText } : task
      )
    );
    setEditingTask(null);
    setEditedText("");
  };

  return (
    <div className="todo-wrapper">
      <div className="todo-container">
        <h1>To Do List App</h1>
        <div className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Take a Note..."
          />
          <button onClick={addTask}>+</button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompletion(task.id)}
                />
                {editingTask === task.id ? (
                  <div className="edit-box">
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />
                    <button onClick={() => saveEditedTask(task.id)}>✔</button>
                  </div>
                ) : (
                  <span>{task.text}</span>
                )}
              </div>
              <div className="task-buttons">
                {editingTask !== task.id && (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => startEditing(task)}
                    >
                      🖊️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      ❌
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
