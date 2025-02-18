import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('pending'); // Changed default to pending
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout, navigate]);

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token, fetchTodos]);

  const addTodo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/todos', 
        { title, description },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTodos([...todos, response.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTodos = {
    pending: todos.filter(todo => !todo.completed),
    completed: todos.filter(todo => todo.completed),
    all: todos
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="todo-page">
      <div className="todo-container">
        <div className="todo-header">
          <h1>
            <span role="img" aria-label="sparkles">✨</span>
            My Tasks
          </h1>
          <button onClick={logout} className="logout-btn">
            <span role="img" aria-label="wave">👋</span>
            Logout
          </button>
        </div>

        <div className="todo-content">
          <div className="todo-filters">
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              <span role="img" aria-label="hourglass">⏳</span> Pending ({filteredTodos.pending.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              <span role="img" aria-label="check mark">✅</span> Completed ({filteredTodos.completed.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <span role="img" aria-label="clipboard">📋</span> All ({todos.length})
            </button>
          </div>

          {filter === 'pending' && (
            <form onSubmit={addTodo} className="todo-form">
              <div className="todo-input-stack">
                <div className="input-group">
                  <label htmlFor="todo-title">Title</label>
                  <input
                    id="todo-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="todo-description">Description</label>
                  <textarea
                    id="todo-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details about your task..."
                    rows="3"
                  />
                </div>
                <button 
                  type="submit"
                  className="add-todo-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>⏳ Adding...</>
                  ) : (
                    <>✨ Add Task</>
                  )}
                </button>
              </div>
            </form>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="todo-list">
            {filteredTodos[filter].length === 0 ? (
              <div className="empty-state">
                <h3>
                  {filter === 'pending' && (
                    <><span role="img" aria-label="sparkles">✨</span> All caught up!</>
                  )}
                  {filter === 'completed' && (
                    <><span role="img" aria-label="star">🌟</span> No completed tasks yet</>
                  )}
                  {filter === 'all' && (
                    <><span role="img" aria-label="memo">📝</span> No tasks added yet</>
                  )}
                </h3>
                <p>
                  {filter === 'pending' && 'Add new tasks to get started'}
                  {filter === 'completed' && 'Complete some tasks to see them here'}
                  {filter === 'all' && 'Start by adding your first task'}
                </p>
              </div>
            ) : (
              filteredTodos[filter].map(todo => (
                <div key={todo._id} className="todo-item">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo._id, todo.completed)}
                    className="todo-checkbox"
                  />
                  <div className="todo-content">
                    <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                      {todo.title}
                    </span>
                    {todo.description && (
                      <p className={`todo-description ${todo.completed ? 'completed' : ''}`}>
                        {todo.description}
                      </p>
                    )}
                  </div>
                  <div className="todo-actions">
                    <button
                      onClick={() => toggleTodo(todo._id, todo.completed)}
                      className={`action-btn complete-btn`}
                    >
                      {todo.completed ? '↩️ Undo' : '✅ Complete'}
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="action-btn delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
