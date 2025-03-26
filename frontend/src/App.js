import './App.css';
import {Routes , Route} from 'react-router-dom'
import Login from './Components/Login'
import Employee from './Components/Employee'


const App = () => {
  return(
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/employee" element={<Employee/>}/>
    </Routes>
  )
}

export default App;
