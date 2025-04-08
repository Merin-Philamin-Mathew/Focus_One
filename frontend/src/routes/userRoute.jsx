import {Route, Routes} from 'react-router-dom';
import Home from '../components/user/Home';
import SignUp from '../components/user/Signup/SignUp';
import Login from '../components/user/Login';


function UserRoutes(){
    return(
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/signup' element={<SignUp />}/>
            <Route path='/signin' element={<Login />}/>
        </Routes>
    )
}

export default UserRoutes