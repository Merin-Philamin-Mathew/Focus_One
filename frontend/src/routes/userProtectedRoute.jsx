import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetAll } from '../features/user/userSlice';

function ProtectedRoute({children}) {

  const userDetails = useSelector(state=>state.user.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(userDetails, 'userrr')

  useEffect(()=>{
    if (!userDetails || userDetails === null || userDetails === undefined){
      dispatch(resetAll())
      navigate('/signin')
    }
  })
  return children;
}

export default ProtectedRoute