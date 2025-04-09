import './App.css';
import {Routes , Route, useNavigate} from 'react-router-dom'
import Login from './Components/Login'
import Employee from './Components/Employee'
import EditApprovedRequest from './Components/EditApprovedRequest';
import Admin from './Components/Admin'
import ShowAllTrips from './Components/ShowAllTrips'
import {jwtDecode} from "jwt-decode";
import { useEffect } from 'react';


const App = () => {
  const navigate = useNavigate();

  

  const jwtToken = localStorage.getItem('jwtToken');
  useEffect(() => {
    if (jwtToken) {
      const decode = jwtDecode(jwtToken);
      const email = decode.email;

      if (email === 'admin@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line
  }, []);



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
