// React Components for Keeper App
const { useState, useEffect, useRef } = React;

// ThemeToggle Component
const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <div className="theme-toggle-container">
      <button className="theme-toggle" onClick={onToggle}>
        <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
      </button>
    </div>
  );
};

// Header Component
const Header = ({ theme, onThemeToggle }) => {
  return (
    <>
      <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      <header className="app-header">
        <h1 className="app-title">
          <span className="logo">✅</span>
          ToDoList App
        </h1>
        <p className="app-subtitle">Stay organized and productive</p>
      </header>
    </>
  );
};

// TodoForm Component
const TodoForm = ({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="todo-form-container">
      <form className="todo-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="form-control todo-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
          <button type="submit" className="btn btn--primary add-btn">
            <span>➕</span>
            Add Todo
          </button>
        </div>
      </form>
    </div>
  );
};

// TodoItem Component
const TodoItem = ({ todo, onToggle, onEdit, onDelete, onDragStart, onDragEnd, onDragOver, onDrop, isDragging, isDragOver }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const inputRef = useRef(null);

  // Update editValue when todo.text changes
  useEffect(() => {
    setEditValue(todo.text);
  }, [todo.text]);

  // Focus and select text when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setEditValue(todo.text);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(todo.id, editValue.trim());
    } else {
      setEditValue(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(todo.text);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      data-id={todo.id}
      draggable="true"
      onDragStart={() => onDragStart(todo.id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={() => onDrop(todo.id)}
      onDragEnter={(e) => e.preventDefault()}
    >
      <div className="drag-handle">⋮⋮</div>
      
      <div 
        className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
      ></div>
      
      <input
        ref={inputRef}
        type="text"
        className="todo-text"
        value={isEditing ? editValue : todo.text}
        readOnly={!isEditing}
        onDoubleClick={handleEdit}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      
      <div className="todo-actions">
        <button
          className="action-btn edit-btn"
          onClick={isEditing ? handleSave : handleEdit}
          title={isEditing ? 'Save' : 'Edit'}
        >
          {isEditing ? '💾' : '✏️'}
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(todo.id)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

// TodoList Component
const TodoList = ({ todos, onToggle, onEdit, onDelete, onReorder }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragStart = (id) => {
    setDraggedItem(id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetId) => {
    if (draggedItem && targetId && draggedItem !== targetId) {
      onReorder(draggedItem, targetId);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const remainingTodos = totalTodos - completedTodos;

  if (totalTodos === 0) {
    return (
      <div className="todo-list-container">
        <div className="todo-stats">
          <span className="stat-item">
            <span className="stat-label">Total:</span>
            <span>0</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Completed:</span>
            <span>0</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Remaining:</span>
            <span>0</span>
          </span>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No todos yet</h3>
          <p>Add your first todo above to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <div className="todo-stats">
        <span className="stat-item">
          <span className="stat-label">Total:</span>
          <span>{totalTodos}</span>
        </span>
        <span className="stat-item">
          <span className="stat-label">Completed:</span>
          <span>{completedTodos}</span>
        </span>
        <span className="stat-item">
          <span className="stat-label">Remaining:</span>
          <span>{remainingTodos}</span>
        </span>
      </div>

      <div className="todo-list">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragging={draggedItem === todo.id}
            isDragOver={dragOverItem === todo.id}
          />
        ))}
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ 
      textAlign: 'center', 
      marginTop: '2rem', 
      padding: '1rem', 
      color: 'var(--color-text-secondary)',
      fontSize: 'var(--font-size-sm)'
    }}>
      <p>&copy; {currentYear} ToDOList App. Keep your thoughts organized.</p>
    </footer>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn--primary" onClick={onConfirm}>
            Delete
          </button>
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React Hooks", completed: false },
    { id: 2, text: "Build Todo App", completed: true },
    { id: 3, text: "Master Node.js", completed: false }
  ]);
  
  const [theme, setTheme] = useState('light');
  const [showModal, setShowModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('keeper-todos');
    const savedTheme = localStorage.getItem('keeper-theme');
    
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error('Error loading todos from localStorage');
      }
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save to localStorage when todos or theme changes
  useEffect(() => {
    localStorage.setItem('keeper-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('keeper-theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        setTodoToDelete(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const editTodo = (id, newText) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodoToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (todoToDelete) {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoToDelete));
    }
    setShowModal(false);
    setTodoToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setTodoToDelete(null);
  };

  const reorderTodos = (draggedId, targetId) => {
    const draggedIndex = todos.findIndex(todo => todo.id === draggedId);
    const targetIndex = todos.findIndex(todo => todo.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newTodos = [...todos];
      const [removed] = newTodos.splice(draggedIndex, 1);
      newTodos.splice(targetIndex, 0, removed);
      setTodos(newTodos);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container">
      <Header theme={theme} onThemeToggle={toggleTheme} />
      
      <TodoForm onAddTodo={addTodo} />
      
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onEdit={editTodo}
        onDelete={deleteTodo}
        onReorder={reorderTodos}
      />
      
      <Footer />
      
      <Modal
        isOpen={showModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this todo?"
      />
    </div>
  );
};

// Render the App (equivalent to the index.js structure requested)
ReactDOM.render(<App />, document.getElementById("root"));