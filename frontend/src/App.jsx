import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserRoutes from './routes/userRoute'
import Sample from './components/sample/sample'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/*' element={<UserRoutes />}/>
          <Route path='sample/' element={<Sample />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
