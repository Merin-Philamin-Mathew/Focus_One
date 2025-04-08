import React, { useState } from 'react'
import {  Search, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { fetchSearchedHabits } from '../../features/task/taskActions';

function HabitSearching({selectedHabit , setSelectedHabit}) {
    const dispatch = useDispatch()
      const [habitSearch, setHabitSearch] = useState('');
    
      const dummyHabits = [
        { id: 1, name: 'Study', color: 'bg-primary-500' },
        { id: 2, name: 'Exercise', color: 'bg-accent-500' },
        { id: 3, name: 'Meditation', color: 'bg-secondary-500' },
        { id: 4, name: 'Reading', color: 'bg-primary-600' },
        { id: 5, name: 'Writing', color: 'bg-accent-600' },
      ];
    
      // Filtered habits based on search
      const filteredHabits = habitSearch 
        ? dummyHabits.filter(habit => 
            habit.name.toLowerCase().includes(habitSearch.toLowerCase())
          )
        : [];

          // Handle habit selection
  const selectHabit = (habit) => {
    console.log('habit selection',habit)
    setSelectedHabit(habit);
    setHabitSearch('');
};


  return (
    <div className="mb-6">
              <button type='button' htmlFor="habit" className="block text-sm font-medium mb-2 text-secondary-700 dark:text-secondary-300"
                onClick={()=>{dispatch(fetchSearchedHabits('re'))}}

              >
                Select Habit Category
              </button>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-secondary-400" />
                </div>
                
                <input
                  type="text"
                  id="habit"
                  className="form-input pl-10"
                  placeholder="Search or select habit"
                  value={habitSearch}
                  onChange={(e) => setHabitSearch(e.target.value)}
                />
              </div>
              
              {/* Habit search results */}
              {habitSearch && (
                <div className="mt-2 p-2 bg-white dark:bg-dark-100 rounded-lg shadow-soft max-h-48 overflow-y-auto">
                  {filteredHabits.length > 0 ? (
                    filteredHabits.map(habit => (
                      <div 
                        key={habit.id}
                        className="flex items-center p-2 hover:bg-secondary-50 dark:hover:bg-dark-200 dark:text-secodnary-50 rounded cursor-pointer"
                        onClick={() => selectHabit(habit)}
                      >
                        <div className={`w-3 h-3 rounded-full ${habit.color} mr-2`}></div>
                        <span>{habit.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-secondary-500 p-2">No matching habits found</p>
                  )}
                </div>
              )}
              
              {/* Selected habit display */}
              {selectedHabit && (
                <div className="mt-3 flex items-center">
                  <span className="text-sm font-medium mr-2 dark:text-secondary-300" >Selected:</span>
                  <div className={`badge ${selectedHabit.color} text-white px-3 py-1 flex items-center`}>
                    {selectedHabit.name}
                    <button 
                      type="button" 
                      className="ml-2"
                      onClick={() => setSelectedHabit(null)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
  )
}

export default HabitSearching
