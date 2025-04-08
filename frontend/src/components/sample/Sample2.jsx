import React, { useState, useEffect } from 'react';
import TaskCreation from './TaskCreation';

const Sample2 = () => {


  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-dark-300 transition-colors duration-300">
      {/* Header */}
    
      <main className="container mx-auto px-4 py-8">
  
        <TaskCreation/>
      </main>
    </div>
  );
};

export default Sample2;