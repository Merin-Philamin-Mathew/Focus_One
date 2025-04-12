import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Calendar, ChevronRight, Award, Flag, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion'; // Note: would need to be installed

const CompletedTasks = () => {
  const dispatch = useDispatch();
  const { completedTasks } = useSelector((state) => state.tasks);
  const [expanded, setExpanded] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Group tasks by date
  const groupedTasks = completedTasks.reduce((acc, task) => {
    const date = new Date(task.completed_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  // Get today's date for highlighting
  const today = new Date().toLocaleDateString();
  
  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  // Format time display
  const formatTime = (timeString) => {
    if (!timeString) return "--:--:--";
    
    // Assuming timeString is in format like "1h 23m 45s" or similar
    const hours = timeString.match(/(\d+)h/);
    const minutes = timeString.match(/(\d+)m/);
    const seconds = timeString.match(/(\d+)s/);
    
    return `${hours ? hours[1].padStart(2, '0') : '00'}:${
      minutes ? minutes[1].padStart(2, '0') : '00'}:${
      seconds ? seconds[1].padStart(2, '0') : '00'}`;
  };

  // Handle task selection for details view
  const handleTaskClick = (task) => {
    setSelectedTask(selectedTask?.id === task.id ? null : task);
  };

  return (
    <div className="card overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200 to-green-100 rounded-bl-full opacity-20 dark:from-green-800 dark:to-green-900 dark:opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary-200 to-primary-100 rounded-tr-full opacity-10 dark:from-primary-800 dark:to-primary-900 dark:opacity-10"></div>
      
      {/* Header with title and toggle */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center">
          <div className="mr-3 p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold">Completed Tasks</h2>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-secondary-600 dark:text-secondary-400 mr-2">
            {completedTasks.length} tasks
          </span>
          <button 
            className="p-1.5 rounded-full bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 transition-colors"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse completed tasks" : "Expand completed tasks"}
          >
            <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Empty state */}
      {completedTasks.length === 0 ? (
        <div className="py-10 text-center">
          <div className="relative inline-flex justify-center items-center w-20 h-20 bg-secondary-100 dark:bg-secondary-800/50 rounded-full mb-4">
            <Award className="h-10 w-10 text-secondary-400 dark:text-secondary-500" />
            <div className="absolute w-full h-full rounded-full border-4 border-dashed border-secondary-200 dark:border-secondary-700 animate-spin-slow"></div>
          </div>
          <h3 className="text-lg font-semibold text-secondary-700 dark:text-secondary-300 mb-2">No Completed Tasks Yet</h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 max-w-xs mx-auto">
            Complete your first task to start building your accomplishment history.
          </p>
        </div>
      ) : (
        <div className={`transition-all duration-500 ${expanded ? 'max-h-96 overflow-y-auto pr-1' : 'max-h-48 overflow-hidden'}`}>
          <AnimatePresence>
            {sortedDates.map(date => (
              <motion.div 
                key={date} 
                className="mb-4 last:mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 text-secondary-500 dark:text-secondary-400 mr-1.5" />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    date === today ? 'text-green-600 dark:text-green-400' : 'text-secondary-500 dark:text-secondary-400'
                  }`}>
                    {date === today ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {groupedTasks[date].map((task, idx) => (
                    <motion.div 
                      key={task.id || idx}
                      layoutId={`task-${task.id || idx}`}
                      className={`completed-task-item p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        selectedTask?.id === task.id 
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50' 
                          : 'bg-white dark:bg-dark-200 border-secondary-200 dark:border-secondary-800 hover:border-primary-200 dark:hover:border-primary-800/50'
                      }`}
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex justify-between items-start relative">
                        {/* Completed checkmark overlay */}
                        <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center transform rotate-12 shadow-sm">
                          <CheckCircle className="h-3.5 w-3.5 text-white" />
                        </div>
                        
                        <div className="pr-8">
                          <div className={`badge ${task.habit?.color || 'bg-secondary-200 dark:bg-secondary-700'} text-white inline-block mb-1 px-2 py-0.5`}>
                            {task.habit?.name || 'Task'}
                          </div>
                          <h4 className="font-medium text-secondary-800 dark:text-white line-clamp-1">{task.sub_topic}</h4>
                          
                          {/* Additional details when expanded */}
                          {selectedTask?.id === task.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-800"
                            >
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 text-secondary-500 mr-1.5" />
                                  <span className="text-secondary-600 dark:text-secondary-400">
                                    {formatTime(task.time_spent || "0h 0m 0s")}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Flag className="h-3.5 w-3.5 text-accent-500 mr-1.5" />
                                  <span className="text-secondary-600 dark:text-secondary-400">
                                    {task.completed_at ? new Date(task.completed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'} 
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex justify-end mt-3">
                                <button className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center opacity-70 hover:opacity-100 transition-opacity">
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="badge bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 whitespace-nowrap">
                            {task.amount_of_work} {task.work_unit}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {expanded && completedTasks.length > 5 && (
            <div className="text-center mt-6 pb-2">
              <button className="btn-secondary text-sm px-4 py-2">
                View Full History
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Interactive confetti elements for visual flair */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        <div className="confetti top-10 left-10"></div>
        <div className="confetti top-20 left-40"></div>
        <div className="confetti top-5 left-60"></div>
        <div className="confetti top-15 left-80"></div>
      </div>
    </div>
  );
};

export default CompletedTasks;