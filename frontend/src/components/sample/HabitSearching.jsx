import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchedHabits } from '../../features/task/taskActions';
import { setSelectedHabit } from '../../features/task/taskSlice';

function HabitSearching() {
  const dispatch = useDispatch();
  const [habitSearch, setHabitSearch] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Get searched habits from Redux store
  const { searchedHabits, loading , selectedHabit} = useSelector((state) => state.tasks);

  // Debounce function
  useEffect(() => {
    // Set a timer to update the debounced search term after 500ms
    const timer = setTimeout(() => {
      if (habitSearch.trim().length > 0) {
        setDebouncedSearchTerm(habitSearch);
      }
    }, 500); // 500ms delay

    // Clear the timer if habitSearch changes before the timeout
    return () => clearTimeout(timer);
  }, [habitSearch]);

  // Fetch habits when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
      dispatch(fetchSearchedHabits(debouncedSearchTerm));
    }
  }, [debouncedSearchTerm, dispatch]);

  // Handle habit selection
  const selectHabit = (habit) => {
    console.log('habit selection', habit);
    // Transform API habit object to match your component's expected format
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
          className="form-input pl-10"
          placeholder="Search or select habit"
          value={habitSearch}
          onChange={(e) => setHabitSearch(e.target.value)}
        />
      </div>
      
      {/* Habit search results */}
      {(habitSearch && searchedHabits && searchedHabits.length > 0) && (
        <div className="mt-2 p-2 bg-white dark:bg-dark-100 rounded-lg shadow-soft max-h-48 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-secondary-500 p-2">Searching...</p>
          ) : searchedHabits.length > 0 ? (
            searchedHabits.map(habit => (
              <div 
                key={habit.id}
                className="flex items-center p-2 hover:bg-secondary-50 dark:hover:bg-dark-200 dark:text-secondary-50 rounded cursor-pointer"
                onClick={() => selectHabit(habit)}
              >
                <div className={`w-3 h-3 rounded-full ${getHabitColor(habit.id)} mr-2`}></div>
                <span>{habit.habit_name}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-secondary-500 p-2">No matching habits found</p>
          )}
        </div>
      )}
      
      {/* No results message when search is performed but no results found */}
      {(habitSearch && (!searchedHabits || searchedHabits.length === 0) && !loading) && (
        <div className="mt-2 p-2 bg-white dark:bg-dark-100 rounded-lg shadow-soft">
          <p className="text-sm text-secondary-500 p-2">No matching habits found</p>
        </div>
      )}
      
      {/* Selected habit display */}
      {selectedHabit && (
        <div className="mt-3 flex items-center">
          <span className="text-sm font-medium mr-2 dark:text-secondary-300">Selected:</span>
          <div className={`badge ${selectedHabit.color} text-white px-3 py-1 flex items-center`}>
            {selectedHabit.name}
            <button 
              type="button" 
              className="ml-2"
              onClick={() => {dispatch(setSelectedHabit(null))}}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitSearching;