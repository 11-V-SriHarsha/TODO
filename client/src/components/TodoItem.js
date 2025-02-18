import React from 'react';

const TodoItem = ({ todo, onDelete, onToggle }) => {
  return (
    <div className="todo-item">
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id)}
        />
        <div className="todo-text">
          {todo.title}
          {todo.description && <p className="todo-description">{todo.description}</p>}
        </div>
      </div>
      
      <div className="todo-actions">
        <button 
          className={`action-btn ${todo.completed ? 'undo-btn' : 'complete-btn'}`}
          onClick={() => onToggle(todo._id)}
        >
          {todo.completed ? '↩️ Undo' : '✓ Complete'}
        </button>
        <button 
          className="action-btn delete-btn"
          onClick={() => onDelete(todo._id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
