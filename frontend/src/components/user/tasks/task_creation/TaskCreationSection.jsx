import React, { useEffect } from 'react'
import HabitSearching from './HabitSearching';

import { createTaskAction } from '@features/task/taskActions';
import { setCurrentStep, setEstAmountOfWorkR, setSubTopicR, setWorkUnitR } from '@/features/task/taskSlice';
import { useDispatch, useSelector } from 'react-redux';

import { CheckCircle, Clock, X, Pause, Play, Edit3, Zap, ChevronRight, Target } from 'lucide-react';
import { getAvailableUnits } from './logic';
import { customToast } from '@/components/utils/toasts/Sonner';


function TaskCreationSection() {
  const dispatch = useDispatch()
  const setSubTopic = (value)=>{dispatch(setSubTopicR(value))}
  const setEstAmountOfWork = (value)=>{dispatch(setEstAmountOfWorkR(value))}
  const setWorkUnit = (value)=>{dispatch(setWorkUnitR(value))}

  const { selectedHabit, subTopic, estAmountOfWork, workUnit, ongoing_task} = useSelector((state) => state.tasks);


    // Handle task creation submission
    const createTask = async (e) => {
      e.preventDefault();
      console.log(e,'create task')
      try {
      if (selectedHabit && subTopic?.trim() && estAmountOfWork && workUnit) {
        const task_details= {
          "task_name": subTopic,
          "habit": selectedHabit.id,
          "habit_id": selectedHabit.id,
          "est_amount_of_work": estAmountOfWork,
          "unit": workUnit,
          "is_completed": false
        }
        const response = dispatch(createTaskAction(task_details))
          if (response){
            dispatch(setCurrentStep('active'));
            customToast.success('Task Created!')
          }  
        }
      } catch (err) {
        console.error('Failed to complete task:', err);
      }
    };

     useEffect(() => {
          const units = getAvailableUnits(selectedHabit);
          setWorkUnit(units[0]); // Default to first unit in the list
        }, [selectedHabit]);
      
   

  return (
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
            {getAvailableUnits(selectedHabit).map((unit) => (
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
  )
}

export default TaskCreationSection
