import { setCurrentStep } from '@/features/task/taskSlice';
import { X, Zap, Target, Award, AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

function CompletionTaskDialog({deleteTask, completeTask, percentComplete, setShowCompletionDialog}) {
    const dispatch = useDispatch()
    const { estAmountOfWork, workUnit, completedAmount } = useSelector((state) => state.tasks);

    return (
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
        ) : percentComplete == 0 ? (
          <>
            <div className="inline-flex items-center justify-center p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-secondary-500 dark:text-secondary-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Progress Recorded</h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              You haven't recorded any progress yet on your {estAmountOfWork} {workUnit} goal. Would you like to continue or exit?
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
      
      {percentComplete < 100 && percentComplete > 0 && (
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
      
      {percentComplete == 0 && (
        <div className="bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-100 dark:border-secondary-800 rounded-lg p-3 mb-5">
          <div className="flex items-start">
            <div className="shrink-0 mr-3">
              <AlertTriangle className="h-5 w-5 text-secondary-500" />
            </div>
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              <span className="font-medium">Note:</span> Exiting without recording progress will remove this task. Are you sure?
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-3">
      {percentComplete > 0 ? (
        <button 
          onClick={completeTask} 
          className="btn-primary py-3"
        >
          Finish & Save Progress
        </button>
     ): (
      <button 
        onClick={deleteTask} 
        className="btn-danger py-3 flex items-center justify-center"
      >
        <X className="h-4 w-4 mr-2" />
        Exit Without Saving
      </button>
     )}
        {percentComplete < 100 && (
          <button 
            onClick={() => {
                setShowCompletionDialog(false)
                dispatch(setCurrentStep('active'));
            }} 
            className="btn-secondary py-2"
          >
            Continue & Update Progress
          </button>
        )}
      </div>
    </div>
  </div>
  )
}

export default CompletionTaskDialog