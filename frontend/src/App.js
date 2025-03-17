import './App.css';
import {Routes , Route} from 'react-router-dom'
import Login from './Components/Login'


const App = () => {
  return(
    <Routes>
      <Route path="/" element={<Login/>}/>
    </Routes>
  )
}

export default App;
