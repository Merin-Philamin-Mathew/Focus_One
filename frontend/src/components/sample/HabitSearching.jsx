import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchedHabits } from '../../features/task/taskActions';
import { resetAll, setSelectedHabit } from '../../features/task/taskSlice';

function HabitSearching() {
  const dispatch = useDispatch();
  const [habitSearch, setHabitSearch] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { searchedHabits, loading , selectedHabit, success} = useSelector((state) => state.tasks);

  useEffect(()=>{
    if(success){
      dispatch(resetAll())
    }
  },[success])

  // Debounce function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (habitSearch.trim().length > 0) {
        setDebouncedSearchTerm(habitSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [habitSearch]);

  // Fetch habits when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
      dispatch(fetchSearchedHabits(debouncedSearchTerm));
    }
  }, [debouncedSearchTerm, dispatch]);


  const selectHabit = (habit) => {
    console.log('habit selection', habit);

    const formattedHabit = {
      id: habit.id,
      name: habit.habit_name,
      color: getHabitColor(habit.id), // Function to assign color based on habit ID
    };
    console.log('formatted Habit',formattedHabit)
    dispatch(setSelectedHabit(formattedHabit))
    setHabitSearch('');
  };

  // Function to assign a color to a habit based on its ID
  const getHabitColor = (id) => {
    const colors = [
      'bg-primary-500',
      'bg-accent-500',
      'bg-secondary-500',
      'bg-primary-600',
      'bg-accent-600',
    ];
    
    // Use modulo to cycle through available colors
    return colors[id % colors.length];
  };

  return (
    <div className="mb-6">
      <label htmlFor="habit" className="block text-sm font-medium mb-2 text-secondary-700 dark:text-secondary-300">
        Select Habit Category
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-secondary-400" />
        </div>
        
        <input
          type="text"
          id="habit"
          className="form-input pl-10 py-2 shadow-soft"
          placeholder="Search or select habit"
          value={habitSearch}
          onChange={(e) => setHabitSearch(e.target.value)}
        />
      </div>
      
      {/* Habit search results */}
      {habitSearch && (
        <div className="mt-2 p-2 bg-white dark:bg-dark-100 rounded-lg shadow-soft max-h-48 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-3">
              <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-sm text-secondary-500">Searching...</span>
            </div>
          ) : searchedHabits?.length > 0 ? (
            searchedHabits?.map(habit => (
              <div 
                key={habit.id} 
                className="flex items-center p-1 hover:bg-secondary-50 dark:hover:bg-dark-200 dark:text-secondary-50 rounded cursor-pointer transition-colors" 
                onClick={() => selectHabit(habit)}
              >
                <div className={`w-3 h-3 rounded-full ${getHabitColor(habit.id)} mr-2`}></div>
                <span className='text-sm font-heading'>{habit.habit_name}</span>
              </div>
            ))
          ) :
            <p className="text-sm text-secondary-500 p-2">No matching habits found</p>
          }
        </div>
      )}

      {/* Selected habit display*/}
      {selectedHabit && (
        <div className="mt-4 bg-white dark:bg-dark-100 border border-secondary-100 dark:border-dark-50 rounded-lg shadow-sm p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-4 h-9 min-h-full rounded-l-lg ${selectedHabit?.color} mr-3`}></div>
              <div>
                <h4 className="font-medium text-secondary-800 dark:text-secondary-200">
                  {selectedHabit.name}
                </h4>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  Selected Habit
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => {dispatch(setSelectedHabit(null))}}
              className="p-1.5 rounded-full hover:bg-secondary-100 dark:hover:bg-dark-200 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 transition-colors"
              aria-label="Remove selected habit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitSearching;