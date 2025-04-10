import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { resetAll } from '../features/user/userSlice';

function ProtectedRoute({children}) {

  const isLoggedin = useSelector(state=>state.user.isLoggedin);
  const dispatch = useDispatch();

  console.log(isLoggedin, 'userrr')

  if (!isLoggedin){
    dispatch(resetAll());
    return <Navigate to="/signin" />;
  }

  return children;
}

export default ProtectedRoute