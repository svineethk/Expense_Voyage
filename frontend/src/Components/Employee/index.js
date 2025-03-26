import { Component } from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import './index.css'
import axios from "axios";


class Employee extends Component{
    state={employeeDetails:[],returnToLogin:false,tripDetails:[]}


    onClickLogout = () => {
        localStorage.removeItem('jwtToken')
        this.setState({returnToLogin:true})
    }



    async componentDidMount(){
        const jwtToken = localStorage.getItem('jwtToken');
        if(jwtToken){
            const decode = jwtDecode(jwtToken)
            const email = decode.email;
            try {
                const response = await axios.post('http://localhost:5000/employee/employeeByEmail',{
                    email
                })
                const result = await response.data
                if(response){
                    this.setState({employeeDetails:result})
                }
            } catch (error) {
                console.error('Invalid token:', error); 
            }
        }
        {this.getTripDetails()}
    }


    getTripDetails = async () => {
        const {employeeDetails} = this.state
        const {id} = employeeDetails

        if(id){
            try{
                const response = await axios.get(`http://localhost:5000/trip/getTripByEmployee/${id}`)
                const result = await response.data
                if(response){
                    this.setState({tripDetails:result})
                }
            }catch (error) {
                console.error('Error fetching trip details:', error);
            }
        }
    }




    

    render(){
        const {employeeDetails,returnToLogin} = this.state;
        const jwtToken = localStorage.getItem('jwtToken')
        if(!jwtToken || returnToLogin){
            return <Navigate to="/login"/>
        }
        return(
            <div className="employee-container">
                <nav className="nav-container">
                    <h1>Welcome {employeeDetails.name}</h1>
                    <button type="button" className="logout-button"
                      onClick={this.onClickLogout}>Logout</button>
                </nav>
                <div className="create-trip">
                    <button type="button" className="request-button">Create Trip Request</button>
                </div>
                <div className="trip-details">
                    <div className="trip-container">
                        
                    </div>
                </div>
            </div>
        )
    }

}

export default Employee