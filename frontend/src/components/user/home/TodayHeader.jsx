import React from 'react'

function TodayHeader() {
  return (
    <>
      <header className="my-8 text-center">
          <h1 
            className="text-2xl font-heading font-bold text-primary-700 dark:text-primary-300 cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            Today's Focus
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </header> 
    </>
  )
}

export default TodayHeader
