import { useState, useEffect } from 'react';
import { CheckCircle, Clock, X, Pause, Play, Edit3, Zap, ChevronRight, Target, Award } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep,  setCompletedAmountR, resetTaskR} from '@features/task/taskSlice';
import { completeTaskAction, deleteTaskAction } from '@/features/task/taskActions';

function FocusMode({startTimer,pauseTimer,percentComplete,setShowCompletionDialog}) {
    const { selectedHabit, timerR, subTopic, estAmountOfWork, workUnit, ongoing_task,completedAmount} = useSelector((state) => state.tasks);
    const dispatch = useDispatch()
      // Format timerR display
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  useEffect(()=>{
    startTimer()
  },[])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-secondary-900 to-secondary-800 dark:from-dark-400 dark:to-dark-200 flex flex-col items-center justify-center px-4 z-40">
    {/* Task info panel with subtle animation */}
    <div className="text-center mb-6 animate-pulse-slow">
      <div className={`badge ${selectedHabit.color} text-white inline-block mb-2 px-3 py-1 shadow-md`}>
        {selectedHabit.name}
      </div>
      <h3 className="text-xl font-semibold text-white">{subTopic}</h3>
    </div>
    
    {/* Physical timerR with nice shadows and 3D effect */}
    <div className="relative mb-8">
      {/* TimerR background circle - outer ring with shine effect */}
      <div className="w-56 h-56 rounded-full bg-gradient-to-br from-secondary-700 to-secondary-950 dark:from-dark-200 dark:to-dark-500 flex items-center justify-center shadow-xl relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute top-0 left-1/4 w-1/2 h-12 bg-white opacity-10 blur-md rounded-full"></div>
        
        {/* Inner circle */}
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-secondary-800 to-secondary-900 dark:from-dark-300 dark:to-dark-400 flex items-center justify-center shadow-inner">
          {/* Digital display */}
          <div className="text-4xl font-bold font-mono text-white tracking-wider">
            {formatTime(timerR.hours)}:{formatTime(timerR.minutes)}:{formatTime(timerR.seconds)}
          </div>
        </div>
        
        {/* Animated progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="none" 
            strokeWidth="2" 
            stroke="rgba(255,255,255,0.1)" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="none" 
            strokeWidth="3" 
            stroke={selectedHabit.color.includes('bg-') ? selectedHabit.color.replace('bg-', 'text-') : 'text-primary-500'} 
            strokeLinecap="round"
            strokeDasharray="301.59"
            strokeDashoffset={301.59 - ((timerR.seconds + (timerR.minutes * 60) + (timerR.hours * 3600)) % 300) / 300 * 301.59}
            className="transition-all duration-1000"
          />
        </svg>
      </div>
      
      {/* Small animated indicators */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></div>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></div>
      </div>
    </div>
    
    {/* Goal tracker - show progress toward goal while focusing */}
    <div className="w-64 mb-6">
      <div className="flex justify-between items-center text-xs text-white mb-1.5">
        <span className="font-medium">Goal Progress</span>
        <span>{completedAmount || 0}/{estAmountOfWork} {workUnit}</span>
      </div>
      <div className="mt-1 bg-secondary-700 dark:bg-dark-500 h-2 rounded-full overflow-hidden">
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
    
    {/* Controls with hover effects */}
    <div className="flex space-x-4">
      {timerR.isRunning ? (
        <button 
          className="relative btn-secondary flex items-center justify-center py-3 px-5 transform hover:scale-105 transition-transform bg-secondary-700 hover:bg-secondary-600 text-white"
          onClick={pauseTimer}
        >
          <Pause className="h-5 w-5 mr-2" />
          Pause
          {/* Button shine effect */}
          <div className="absolute inset-0 overflow-hidden rounded">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-white opacity-10 transform rotate-45 translate-y-0 animate-shine"></div>
          </div>
        </button>
      ) : (
        <button 
          className="relative btn-secondary flex items-center justify-center py-3 px-5 transform hover:scale-105 transition-transform bg-secondary-700 hover:bg-secondary-600 text-white"
          onClick={startTimer}
        >
          <Play className="h-5 w-5 mr-2" />
          Resume
          {/* Button shine effect */}
          <div className="absolute inset-0 overflow-hidden rounded">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-white opacity-10 transform rotate-45 translate-y-0 animate-shine"></div>
          </div>
        </button>
      )}
      
      <button 
        className="relative btn-primary flex items-center justify-center py-3 px-5 transform hover:scale-105 transition-transform"
        onClick={() => {
          setShowCompletionDialog(true);
        }}
      >
        <CheckCircle className="h-5 w-5 mr-2" />
        Complete
        {/* Button shine effect */}
        <div className="absolute inset-0 overflow-hidden rounded">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-white opacity-10 transform rotate-45 translate-y-0 animate-shine"></div>
        </div>
      </button>
    </div>
    
    {/* Exit button - more visually interesting */}
    <button 
      className="absolute bottom-8 text-white opacity-50 hover:opacity-100 font-medium flex items-center text-sm transition-all hover:text-accent-300 transform hover:scale-105"
      onClick={() => {
        dispatch(setCurrentStep('active'));
        pauseTimer();
      }}
    >
      <X className="h-4 w-4 mr-1" />
      Exit Focus Mode
    </button>
  </div>
  )
}

export default FocusMode
