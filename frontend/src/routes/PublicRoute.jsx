import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userDetails);

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;