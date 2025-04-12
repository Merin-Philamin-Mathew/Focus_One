import { useState, useEffect } from 'react';
import { CheckCircle, Clock, X, Pause, Play, Edit3, Zap, ChevronRight, Target, Award } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep,  setCompletedAmountR, resetTaskR, setTimerR} from '@features/task/taskSlice';
import { completeTaskAction, deleteTaskAction } from '@/features/task/taskActions';

import { customToast } from '@components/utils/toasts/Sonner';
import celebrationAnimation from '@assets/animations/celebrations/json_celebration.json';
import Lottie from 'lottie-react';
import TaskCreationSection from './task_creation/TaskCreationSection';
import ActiveTask from './task_active/ActiveTask';
import CompletionTaskDialog from './task_active/CompletionTaskDialog';
import MiniTimer from './task_active/MiniTimer';
import FocusMode from './task_active/FocusMode';

const Task = () => {
  const dispatch = useDispatch()
  const [showCelebration, setShowCelebration] = useState(false);

  // States for task creation flow
  const { timerR, currentStep, subTopic, estAmountOfWork, workUnit, ongoing_task,completedAmount} = useSelector((state) => state.tasks);
    const setCompletedAmount = (value)=>{dispatch(setCompletedAmountR(value))}
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
      const response = await dispatch(completeTaskAction({ ongoing_task, completedAmount, estAmountOfWork })).unwrap(); // <-- unwrap gives you the actual payload
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
    console.log('deleted task from task cmp',response);
    if (response) {
      setShowCompletionDialog(false)
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
        timer.hours === 0 &&
        timer.isRunning === false;
    
      if (!isDefaultTimer) {
        console.log('kkk');
        dispatch(setTimerR(timer));
      } else {
        console.log('lll');
      }
    }, [timer]);
    



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

 


  return (
    <>
    {showCelebration && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Lottie animationData={celebrationAnimation} loop={false} style={{ width: 500, height: 500 }} />
      </div>
    )}
    <div className="max-w-lg mx-auto px-4">
      {currentStep === 'create' && (
       <TaskCreationSection/>
      )}
      
      {currentStep === 'active' && (
        <ActiveTask 
        completeTask={completeTask} 
        startTimer={startTimer} 
        percentComplete={percentComplete}
        setShowCompletionDialog={setShowCompletionDialog}
        />
      )}
      
      {/* Completion Dialog */}
      {showCompletionDialog && (
        <CompletionTaskDialog
        completeTask={completeTask} 
        deleteTask={deleteTask} 
        percentComplete={percentComplete}
        setShowCompletionDialog={setShowCompletionDialog}
        />
      )}
      
      {currentStep === 'focus' && (
        <FocusMode
          // timer={timer} 
          startTimer={startTimer} 
          pauseTimer={pauseTimer} 
          timerInterval={timerInterval}  
          percentComplete={percentComplete}
          setShowCompletionDialog={setShowCompletionDialog}
        />
      )}
    </div>
     {/* Mini Timer - Only shown when in active step and has time recorded */}
     {showMiniTimer && currentStep === 'active' && (
        <MiniTimer 
          timer={timer} 
          startTimer={startTimer} 
          pauseTimer={pauseTimer} 
          timerInterval={timerInterval} 
        />
      )}
    </>
  );
};

export default Task;