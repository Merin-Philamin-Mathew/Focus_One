import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Clock, X, Pause, Play, Maximize2, ChevronRight } from 'lucide-react';
import { setCurrentStep } from '@/features/task/taskSlice';

const MiniTimer = ({ timer, startTimer, pauseTimer, timerInterval }) => {
    const dispatch = useDispatch();
    const { selectedHabit } = useSelector((state) => state.tasks);
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
  
    const [percentComplete, setPercentComplete] = useState(0);

    // Format timer display
    const formatTime = (time) => {
      return time < 10 ? `0${time}` : time;
    };
  
    // Return to focus mode
    const returnToFocus = () => {
      dispatch(setCurrentStep('focus'));
    };
  
    return (
      <div 
        className={`fixed bottom-4 right-4 transition-all duration-300 ${
          isExpanded ? 'w-64 h-24' : 'w-20 h-20'
        } z-30`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glass morphism effect container */}
        <div 
          className={`group rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl
            ${isExpanded ? 'w-full h-full' : 'w-full h-full'}
            backdrop-blur-md bg-white/10 dark:bg-dark-400/20 border border-primary-700/50 dark:border-white/20
            ${isHovered ? 'scale-105' : 'scale-100'}`}
        >
          {/* Timer display */}
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Background pulsing circle */}
            <div className={`absolute rounded-full ${
              selectedHabit?.color || 'bg-primary-500'
            } opacity-20 animate-pulse-slow ${
              timer.isRunning ? 'w-16 h-16' : 'w-12 h-12'
            } transition-all duration-500`}></div>
            
            {/* Time display */}
            <div className="z-10 text-center">
              <div className={`font-mono font-bold transition-all duration-200 ${
                isExpanded ? 'text-xl mb-2' : 'text-sm'
              } text-secondary-700 dark:text-white`}>
                {formatTime(timer.hours)}:{formatTime(timer.minutes)}:{formatTime(timer.seconds)}
              </div>
              
              {/* Controls that appear in expanded mode or on hover */}
              <div className={`flex justify-center items-center space-x-2 transition-all ${
                isExpanded || isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                {timer.isRunning ? (
                  <button 
                    className="p-1 rounded-full bg-secondary-700 hover:bg-secondary-600 text-white transform hover:scale-110 transition"
                    onClick={pauseTimer}
                  >
                    <Pause className="h-4 w-4" />
                  </button>
                ) : (
                  <button 
                    className="p-1 rounded-full bg-secondary-700 hover:bg-secondary-600 text-white transform hover:scale-110 transition"
                    onClick={startTimer}
                  >
                    <Play className="h-4 w-4" />
                  </button>
                )}
                
                <button 
                  className="p-1 rounded-full bg-primary-600 hover:bg-primary-500 text-white transform hover:scale-110 transition"
                  onClick={returnToFocus}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Expand/collapse toggle */}
            <button 
              className="absolute top-1 right-1 p-1 text-black dark:text-white opacity-50 hover:opacity-100 transition"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <X className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          </div>
          
          {/* Subtle clock icon pulsing animation */}
          <div className="absolute top-2 left-2">
            <Clock className={`h-3 w-3 text-black dark:text-white opacity-50 ${timer.isRunning ? 'animate-pulse' : ''}`} />
          </div>
          
          {/* Animated progress bar at bottom */}
          {timer.isRunning && (
            <div className="absolute bottom-0 left-0 h-0.5 bg-primary-500">
              <div 
                className="h-full bg-white animate-timer-progress"
                style={{
                  animation: 'timer-progress 60s linear infinite',
                  width: '100%'
                }} 
              />
            </div>
          )}
        </div>
      </div>
    );
  };
  

export default MiniTimer
