import React, { useEffect, useMemo, useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tasks');
      if (raw) setTasks(JSON.parse(raw));
    } catch (_) {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (_) {}
  }, [tasks]);

  const remaining = useMemo(() => tasks.filter(t => !t.completed).length, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    const newTask = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()), title, completed: false };
    setTasks(prev => [newTask, ...prev]);
    setInput('');
  };

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const clearCompleted = () => setTasks(prev => prev.filter(t => !t.completed));
  const renameTask = (id, title) => setTasks(prev => prev.map(t => t.id === id ? { ...t, title } : t));

  const filtered = useMemo(() => {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 rounded-2xl m-5 shadow-2xl">
      <div className="bg-white p-10 rounded-xl max-w-2xl w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
          Task Manager
        </h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 p-4 rounded-lg mb-6">
          <p className="text-gray-600 text-sm font-medium">
            Tasks Remaining
          </p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {remaining}
          </p>
        </div>

        <form onSubmit={addTask} className="flex gap-3 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-full border-2 border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-violet-500 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/50 active:transform-none"
          >
            Add Task
          </button>
        </form>

        <div className="flex gap-2 justify-center mb-6">
          <button 
            onClick={() => setFilter('all')} 
            className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')} 
            className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 ${
              filter === 'active'
                ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')} 
            className={`py-2 px-6 rounded-full font-semibold transition-all duration-300 ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="text-left space-y-3 mb-6 max-h-64 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="text-gray-500 text-center py-8 italic">
              {filter === 'all' ? 'No tasks yet. Add one above!' : 
               filter === 'active' ? 'No active tasks.' : 'No completed tasks.'}
            </div>
          )}
          {filtered.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
              onRename={(title) => renameTask(task.id, title)}
            />
          ))}
        </div>

        {tasks.some(t => t.completed) && (
          <button 
            onClick={clearCompleted}
            className="bg-white text-gray-700 border-2 border-gray-300 py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:border-gray-400 hover:bg-gray-50 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none"
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  useEffect(() => setTitle(task.title), [task.title]);

  const commit = () => {
    const t = title.trim();
    if (t && t !== task.title) onRename(t);
    setEditing(false);
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg flex items-center gap-3 group hover:from-blue-50 hover:to-violet-50 transition-all duration-300">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
      />

      {editing ? (
        <input
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') { setTitle(task.title); setEditing(false); }
          }}
          className="flex-1 rounded-full border-2 border-blue-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 text-left font-medium cursor-pointer ${
            task.completed 
              ? 'line-through text-gray-400' 
              : 'text-gray-700 group-hover:text-gray-900'
          }`}
        >
          {task.title}
        </span>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200 font-medium"
        >
          {editing ? 'Save' : 'Edit'}
        </button>
        <button
          onClick={onDelete}
          className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskList;
