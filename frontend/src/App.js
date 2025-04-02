import './App.css';
import {Routes , Route} from 'react-router-dom'
import Login from './Components/Login'
import Employee from './Components/Employee'
import EditApprovedRequest from './Components/EditApprovedRequest';
import Admin from './Components/Admin'
import ShowAllTrips from './Components/ShowAllTrips'


const App = () => {
  return(
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/employee" element={<Employee/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/edit-approved-request/:tripId" element={<EditApprovedRequest />} />
      <Route path="/showAllTrips" element={<ShowAllTrips/>}/>
    </Routes>
  )
}

export default App;
