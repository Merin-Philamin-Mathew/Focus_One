import React, { useState, useEffect } from 'react';

const SamplePage = () => {
  // This would normally come from your backend/state
  const [currentTask, setCurrentTask] = useState(null);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Study' },
    { id: 2, name: 'Exercise' },
    { id: 3, name: 'Meditation' },
    { id: 4, name: 'Work' },
  ]);
  const [focusMode, setFocusMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskSubtopic, setNewTaskSubtopic] = useState('');
  const [completionAmount, setCompletionAmount] = useState('');
  const [completionUnit, setCompletionUnit] = useState('minutes');
  const [darkMode, setDarkMode] = useState(false);

  // Mock data for habit calendar
  const [habitData, setHabitData] = useState({
    currentStreak: 3,
    longestStreak: 7,
    completedDays: ['2025-04-01', '2025-04-02', '2025-04-03', '2025-04-05', '2025-04-06']
  });

  // Dark mode toggle effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check system preferences for dark mode on initial load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const startFocusMode = () => {
    setFocusMode(true);
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopFocusMode = () => {
    clearInterval(timerInterval);
    setFocusMode(false);
  };

  const completeTask = () => {
    // In a real app, this would send data to your backend
    setHabitData(prev => ({
      ...prev,
      currentStreak: prev.currentStreak + 1,
      longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
      completedDays: [...prev.completedDays, new Date().toISOString().split('T')[0]]
    }));
    setCurrentTask(null);
    stopFocusMode();
    setTimer(0);
  };

  const createNewTask = () => {
    if (!newTaskCategory) return;
    
    setCurrentTask({
      category: newTaskCategory,
      subtopic: newTaskSubtopic,
      created: new Date()
    });
    
    setShowTaskForm(false);
    setNewTaskCategory('');
    setNewTaskSubtopic('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate current month calendar days
  const getDaysInCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isCompleted = habitData.completedDays.includes(dateStr);
      return { day, dateStr, isCompleted };
    });
  };

  const daysInMonth = getDaysInCurrentMonth();
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-dark-300 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-dark-200 dark:border-b dark:border-dark-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold text-primary-700 dark:text-primary-400 m-0">FocusOne</h1>
          <div className="flex items-center space-x-2">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-700" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button className="btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Help
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {focusMode ? (
          <div className="card max-w-md mx-auto text-center">
            <div className="mb-6">
              <span className="badge-primary">
                {currentTask?.category}
                {currentTask?.subtopic && ` - ${currentTask.subtopic}`}
              </span>
              <h2 className="text-3xl mt-4 mb-2">Focus Mode</h2>
              <p className="text-secondary-600 dark:text-secondary-400">Minimize distractions and focus on your task</p>
            </div>
            
            <div className="timer-display my-8">
              {formatTime(timer)}
            </div>
            
            <div className="flex space-x-4 justify-center">
              <button 
                className="btn-secondary flex-1" 
                onClick={stopFocusMode}
              >
                Pause
              </button>
              <button 
                className="btn-primary flex-1" 
                onClick={() => {
                  stopFocusMode(); 
                  setShowTaskForm(true);
                }}
              >
                Complete
              </button>
            </div>
          </div>
        ) : currentTask ? (
          <div className="card max-w-md mx-auto">
            <h2 className="text-xl mb-4">Current Task</h2>
            
            <div className="p-4 bg-secondary-50 rounded-lg mb-6 dark:bg-dark-100">
              <div className="flex items-center mb-2">
                <span className="badge-primary mr-2">
                  {currentTask.category}
                </span>
                <span className="text-secondary-600 dark:text-secondary-400 text-sm">
                  {new Date(currentTask.created).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              
              {currentTask.subtopic && (
                <p className="text-secondary-800 dark:text-secondary-200">{currentTask.subtopic}</p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button 
                className="btn-secondary flex-1"
                onClick={startFocusMode}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Start Focus
              </button>
              <button 
                className="btn-primary flex-1"
                onClick={() => setShowTaskForm(true)}
              >
                Complete
              </button>
            </div>
          </div>
        ) : showTaskForm ? (
          <div className="card max-w-md mx-auto">
            {currentTask ? (
              <h2 className="text-xl mb-4">Complete Task</h2>
            ) : (
              <h2 className="text-xl mb-4">Create New Task</h2>
            )}
            
            {!currentTask && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Category
                  </label>
                  <select 
                    className="form-input"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Subtopic (optional)
                  </label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g., Physics, Chapter 5"
                    value={newTaskSubtopic}
                    onChange={(e) => setNewTaskSubtopic(e.target.value)}
                  />
                </div>
              </>
            )}
            
            {currentTask && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    How much did you complete?
                  </label>
                  <div className="flex space-x-2">
                    <input 
                      type="number" 
                      className="form-input"
                      placeholder="Amount"
                      value={completionAmount}
                      onChange={(e) => setCompletionAmount(e.target.value)}
                    />
                    <select 
                      className="form-input"
                      value={completionUnit}
                      onChange={(e) => setCompletionUnit(e.target.value)}
                    >
                      <option value="minutes">minutes</option>
                      <option value="pages">pages</option>
                      <option value="sessions">sessions</option>
                      <option value="kilometers">kilometers</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex space-x-4">
              <button 
                className="btn-secondary flex-1"
                onClick={() => {
                  setShowTaskForm(false);
                  setCompletionAmount('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary flex-1"
                onClick={currentTask ? completeTask : createNewTask}
                disabled={currentTask ? !completionAmount : !newTaskCategory}
              >
                {currentTask ? 'Complete' : 'Create'}
              </button>
            </div>
          </div>
        ) : (
          <div className="card max-w-md mx-auto text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-secondary-400 dark:text-secondary-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h2 className="text-xl mb-2">No Active Task</h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">Create a task to start focusing on what matters</p>
            <button 
              className="btn-primary w-full"
              onClick={() => setShowTaskForm(true)}
            >
              Create New Task
            </button>
          </div>
        )}
        
        Habit Calendar Section
        <section className="mt-12">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl m-0">Habit Calendar</h2>
              <div className="flex items-center space-x-3">
                <div className="streak-indicator bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  {habitData.currentStreak} day streak
                </div>
                <div className="streak-indicator bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-100">
                  Best: {habitData.longestStreak} days
                </div>
              </div>
            </div>
            
            <div className="mb-2 text-center font-medium text-secondary-700 dark:text-secondary-300">
              {monthName} {currentDate.getFullYear()}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-secondary-500 dark:text-secondary-400">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {daysInMonth.map((day, i) => (
                <div 
                  key={i} 
                  className={`calendar-day ${
                    day.isCompleted 
                      ? 'bg-primary-400 text-white day-completed dark:bg-primary-600' 
                      : 'text-secondary-700 dark:text-secondary-300'
                  }`}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SamplePage;