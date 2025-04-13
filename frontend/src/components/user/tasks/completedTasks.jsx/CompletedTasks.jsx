import { Award, CheckCircle, Clock, Target } from 'lucide-react'
import React from 'react'

function CompletedTasks({completedTasks}) {
  return (
    <div 
              
    className="w-full animate-slide-in py-8 px-12"
              style={{
                animation: 'slideIn 0.5s ease-out forwards'
              }}
            >
              <div className="card transform transition hover:shadow-lg duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <Award className="h-5 w-5 mr-2 text-green-500 animate-pulse" />
                    Today's Achievements
                  </h2>
                  <span className="badge badge-primary animate-bounce">
                    {completedTasks.length} completed
                  </span>
                </div>

                <div className="space-y-3">
                  {completedTasks.map((task, index) => (
                    <div 
                      key={task.id} 
                      className="bg-secondary-50 dark:bg-dark-100 p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 transform transition duration-300 hover:translate-x-1 hover:shadow-md"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeIn 0.4s ease-out forwards'
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="badge bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 mb-2">
                            {task.habit.habit_name}
                          </span>
                          <h3 className="font-medium text-secondary-800 dark:text-white">
                            {task.task_name}
                          </h3>
                          <div className="mt-1 text-sm text-secondary-600 dark:text-secondary-400 flex items-center">
                            <Target className="h-3.5 w-3.5 mr-1.5" />
                            <span>{task.amount_of_work}/{task.est_amount_of_work} {task.unit}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            <span>
                              {new Date(task.completed_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simple motivational message */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 animate-pulse">
                    Great progress today! Keep building your habits.
                  </p>
                </div>
              </div>
            </div>
  )
}

export default CompletedTasks
