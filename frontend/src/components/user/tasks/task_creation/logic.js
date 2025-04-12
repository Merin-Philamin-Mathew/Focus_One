    // Common units based on habit types
    const defaultUnits = {
      reading: ['pages', 'chapters', 'minutes', 'hours'],
      exercise: ['minutes', 'reps', 'sets', 'miles', 'kilometers'],
      learning: ['minutes', 'hours', 'lessons', 'exercises'],
      writing: ['words', 'paragraphs', 'pages', 'minutes'],
      meditation: ['minutes', 'sessions'],
      default: ['minutes', 'hours', 'items', 'sessions', 'tasks']
    };
       
   // Determine available units based on selected habit
   export const getAvailableUnits = (selectedHabit) => {
    if (!selectedHabit) return defaultUnits.default;
    
    const habitType = selectedHabit.name.toLowerCase();
    if (habitType.includes('read') || habitType.includes('book')) return defaultUnits.reading;
    if (habitType.includes('exercise') || habitType.includes('workout') || habitType.includes('fitness')) return defaultUnits.exercise;
    if (habitType.includes('learn') || habitType.includes('study')) return defaultUnits.learning;
    if (habitType.includes('write') || habitType.includes('journal')) return defaultUnits.writing;
    if (habitType.includes('meditate') || habitType.includes('mindfulness')) return defaultUnits.meditation;
    
    return defaultUnits.default;
  };
