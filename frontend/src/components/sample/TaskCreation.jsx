import { useState, useEffect } from 'react';
import {  CheckCircle, Clock, X, Pause, Play } from 'lucide-react';
import HabitSearching from './HabitSearching';
import { useDispatch, useSelector } from 'react-redux';

const TaskCreation = () => {
  // States for task creation flow
  const [currentStep, setCurrentStep] = useState('create'); // 'create', 'active', 'focus'
  const { selectedHabit} = useSelector((state) => state.tasks);
  const [subTopic, setSubTopic] = useState('');
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
    isRunning: false
  });
  const [timerInterval, setTimerInterval] = useState(null);




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

  const dispatch = useDispatch()

  return (
    <div className="max-w-lg mx-auto px-4">
      {currentStep === 'create' && (
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Your Task</h2>
          
          <form onSubmit={createTask}>
            {/* Habit Selection */}
            <HabitSearching/>
            
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