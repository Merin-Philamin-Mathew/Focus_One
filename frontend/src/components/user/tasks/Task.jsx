import { useState, useEffect } from 'react';
import { CheckCircle, Clock, X, Pause, Play, Edit3, Zap, ChevronRight, Target, Award } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep, setCompletedAmountR, resetTaskR, setTimerR } from '@features/task/taskSlice';
import { completeTaskAction, deleteTaskAction } from '@/features/task/taskActions';

import { customToast } from '@components/utils/toasts/Sonner';
import celebrationAnimation from '@assets/animations/celebrations/json_celebration.json';
import Lottie from 'lottie-react';
import TaskCreationSection from './task_creation/TaskCreationSection';
import ActiveTask from './task_active/ActiveTask';
import CompletionTaskDialog from './task_active/CompletionTaskDialog';
import MiniTimer from './task_active/MiniTimer';
import FocusMode from './task_active/FocusMode';
import CompletedTasks from './completedTasks.jsx/CompletedTasks';
import TodayHeader from '../home/TodayHeader';

const Task = () => {
  const dispatch = useDispatch();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [animating, setAnimating] = useState(false);

  // States for task creation flow
  const { 
    timerR, 
    currentStep, 
    subTopic, 
    estAmountOfWork, 
    workUnit, 
    ongoing_task, 
    completedAmount, 
    completedTasks,
    error, 
    message 
  } = useSelector((state) => state.tasks);
  
  const setCompletedAmount = (value) => { dispatch(setCompletedAmountR(value)) };
  const [showMiniTimer, setShowMiniTimer] = useState(false);

  const [percentComplete, setPercentComplete] = useState(0);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const [timer, setTimer] = useState(timerR || {
    seconds: 0,
    minutes: 0,
    hours: 0,
    isRunning: false
  });
  const [timerInterval, setTimerInterval] = useState(null);

  // Handle task completion
  // used in focus task and active task completion button
  const completeTask = async () => {
    try {
      const data = {
        amount_of_work: completedAmount,
        is_completed: true,
      };
      const response = await dispatch(completeTaskAction({ ongoing_task, data, completedAmount, estAmountOfWork })).unwrap();
      if (response) {
        setShowCompletionDialog(false);
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          resetTask();
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };
  
  // Handle task completion
  // used in focus task and active task completion button
  const deleteTask = async () => {
    try {
      const response = dispatch(deleteTaskAction(ongoing_task)).unwrap();
      console.log('deleted task from task cmp', response);
      if (response) {
        setShowCompletionDialog(false);
        resetTask();
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
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
    dispatch(resetTaskR());
    stopTimer();
    setTimer({
      seconds: 0,
      minutes: 0,
      hours: 0,
      isRunning: false
    });
  };

  // Show/hide mini timer based on current step and timer status
  useEffect(() => {
    if (currentStep === 'active' && (timer.seconds > 0 || timer.minutes > 0 || timer.hours > 0)) {
      setShowMiniTimer(true);
    } else if (currentStep === 'focus') {
      setShowMiniTimer(false);
    }
  }, [currentStep, timer]);
    
  useEffect(() => {
    const isDefaultTimer =
      timer.seconds === 0 &&
      timer.minutes === 0 &&
      timer.hours === 0;
    
    if (!isDefaultTimer) {
      dispatch(setTimerR(timer));
    }
  }, [timer, dispatch]);
    
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
  
  // Handle animation timing for completed tasks
  useEffect(() => {
    if (completedTasks.length > 0) {
      setAnimating(true);
      setTimeout(() => {
        setShowCompleted(true);
        setTimeout(() => setAnimating(false), 50);
      }, 300);
    }
  }, [completedTasks]);

  return (
    <>
      {showCelebration && (
        <div className="fixed top-15 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Lottie animationData={celebrationAnimation} loop={false} style={{ width: 500, height: 500 }} />
        </div>
      )}
      
      <TodayHeader />
      
      <div 
        className={`grid gap-6 transition-all duration-500 ease-in-out ${
          animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${
          showCompleted 
            ? 'grid-cols-1 md:grid-cols-2' 
            : 'grid-cols-1 justify-items-center'
        }`}
      >
        {/* Current Task Area */}
        <div className="w-full transition-all duration-500 ease-in-out max-w-full transform-none">
          <div className="max-w-lg mx-auto px-4">
            {currentStep === 'create' && (
              <TaskCreationSection />
            )}
            
            {currentStep === 'active' && (
              <ActiveTask 
                completeTask={completeTask} 
                startTimer={startTimer} 
                percentComplete={percentComplete}
                setShowCompletionDialog={setShowCompletionDialog}
              />
            )}
            

          </div>
        
        </div>

         
        {/* Today's Completed Tasks */}
        <div className=''>
        {showCompleted && completedTasks && (
          <CompletedTasks completedTasks={completedTasks} />
        )}
        </div>
      </div>

         {/* Completion Dialog */}
         {showCompletionDialog && (
              <CompletionTaskDialog
                completeTask={completeTask} 
                deleteTask={deleteTask} 
                percentComplete={percentComplete}
                setShowCompletionDialog={setShowCompletionDialog}
              />
            )}

              
          {/* Mini Timer - Only shown when in active step and has time recorded */}
          {showMiniTimer && currentStep === 'active' && (
            <MiniTimer 
              timer={timer} 
              startTimer={startTimer} 
              pauseTimer={pauseTimer} 
              timerInterval={timerInterval} 
            />
          )}
            
            {currentStep === 'focus' && (
              <FocusMode
                startTimer={startTimer} 
                pauseTimer={pauseTimer} 
                timerInterval={timerInterval}  
                percentComplete={percentComplete}
                setShowCompletionDialog={setShowCompletionDialog}
              />
            )}

      {/* Add global styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shine {
          from {
            transform: translateY(-100%) rotate(45deg);
          }
          to {
            transform: translateY(200%) rotate(45deg);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}} />
    </>
  );
};

export default Task;