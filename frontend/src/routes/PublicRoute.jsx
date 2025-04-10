import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isLoggedin = useSelector((state) => state.user.isLoggedin);

  if (isLoggedin) {
    return <Navigate to="/" />;
  }

  return children;  
};

export default PublicRoute;