import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { customToast } from '../utils/toasts/Sonner'
import Task from './tasks/Task'

function Home() {
 const {error,message}= useSelector((state) => state.tasks)
 const {darkMode}= useSelector((state) => state.user)

 console.log(darkMode)
 useEffect(()=>{
  if (error){
    customToast.error(error?.error)
  }
  if (message){
    customToast.success(message)
  }
 },[error,message])
  return (
    <div className=''>
      <Task/>
    </div>
  )
}

export default Home
