import {Route, Routes} from 'react-router-dom';
import Home from '../components/user/Home';


function UserRoutes(){
    return(
        <Routes>
            <Route path='/' element={<Home />}/>
        </Routes>
    )
}

export default UserRoutes