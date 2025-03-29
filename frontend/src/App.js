import './App.css';
import {Routes , Route} from 'react-router-dom'
import Login from './Components/Login'
import Employee from './Components/Employee'
import EditApprovedRequest from './Components/EditApprovedRequest';


const App = () => {
  return(
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/employee" element={<Employee/>}/>
      <Route path="/edit-approved-request/:tripId" element={<EditApprovedRequest />} />
    </Routes>
  )
}

export default App;
