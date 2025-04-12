import { CheckCircle, Clock, X,  Target } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {  setCurrentStep, setCompletedAmountR} from '@features/task/taskSlice';


function ActiveTask({completeTask,startTimer, percentComplete, setShowCompletionDialog}) {
    const dispatch = useDispatch()

    // States for task creation flow
    const { selectedHabit, subTopic, estAmountOfWork, workUnit ,completedAmount} = useSelector((state) => state.tasks);
      const setCompletedAmount = (value)=>{dispatch(setCompletedAmountR(value))}
  
      // Enter focus mode
  const enterFocusMode = () => {
    dispatch(setCurrentStep('focus'));
    startTimer();
  };
  return (
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
              className="form-input shine-input pl-3 pr-4 py-2 border-secondary-300 dark:border-secondary-700 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
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
            onClick={() => {
              const current = parseFloat(completedAmount) || 0;
              const updated = (current + 1).toString();
              setCompletedAmount(updated);
            }}
            className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200"
          >
            +1 {workUnit}
          </button>
          <button 
            type="button"
            onClick={() => {
              const current = parseFloat(completedAmount) || 0;
              const updated = (current + 5).toString();
              setCompletedAmount(updated);
            }}
            className="badge bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 hover:bg-secondary-200"
          >
            +5 {workUnit}
          </button>
          {workUnit === 'minutes' && (
            <button 
              type="button"
              onClick={() => {
                const current = parseFloat(completedAmount) || 0;
                const updated = (current + 1).toString();
                setCompletedAmount(updated);
              }}
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
          className={`btn-primary w-full py-3 shadow-sm ${!completedAmount ? 'opacity-60' : ''}`}
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
        onClick={()=>setShowCompletionDialog(true)}
      >
        <X className="h-4 w-4 mr-1" />
        Exit Task
      </button>
    </div>
  </div>
  )
}

export default ActiveTask
