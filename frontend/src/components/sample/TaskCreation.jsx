import { useState, useEffect } from 'react';
import { CheckCircle, Clock, X, Pause, Play, Edit3, Zap, ChevronRight } from 'lucide-react';
import HabitSearching from './HabitSearching';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedHabit, setCurrentStep } from '../../features/task/taskSlice';
import { useToast } from '../utils/toasts/Toast';
import { customToast } from '../utils/toasts/Sonner';

import celebrationAnimation from '../../assets/animations/celebrations/json_celebration.json';
import Lottie from 'lottie-react';

const TaskCreation = () => {
  const dispatch = useDispatch()
  const [showCelebration, setShowCelebration] = useState(false);

  const toast = useToast()
  // States for task creation flow
  const { selectedHabit, currentStep} = useSelector((state) => state.tasks);
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
      dispatch(setCurrentStep('active'));
    }
  };

  // Handle task completion
  const completeTask = () => {
    setShowCelebration(true)
    resetTask();
    customToast.success('Task Created!')
    // toast.success('Task Created!')
    setTimeout(() => {
      setShowCelebration(false); 
      resetTask();
    }, 3000);
  };

  // Reset task state
  const resetTask = () => {
    dispatch(setSelectedHabit(null));
    setSubTopic('');
    dispatch(setCurrentStep('create'));
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
    dispatch(setCurrentStep('focus'));
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
    <>
    {showCelebration && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Lottie animationData={celebrationAnimation} loop={false} style={{ width: 500, height: 500 }} />
      </div>
    )}
    <div className="max-w-lg mx-auto px-4">
      {currentStep === 'create' && (
        <div className="relative overflow-hidden card mt-8 pb-12">


          {/* Background graphic elements */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-400 rounded-bl-full opacity-10 dark:from-primary-700 dark:to-primary-900 dark:opacity-20"></div>
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-gradient-to-tr from-accent-200 to-accent-400 rounded-tr-full opacity-10 dark:from-accent-700 dark:to-accent-900 dark:opacity-15"></div>
          
          {/* Header with inspiring message */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-800 dark:text-white">Create Your Task</h2>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></div>
              <span className="text-sm text-secondary-600 dark:text-secondary-400">New Journey</span>
            </div>
          </div>
          
          {/* Motivation card */}
          <div className="relative z-10 bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-dark-100 dark:to-dark-200 p-4 rounded-xl mb-6 border-l-4 border-l-accent-500 shadow-inner-soft">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-accent-100 dark:bg-accent-900 p-2">
                <Zap className="h-5 w-5 text-accent-500" />
              </div>
              <p className="text-secondary-700 dark:text-secondary-300 text-sm italic">
                "Great achievements are born from small, consistent steps. What will you accomplish today?"
              </p>
            </div>
          </div>
          
          <form onSubmit={createTask} className="relative z-10">
            {/* Habit Selection with enhanced UI */}
            <div className="border border-secondary-200 dark:border-secondary-800 rounded-lg p-3 bg-white dark:bg-dark-300 mb-4">
              <div className="text-xs uppercase tracking-wide font-semibold text-secondary-500 dark:text-secondary-400 mb-2 px-1">
                Step 1: Choose Your Focus Area
              </div>
              <HabitSearching />
              <div className="mt-2 flex justify-between items-center text-xs text-secondary-500 dark:text-secondary-400">
                <span>{selectedHabit ? '✓ Area selected' : 'Select an area to focus on'}</span>
                <span className="flex items-center">
                  <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
            
            {/* Subtopic/Task Name with enhanced UI */}
            <div className="border border-secondary-200 dark:border-secondary-800 rounded-lg p-3 bg-white dark:bg-dark-300 mb-6">
              <div className="text-xs uppercase tracking-wide font-semibold text-secondary-500 dark:text-secondary-400 mb-2 px-1">
                Step 2: Define Your Specific Task
              </div>
              <div className="relative">
                <Edit3 className="absolute left-3 top-3 h-5 w-5 text-secondary-400" />
                <input
                  type="text"
                  id="subtopic"
                  maxLength={100}
                  className="form-input pl-10 pr-4 py-3 border-secondary-300 dark:border-secondary-700 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="What specifically will you work on?"
                  value={subTopic}
                  onChange={(e) => setSubTopic(e.target.value)}
                  required
                />
                 {subTopic.length > 0 && subTopic.length < 10 && (
                  <p className="text-sm text-red-400 mt-2">
                    Please be more specific  — at least 10 characters.
                  </p>
                )}
              </div>
              <div className="mt-2 flex justify-between items-center text-xs text-secondary-500 dark:text-secondary-400">
                <span>{subTopic ? '✓ Task defined' : 'Be specific about your task'}</span>
                <span className="text-primary-500 dark:text-primary-400">{subTopic.length}/100</span>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-secondary-600 dark:text-secondary-400 mb-1">
                <span>Progress</span>
                <span>{selectedHabit && subTopic ? '2/2 steps complete' : '1/2 steps complete'}</span>
              </div>
              <div className="h-1.5 bg-secondary-200 dark:bg-dark-300 rounded-full overflow-hidden">
                <div className={`h-full bg-primary-500 rounded-full transition-all duration-500 ${
                  !selectedHabit && !subTopic ? 'w-0' : 
                  (selectedHabit && !subTopic.trim()) || (!selectedHabit && subTopic.trim()) ? 'w-1/2' : 'w-full'
                }`}></div>
              </div>
            </div>
            
            {/* Submit button with animation */}
            <button 
              type="submit"
              className={`relative overflow-hidden btn-primary w-full py-4 font-medium text-white transition-all duration-300 ${
                (!selectedHabit || !subTopic.trim()) ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'
              }`}
              disabled={!selectedHabit || !subTopic.trim()}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Clock className="h-5 w-5 mr-2" />
                Begin Your Task
              </span>
              {selectedHabit && subTopic.trim() && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 transform transition-transform duration-300 ease-in-out -translate-x-full group-hover:translate-x-0"></div>
              )}
            </button>
            
            {/* Helper text */}
            <p className="text-center text-xs text-secondary-500 dark:text-secondary-400 mt-4">
              Create your task to start tracking your progress and stay focused
            </p>
          </form>
        </div>
      )}
      
      {currentStep === 'active' && (
        <div className="relative overflow-hidden card mt-8 pb-12">
          {/* Background graphic element */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-400 rounded-bl-full opacity-10 dark:from-primary-700 dark:to-primary-900 dark:opacity-20"></div>
          
          {/* Header with progress indicator */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Current Focus</h2>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></div>
              <span className="text-sm text-secondary-600 dark:text-secondary-400">In Progress</span>
            </div>
          </div>
          
          {/* Task display with enhanced styling */}
          <div className="relative z-10 bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-dark-100 dark:to-dark-200 p-5 rounded-xl mb-6 border-l-4 border-l-primary-500 shadow-inner-soft">
            <div className="flex items-start">
              {/* Category badge with pulsing animation */}
              <div className={`shrink-0 badge ${selectedHabit.color} text-white px-3 py-1 mb-2 shadow-sm`}>
                {selectedHabit.name}
                <span className="ml-1 inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse-slow"></span>
              </div>
            </div>
            
            {/* Task title with enhanced styling */}
            <h3 className="text-xl font-semibold mt-2 text-secondary-800 dark:text-white">{subTopic}</h3>
            
            {/* Visual progress indicator */}
            <div className="mt-4 bg-secondary-200 dark:bg-dark-300 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full w-1/5 transition-all duration-1000"></div>
            </div>
          </div>
          
          {/* Action options with visual grouping */}
          <div className="space-y-3">
            {/* Primary action section */}
            <div className="border border-secondary-200 dark:border-secondary-800 rounded-lg p-2 bg-white dark:bg-dark-300">
              <div className="text-xs uppercase tracking-wide font-semibold text-secondary-500 dark:text-secondary-400 mb-2 px-2">Complete Task</div>
              <button 
                className="btn-primary w-full py-3 shadow-sm"
                onClick={completeTask}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Mark as Complete
              </button>
            </div>

            {/* Focus options section */}
            <div className="border border-secondary-200 dark:border-secondary-800 rounded-lg p-2 bg-white dark:bg-dark-300">
              <div className="text-xs uppercase tracking-wide font-semibold text-secondary-500 dark:text-secondary-400 mb-2 px-2">Focus Options</div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="btn-accent flex-col py-4 items-center justify-center transition-transform hover:scale-105"
                  onClick={enterFocusMode}
                >
                  <Clock className="h-6 w-6 mb-1" />
                  <span>Focus Timer</span>
                </button>
                
                <button 
                  className="btn-secondary flex-col py-4 items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-700 dark:to-secondary-800 hover:opacity-90"
                >
                  <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 20h16M4 4h16M9 4v16M15 4v16" strokeLinecap="round" />
                  </svg>
                  <span>Task Divider</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Exit button positioned at bottom */}
          <div className="absolute bottom-0 inset-x-0 flex justify-center py-3">
            <button 
              className="text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 font-medium flex items-center text-sm transition-colors"
              onClick={resetTask}
            >
              <X className="h-4 w-4 mr-1" />
              Exit Task
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
    </>
  );
};

export default TaskCreation;