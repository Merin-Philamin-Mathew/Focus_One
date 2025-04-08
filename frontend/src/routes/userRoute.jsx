import {Route, Routes} from 'react-router-dom';
import Home from '../components/user/Home';
import Login from '../components/user/Login';
import SignUp from '../components/user/SignUp';
import HomePage from '../pages/HomePage';


function UserRoutes(){
    return(
        <Routes>
            <Route path='/' element={<HomePage />}/>
            <Route path='/signup' element={<SignUp />}/>
            <Route path='/signin' element={<Login />}/>
        </Routes>
    )
}

export default UserRoutes