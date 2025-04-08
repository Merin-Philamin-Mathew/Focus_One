import { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, X, Pause, Play } from 'lucide-react';

const TaskCreation = () => {
  // States for task creation flow
  const [currentStep, setCurrentStep] = useState('create'); // 'create', 'active', 'focus'
  const [habitSearch, setHabitSearch] = useState('');
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [subTopic, setSubTopic] = useState('');
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
    isRunning: false
  });
  const [timerInterval, setTimerInterval] = useState(null);

  const dummyHabits = [
    { id: 1, name: 'Study', color: 'bg-primary-500' },
    { id: 2, name: 'Exercise', color: 'bg-accent-500' },
    { id: 3, name: 'Meditation', color: 'bg-secondary-500' },
    { id: 4, name: 'Reading', color: 'bg-primary-600' },
    { id: 5, name: 'Writing', color: 'bg-accent-600' },
  ];

  // Filtered habits based on search
  const filteredHabits = habitSearch 
    ? dummyHabits.filter(habit => 
        habit.name.toLowerCase().includes(habitSearch.toLowerCase())
      )
    : [];

  // Handle habit selection
  const selectHabit = (habit) => {
    setSelectedHabit(habit);
    setHabitSearch('');
  };

  // Handle task creation submission
  const createTask = (e) => {
    e.preventDefault();
    if (selectedHabit && subTopic.trim()) {
      setCurrentStep('active');
    }
  };

  // Handle task completion
  const completeTask = () => {
    // Here you'd typically save the task data
    resetTask();
  };

  // Reset task state
  const resetTask = () => {
    setSelectedHabit(null);
    setSubTopic('');
    setCurrentStep('create');
    stopTimer();
    setTimer({
      seconds: 0,
      minutes: 0,
      hours: 0,
      isRunning: false
    });
  };

  // Enter focus mode
  const enterFocusMode = () => {
    setCurrentStep('focus');
    startTimer();
  };

  // Timer functions
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        let newSeconds = prevTimer.seconds + 1;
        let newMinutes = prevTimer.minutes;
        let newHours = prevTimer.hours;
        
        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes += 1;
        }
        
        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours += 1;
        }
        
        return {
          seconds: newSeconds,
          minutes: newMinutes,
          hours: newHours,
          isRunning: true
        };
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setTimer(prev => ({ ...prev, isRunning: false }));
    }
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // Format timer display
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <div className="max-w-lg mx-auto px-4">
      {currentStep === 'create' && (
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Your Task</h2>
          
          <form onSubmit={createTask}>
            {/* Habit Selection */}
            <div className="mb-6">
              <label htmlFor="habit" className="block text-sm font-medium mb-2 text-secondary-700 dark:text-secondary-300">
                Select Habit Category
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-secondary-400" />
                </div>
                
                <input
                  type="text"
                  id="habit"
                  className="form-input pl-10"
                  placeholder="Search or select habit"
                  value={habitSearch}
                  onChange={(e) => setHabitSearch(e.target.value)}
                />
              </div>
              
              {/* Habit search results */}
              {habitSearch && (
                <div className="mt-2 p-2 bg-white dark:bg-dark-100 rounded-lg shadow-soft max-h-48 overflow-y-auto">
                  {filteredHabits.length > 0 ? (
                    filteredHabits.map(habit => (
                      <div 
                        key={habit.id}
                        className="flex items-center p-2 hover:bg-secondary-50 dark:hover:bg-dark-200 dark:text-secodnary-50 rounded cursor-pointer"
                        onClick={() => selectHabit(habit)}
                      >
                        <div className={`w-3 h-3 rounded-full ${habit.color} mr-2`}></div>
                        <span>{habit.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-secondary-500 p-2">No matching habits found</p>
                  )}
                </div>
              )}
              
              {/* Selected habit display */}
              {selectedHabit && (
                <div className="mt-3 flex items-center">
                  <span className="text-sm font-medium mr-2 dark:text-secondary-300" >Selected:</span>
                  <div className={`badge ${selectedHabit.color} text-white px-3 py-1 flex items-center`}>
                    {selectedHabit.name}
                    <button 
                      type="button" 
                      className="ml-2"
                      onClick={() => setSelectedHabit(null)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Subtopic/Task Name */}
            <div className="mb-6">
              <label htmlFor="subtopic" className="block text-sm font-medium mb-2 text-secondary-700 dark:text-secondary-300">
                Task Details
              </label>
              <input
                type="text"
                id="subtopic"
                className="form-input"
                placeholder="What specifically will you work on?"
                value={subTopic}
                onChange={(e) => setSubTopic(e.target.value)}
                required
              />
            </div>
            
            {/* Submit button */}
            <button 
              type="submit"
              className="btn-primary w-full"
              disabled={!selectedHabit || !subTopic.trim()}
            >
              Create Task
            </button>
          </form>
        </div>
      )}
      
      {currentStep === 'active' && (
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-2 text-center">Current Task</h2>
          
          <div className="text-center mb-6">
            <div className={`badge ${selectedHabit.color} text-white inline-block mb-2 px-3 py-1`}>
              {selectedHabit.name}
            </div>
            <h3 className="text-xl font-semibold">{subTopic}</h3>
          </div>
          
          <div className="flex flex-col space-y-4">
            <button 
              className="btn-accent flex items-center justify-center"
              onClick={enterFocusMode}
            >
              <Clock className="h-5 w-5 mr-2" />
              Enter Focus Mode
            </button>
            
            <button 
              className="btn-primary flex items-center justify-center"
              onClick={completeTask}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Task
            </button>
            
            <button 
              className="btn-secondary flex items-center justify-center"
              onClick={resetTask}
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 'focus' && (
        <div className="fixed inset-0 bg-secondary-900 bg-opacity-95 dark:bg-dark-400 dark:bg-opacity-95 flex flex-col items-center justify-center px-4 z-50">
          <div className="text-center mb-6">
            <div className={`badge ${selectedHabit.color} text-white inline-block mb-2 px-3 py-1`}>
              {selectedHabit.name}
            </div>
            <h3 className="text-xl font-semibold text-white">{subTopic}</h3>
          </div>
          
          <div className="timer-display text-white mb-8">
            {formatTime(timer.hours)}:{formatTime(timer.minutes)}:{formatTime(timer.seconds)}
          </div>
          
          <div className="flex space-x-4">
            {timer.isRunning ? (
              <button 
                className="btn-secondary flex items-center justify-center"
                onClick={pauseTimer}
              >
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </button>
            ) : (
              <button 
                className="btn-secondary flex items-center justify-center"
                onClick={startTimer}
              >
                <Play className="h-5 w-5 mr-2" />
                Resume
              </button>
            )}
            
            <button 
              className="btn-primary flex items-center justify-center"
              onClick={completeTask}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCreation;