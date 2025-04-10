import React, { useEffect } from 'react'
import { createHabitAction } from '../../features/task/taskActions'
import { useDispatch, useSelector } from 'react-redux'
import { customToast } from '../utils/toasts/Sonner'

function Home() {
 const dispatch = useDispatch()
 const {error,message}= useSelector((state) => state.tasks)

 useEffect(()=>{
  if (error){
    customToast.error(error?.error)
  }
  if (message){
    customToast.success(error?.error)
  }
 },[error,message])
  return (
    <div className=''>
      <button onClick={()=>dispatch(createHabitAction(
        {
          "habit_name": "Learn Cycling"
        }
      ))}>  
        click me, {error?.error}
      </button>
      <h1>HOME</h1>
    </div>
  )
}

export default Home
