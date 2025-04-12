import { useState, useEffect } from 'react';
import { CheckCircle, Clock, X, Pause, Play, Edit3, Zap, ChevronRight, Target } from 'lucide-react';
import HabitSearching from './HabitSearching';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedHabit, setCurrentStep, setSubTopicR,  setEstAmountOfWorkR, setWorkUnitR} from '../../features/task/taskSlice';
import { useToast } from '../utils/toasts/Toast';
import { customToast } from '../utils/toasts/Sonner';

import celebrationAnimation from '../../assets/animations/celebrations/json_celebration.json';
import Lottie from 'lottie-react';
import { createTaskAction } from '../../features/task/taskActions';

const TaskCreation = () => {
  const dispatch = useDispatch()
  const [showCelebration, setShowCelebration] = useState(false);

  const toast = useToast()
  // States for task creation flow
  const { selectedHabit, currentStep, subTopic, estAmountOfWork, workUnit, ongoing_task} = useSelector((state) => state.tasks);
  const [completedAmount, setCompletedAmount] = useState('');
  const [percentComplete, setPercentComplete] = useState(0);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const setSubTopic = (value)=>{dispatch(setSubTopicR(value))}
  const setEstAmountOfWork = (value)=>{dispatch(setEstAmountOfWorkR(value))}
  const setWorkUnit = (value)=>{dispatch(setWorkUnitR(value))}

    // Common units based on habit types
    const defaultUnits = {
      reading: ['pages', 'chapters', 'minutes', 'hours'],
      exercise: ['minutes', 'reps', 'sets', 'miles', 'kilometers'],
      learning: ['minutes', 'hours', 'lessons', 'exercises'],
      writing: ['words', 'paragraphs', 'pages', 'minutes'],
      meditation: ['minutes', 'sessions'],
      default: ['minutes', 'hours', 'items', 'sessions', 'tasks']
    };
  
    // Determine available units based on selected habit
    const getAvailableUnits = () => {
      if (!selectedHabit) return defaultUnits.default;
      
      const habitType = selectedHabit.name.toLowerCase();
      if (habitType.includes('read') || habitType.includes('book')) return defaultUnits.reading;
      if (habitType.includes('exercise') || habitType.includes('workout') || habitType.includes('fitness')) return defaultUnits.exercise;
      if (habitType.includes('learn') || habitType.includes('study')) return defaultUnits.learning;
      if (habitType.includes('write') || habitType.includes('journal')) return defaultUnits.writing;
      if (habitType.includes('meditate') || habitType.includes('mindfulness')) return defaultUnits.meditation;
      
      return defaultUnits.default;
    };

    useEffect(() => {
      const units = getAvailableUnits();
      setWorkUnit(units[0]); // Default to first unit in the list
    }, [selectedHabit]);
  
   

  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
    isRunning: false
  });
  const [timerInterval, setTimerInterval] = useState(null);

   // Handle task creation submission
   const createTask = async (e) => {
    e.preventDefault();
    console.log(e,'create task')
    if (selectedHabit && subTopic?.trim() && estAmountOfWork && workUnit) {
      // Here you would save all fields including est_amount_of_work and unit

      const task_details= {
        "task_name": subTopic,
        "habit": selectedHabit.id,
        "habit_id": selectedHabit.id,
        "est_amount_of_work": estAmountOfWork,
        "unit": workUnit,
        "is_completed": false
      }
      const response = await dispatch(createTaskAction(task_details))
      console.log(response,'task created 84')
      console.log(ongoing_task,'task created 84')
      
      dispatch(setCurrentStep('active'));
      customToast.success('Task Created!')
    }
  };
  console.log(ongoing_task,'task created 84')

  // Handle task completion
  const completeTask = () => {
    setShowCelebration(true)
  };

  const finalizeTask = () => {
    const completed = parseFloat(completedAmount);
    const estimated = parseFloat(estAmountOfWork);
    
    // Success message and analytics would go here
    // Save completion data
    
    // Reset task flow
    resetTask();
    customToast.success('finalize task called!')
    // toast.success('Task Created!')
    setTimeout(() => {
      setShowCelebration(false); 
      resetTask();
    }, 3000);
  };

    // Handle progress calculation
    useEffect(() => {
      if (completedAmount && estAmountOfWork) {
        const completed = parseFloat(completedAmount);
        const estimated = parseFloat(estAmountOfWork);
        let percent = Math.min(100, Math.round((completed / estimated) * 100));
        setPercentComplete(percent);
      } else {
        setPercentComplete(0);
      }
    }, [completedAmount, estAmountOfWork]);


  // Reset task state
  const resetTask = () => {
    setShowCompletionDialog(false);
    dispatch(setSelectedHabit(null));
    dispatch(setSubTopicR(null));
    dispatch(setEstAmountOfWorkR(null));
    dispatch(setWorkUnitR(null));
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
              <p className="text-secondary-700  dark:text-secondary-300 text-sm italic">
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
            <div className="border border-secondary-200 dark:border-secondary-800 rounded-lg p-3 bg-white dark:bg-dark-300 mb-4">
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
                 {subTopic?.length > 0 && subTopic?.length < 10 && (
                  <p className="text-sm text-red-400 mt-2">
                    Please be more specific — at least 10 characters.
                  </p>
                )}
              </div>
              <div className="mt-2 flex justify-between items-center text-xs text-secondary-500 dark:text-secondary-400">
                <span>{subTopic ? '✓ Task defined' : 'Be specific about your task'}</span>
                <span className="text-primary-500 dark:text-primary-400">{subTopic?.length}/100</span>
              </div>
            </div>
            
            {/* NEW: Estimated Work Amount with smart units */}
            <div className="border border-secondary-200 dark:border-secondary-800 rounded-lg p-3 bg-white dark:bg-dark-300 mb-6">
              <div className="text-xs uppercase tracking-wide font-semibold text-secondary-500 dark:text-secondary-400 mb-2 px-1">
                Step 3: Set Your Goal
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-grow ">
                  <Target className="absolute left-3 top-3 h-5 w-5 text-secondary-400" />
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    id="estAmountOfWork"
                    className="form-input text-sm pl-10 pr-4 py-3 border-secondary-300 dark:border-secondary-700 rounded-l-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="How much will you complete?"
                    value={estAmountOfWork}
                    onChange={(e) => setEstAmountOfWork(e.target.value)}
                    // required
                  />
                </div>
                
                <select
                  value={workUnit}
                  onChange={(e) => setWorkUnit(e.target.value)}
                  className="form-select border-secondary-300 dark:border-secondary-700 rounded-lg py-3 pl-3 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-secondary-50 dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 border-l-0"
                >
                  {getAvailableUnits().map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              
              {/* Smart suggestions */}
              {selectedHabit && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Quick options:</span>
                  {selectedHabit.name.toLowerCase().includes('read') ? (
                    <>
                      <button 
                        type="button"
                        onClick={() => { setEstAmountOfWork('30'); setWorkUnit('minutes'); }}
                        className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700"
                      >
                        30 minutes
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setEstAmountOfWork('20'); setWorkUnit('pages'); }}
                        className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700"
                      >
                        20 pages
                      </button>
                    </>
                  ) : selectedHabit.name.toLowerCase().includes('exercise') ? (
                    <>
                      <button 
                        type="button"
                        onClick={() => { setEstAmountOfWork('45'); setWorkUnit('minutes'); }}
                        className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700"
                      >
                        45 minutes
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setEstAmountOfWork('3'); setWorkUnit('sets'); }}
                        className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700"
                      >
                        3 sets
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        type="button"
                        onClick={() => { setEstAmountOfWork('15'); setWorkUnit('minutes'); }}
                        className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700"
                      >
                        15 minutes
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setEstAmountOfWork('30'); setWorkUnit('minutes'); }}
                        className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700"
                      >
                        30 minutes
                      </button>
                    </>
                  )}
                </div>
              )}
              
              {/* Goal visualization - conditional based on input values */}
              {estAmountOfWork && workUnit && (
                <div className="mt-3 bg-primary-50 dark:bg-primary-900/30 p-2 rounded-lg border border-primary-100 dark:border-primary-800">
                  <p className="text-sm text-primary-700 dark:text-primary-300 flex items-center">
                    <Target className="h-4 w-4 mr-1 text-primary-500" />
                    <span>
                      Goal: Complete <span className="font-medium">{estAmountOfWork} {workUnit}</span>
                      {workUnit === 'minutes' && Number(estAmountOfWork) >= 60 && 
                        ` (${Math.floor(Number(estAmountOfWork) / 60)}h ${Number(estAmountOfWork) % 60}m)`
                      }
                    </span>
                  </p>
                </div>
              )}
            </div>
            
            {/* Progress indicator - updated to include 3 steps */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-secondary-600 dark:text-secondary-400 mb-1">
                <span>Progress</span>
                <span>
                  {!selectedHabit && !subTopic && !estAmountOfWork ? '0/3 steps' : 
                   ((selectedHabit ? 1 : 0) + (subTopic ? 1 : 0) + (estAmountOfWork ? 1 : 0)) + '/3 steps'}
                </span>
              </div>
              <div className="h-1.5 bg-secondary-200 dark:bg-dark-300 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-primary-500 rounded-full transition-all duration-500`}
                  style={{ 
                    width: `${((selectedHabit ? 1 : 0) + (subTopic?.trim() ? 1 : 0) + (estAmountOfWork ? 1 : 0)) * 100 / 3}%` 
                  }}
                ></div>
              </div>
            </div>
            
            {/* Submit button with animation */}
            <button 
              type="submit"
              className={`relative overflow-hidden btn-primary w-full py-4 font-medium text-white transition-all duration-300 ${
                (!selectedHabit || !subTopic?.trim() || !estAmountOfWork) ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'
              }`}
              disabled={!selectedHabit || !subTopic?.trim() || !estAmountOfWork}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Clock className="h-5 w-5 mr-2" />
                Begin Your Task
              </span>
              {selectedHabit && subTopic?.trim() && estAmountOfWork && (
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
            <div className="flex items-start justify-between">
              {/* Category badge with pulsing animation */}
              <div className={`shrink-0 badge ${selectedHabit.color} text-white px-3 py-1 mb-2 shadow-sm`}>
                {selectedHabit.name}
                <span className="ml-1 inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse-slow"></span>
              </div>
              
              {/* Goal indicator */}
              <div className="shrink-0 badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 px-3 py-1 mb-2 flex items-center">
                <Target className="h-3.5 w-3.5 mr-1.5" />
                <span>Goal: {estAmountOfWork} {workUnit}</span>
              </div>
            </div>
            
            {/* Task title with enhanced styling */}
            <h3 className="text-xl font-semibold mt-2 text-secondary-800 dark:text-white">{subTopic}</h3>
            
            {/* Interactive progress tracker */}
            <div className="mt-5">
              <div className="flex justify-between items-center text-xs text-secondary-600 dark:text-secondary-400 mb-1.5">
                <span className="font-medium">Progress</span>
                <span>{completedAmount ? `${completedAmount}/${estAmountOfWork} ${workUnit} (${percentComplete}%)` : 'Not started yet'}</span>
              </div>
              <div className="mt-1 bg-secondary-200 dark:bg-dark-300 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    percentComplete >= 100 
                      ? 'bg-green-500' 
                      : percentComplete > 50 
                        ? 'bg-primary-500' 
                        : percentComplete > 0 
                          ? 'bg-accent-500' 
                          : 'bg-secondary-400'
                  }`}
                  style={{ width: `${percentComplete}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Action options with visual grouping */}
          <div className="space-y-3">
            {/* Primary action section */}
            <div className="border border-secondary-200 dark:border-secondary-800 rounded-lg p-3 bg-white dark:bg-dark-300">
              <div className="text-xs uppercase tracking-wide font-semibold text-secondary-500 dark:text-secondary-400 mb-2 px-1">Update Your Progress</div>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-grow">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input pl-3 pr-4 py-2 border-secondary-300 dark:border-secondary-700 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder={`How many ${workUnit} completed?`}
                    value={completedAmount}
                    onChange={(e) => setCompletedAmount(e.target.value)}
                  />
                </div>
                
                <div className="shrink-0 px-3 py-2 bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 rounded-lg">
                  {workUnit}
                </div>
              </div>
              
              {/* Quick increment buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button 
                  type="button"
                  onClick={() => setCompletedAmount(prevAmount => {
                    const current = parseFloat(prevAmount) || 0;
                    return (current + 1).toString();
                  })}
                  className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200"
                >
                  +1 {workUnit}
                </button>
                <button 
                  type="button"
                  onClick={() => setCompletedAmount(prevAmount => {
                    const current = parseFloat(prevAmount) || 0;
                    return (current + 5).toString();
                  })}
                  className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200"
                >
                  +5 {workUnit}
                </button>
                {workUnit === 'minutes' && (
                  <button 
                    type="button"
                    onClick={() => setCompletedAmount(prevAmount => {
                      const current = parseFloat(prevAmount) || 0;
                      return (current + 15).toString();
                    })}
                    className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200"
                  >
                    +15 {workUnit}
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => setCompletedAmount(estAmountOfWork)}
                  className="badge bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 hover:bg-primary-200"
                >
                  Complete Goal ({estAmountOfWork})
                </button>
              </div>
              
              <button 
                className={`btn-primary w-full py-3 shadow-sm ${!completedAmount ? 'opacity-50' : ''}`}
                onClick={completeTask}
                disabled={!completedAmount}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete Task
              </button>
            </div>

            {/* Focus options section */}
            <div className="border border-secondary-200 dark:border-secondary-800 rounded-lg p-3 bg-white dark:bg-dark-300">
              <div className="text-xs uppercase tracking-wide font-semibold text-secondary-500 dark:text-secondary-400 mb-2 px-1">Focus Options</div>
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
      
      {/* Completion Dialog */}
      {showCompletionDialog && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-200 rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <button 
              onClick={() => setShowCompletionDialog(false)}
              className="absolute right-4 top-4 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center mb-6">
              {percentComplete >= 100 ? (
                <>
                  <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <Award className="h-8 w-8 text-green-500 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Goal Achieved!</h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    Amazing job! You completed {completedAmount} {workUnit} of your {estAmountOfWork} {workUnit} goal.
                  </p>
                </>
              ) : percentComplete >= 70 ? (
                <>
                  <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                    <Award className="h-8 w-8 text-primary-500 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Great Progress!</h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    Well done! You completed {completedAmount} {workUnit} of your {estAmountOfWork} {workUnit} goal.
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center p-3 bg-accent-100 dark:bg-accent-900/30 rounded-full mb-4">
                    <Target className="h-8 w-8 text-accent-500 dark:text-accent-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Progress Made</h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    You completed {completedAmount} {workUnit} of your {estAmountOfWork} {workUnit} goal. Remember, progress is progress!
                  </p>
                </>
              )}
            </div>
            
            {percentComplete < 100 && (
              <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-100 dark:border-accent-800 rounded-lg p-3 mb-5">
                <div className="flex items-start">
                  <div className="shrink-0 mr-3">
                    <Zap className="h-5 w-5 text-accent-500" />
                  </div>
                  <p className="text-sm text-secondary-700 dark:text-secondary-300">
                    <span className="font-medium">Progress Tip:</span> Even small steps lead to big results over time. Keep going!
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={finalizeTask} 
                className="btn-primary py-3"
              >
                Finish & Save Progress
              </button>
              
              {percentComplete < 100 && (
                <button 
                  onClick={() => setShowCompletionDialog(false)} 
                  className="btn-secondary py-2"
                >
                  Continue Working
                </button>
              )}
            </div>
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