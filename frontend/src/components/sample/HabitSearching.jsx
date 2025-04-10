import React, { useState, useEffect } from 'react';
import { Search, X, Plus, CheckCircle, Filter, PlusCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchedHabits, createHabitAction } from '../../features/task/taskActions';
import { resetAll, setSelectedHabit } from '../../features/task/taskSlice';

function HabitSearching() {
  const dispatch = useDispatch();
  const [habitSearch, setHabitSearch] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Get searched habits from Redux store
  const { searchedHabits, loading, selectedHabit } = useSelector((state) => state.tasks);

  // Debounce function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (habitSearch.trim().length > 0) {
        setDebouncedSearchTerm(habitSearch);
        setIsDropdownOpen(true);
      } else {
        setIsDropdownOpen(false);
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
    // Transform API habit object to match your component's expected format
    const formattedHabit = {
      id: habit.id,
      name: habit.habit_name,
      color: getHabitColor(habit.id), // Function to assign color based on habit ID
    };
    dispatch(setSelectedHabit(formattedHabit));
    setHabitSearch('');
    setIsDropdownOpen(false);
    setIsAddingNew(false);
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

  // Clear selected habit
  const clearSelectedHabit = () => {
    dispatch(setSelectedHabit(null));
  };
  
  // Handle input focus
  const handleInputFocus = () => {
    if (habitSearch.trim().length > 0) {
      setIsDropdownOpen(true);
    }
  };

  // Handle creating a new habit
  const handleCreateHabit = () => {
    if (habitSearch.trim().length > 0) {
      dispatch(createHabitAction({
        "habit_name": habitSearch
      })).then((response) => {
        if (response?.payload?.data?.id) {
          console.log('hABIT CREAT')
          selectHabit({
            id: response.payload.data?.id,
            habit_name: response.payload.data?.habit_name
          });
          
          // Show success notification (you could implement this)
          console.log(`Created new habit: ${habitSearch}`);
        }
      });
    }
  };

  // Toggle add new habit prompt
  const toggleAddNew = () => {
    setIsAddingNew(!isAddingNew);
  };

  return (
    <div>
      {!selectedHabit ? (
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-secondary-400" />
            </div>
            
            <input
              type="text"
              id="habit"
              className="form-input pl-10 pr-12 py-3.5 border-secondary-300 dark:border-secondary-700 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm text-base"
              placeholder="Search habits (e.g. Coding, Reading)"
              value={habitSearch}
              onChange={(e) => setHabitSearch(e.target.value)}
              onFocus={handleInputFocus}
              autoComplete="off"
            />
            
            {habitSearch && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-secondary-100 dark:hover:bg-dark-100 text-secondary-500"
                onClick={() => setHabitSearch('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Recent or suggested habits chips */}
          {!isDropdownOpen && (
            <div className="flex flex-wrap gap-2 mt-2">
              {['Read', 'Exercise', 'Coding', 'Meditation'].map((suggestion, index) => (
                <button
                  key={index}
                  className="group flex items-center rounded-full border border-secondary-200 dark:border-secondary-700 px-3 py-1.5 text-sm transition-all hover:bg-secondary-50 dark:hover:bg-dark-100"
                  onClick={() => setHabitSearch(suggestion)}
                >
                  <div className={`w-2 h-2 rounded-full ${getHabitColor(index)} mr-2`}></div>
                  <span className="text-secondary-700 dark:text-secondary-300">{suggestion}</span>
                  <Plus className="h-3.5 w-3.5 ml-1.5 text-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
          
          {/* Habit search results dropdown with enhanced styling */}
          {isDropdownOpen && (
            <div className="relative">
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-dark-100 rounded-lg shadow-soft border border-secondary-200 dark:border-secondary-700 max-h-60 overflow-y-auto">
                <div className="sticky top-0 flex items-center justify-between p-3 border-b border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-dark-200 rounded-t-lg">
                  <span className="text-sm font-medium flex items-center text-secondary-700 dark:text-secondary-300">
                    <Filter className="h-4 w-4 mr-1.5 text-secondary-500" />
                    Search Results
                  </span>
                  <span className="text-xs text-secondary-500 dark:text-secondary-400">
                    {loading ? 'Searching...' : searchedHabits ? `${searchedHabits.length} found` : '0 found'}
                  </span>
                </div>
                
                <div className="p-1">
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                    </div>
                  ) : searchedHabits && searchedHabits.length > 0 ? (
                    searchedHabits.map(habit => (
                      <div 
                        key={habit.id}
                        className="flex items-center p-3 hover:bg-secondary-50 dark:hover:bg-dark-200 rounded-md cursor-pointer transition-colors group"
                        onClick={() => selectHabit(habit)}
                      >
                        <div className={`w-3 h-3 rounded-full ${getHabitColor(habit.id)} mr-3`}></div>
                        <span className="flex-1 text-secondary-800 dark:text-secondary-200">{habit.habit_name}</span>
                        <CheckCircle className="h-4 w-4 text-primary-500 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))
                  ) : isAddingNew ? (
                    // Adding new habit UI - animated form
                    <div className="p-4 animate-fadeIn">
                      <div className="text-center mb-3">
                        <div className="rounded-full bg-primary-100 dark:bg-primary-900/30 p-2 inline-flex mb-2">
                          <PlusCircle className="h-5 w-5 text-primary-500" />
                        </div>
                        <p className="text-sm font-medium text-secondary-800 dark:text-secondary-200">Create "{habitSearch}"</p>
                        <p className="text-xs text-secondary-500 mt-1">Add this as a new habit to track</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          className="flex-1 py-2 text-sm bg-white dark:bg-dark-200 border border-secondary-300 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-md hover:bg-secondary-50 dark:hover:bg-dark-300 transition-colors"
                          onClick={toggleAddNew}
                        >
                          Cancel
                        </button>
                        <button 
                          className="flex-1 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors flex items-center justify-center"
                          onClick={handleCreateHabit}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create Habit
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Empty results with option to create new habit
                    <div className="p-4 text-center">
                      <div className="rounded-full bg-secondary-100 dark:bg-dark-200 p-2 inline-flex mb-2">
                        <Search className="h-5 w-5 text-secondary-500" />
                      </div>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">No matching habits found</p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1 mb-3">Would you like to create this habit?</p>
                      
                      <button 
                        className="px-4 py-2 text-sm rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700/50 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center mx-auto"
                        onClick={toggleAddNew}
                      >
                        <PlusCircle className="h-4 w-4 mr-1.5" />
                        Create "{habitSearch}"
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-dark-200 dark:to-dark-100 rounded-lg p-4 border border-secondary-200 dark:border-secondary-800 shadow-inner-soft">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${selectedHabit.color} flex items-center justify-center`}>
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-secondary-700 dark:text-white text-base mb-0.5">
                  {selectedHabit.name}
                </h4>
                <span className="text-xs text-secondary-500 dark:text-secondary-400">
                  Selected Category
                </span>
              </div>
            </div>
            <button 
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-secondary-200 dark:hover:bg-dark-300 text-secondary-500 transition-colors"
              onClick={clearSelectedHabit}
              aria-label="Remove habit"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitSearching;