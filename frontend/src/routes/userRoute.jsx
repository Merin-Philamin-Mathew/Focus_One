import {Route, Routes} from 'react-router-dom';
import Home from '../components/user/Home';
import Login from '../components/user/Login';
import SignUp from '../components/user/SignUp';
import HomePage from '../pages/HomePage';
import ProtectedRoute from './userProtectedRoute';
import PublicRoute from './PublicRoute';


function UserRoutes(){
    return(
        <Routes>
            <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>
            <Route path='/signup' element={<PublicRoute><SignUp /></PublicRoute>}/>
            <Route path='/signin' element={<PublicRoute><Login /></PublicRoute>}/>
        </Routes>
    )
}

export default UserRoutes