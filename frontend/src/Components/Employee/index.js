import { Component } from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import './index.css'
import axios from "axios";


class Employee extends Component{
    state={employeeDetails:[],returnToLogin:false,tripDetails:[],isPopupVisible:false,isApprovedTrip:false
        ,clientPlace:'',startDate:'',endDate:''}


    onClickLogout = () => {
        localStorage.removeItem('jwtToken')
        this.setState({returnToLogin:true})
    }


    onClickPopout = () => {
        this.setState({isPopupVisible:true})

    }

    handleClosePopup = () => {
        this.setState({isPopupVisible:false})
    }

    onChangeClientPlace = (event) => {
        this.setState({clientPlace:event.target.value})
    }

    onChangeStartDate = event => {
        this.setState({startDate:event.target.value})
    }

    onChangeEndDate = event => {
        this.setState({endDate:event.target.value})
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
                    this.setState({employeeDetails:result});
                    this.getTripDetails(result.id);
                }
            } catch (error) {
                console.error('Invalid token:', error); 
            }
        }
        
    }


    getTripDetails = async (id) => {
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



    getStatusColor(status) {
        const statusColors = {
            PENDING: 'status-pending',
            COMPLETED: 'status-completed',
            APPROVED: 'status-approved',
            REJECTED: 'status-rejected',
        };
        return statusColors[status] || 'black';
    }


    onSubmitRequestTrip = async (event) => {
        event.preventDefault();
        const {employeeDetails} = this.state;
        const {id} = employeeDetails;
        const {clientPlace,startDate,endDate} = this.state;

        try {
            const response = await axios.post('http://localhost:5000/trip/createTripRequest',{
                employee_id:id,
                client_place:clientPlace,
                start_date:startDate,
                end_date:endDate
            });
            if (response.data.success) {
                alert("Trip request submitted successfully!");
                this.getTripDetails(id);
            } else {
                alert("Failed to submit trip request");
            }
        } catch (error) {
            console.error('Error submitting trip request:', error);
            alert("An error occurred while submitting the trip request Yes.");
        }
    }
    

    render(){
        const {employeeDetails,returnToLogin,tripDetails,isPopupVisible,clientPlace,startDate,endDate} = this.state;
        const jwtToken = localStorage.getItem('jwtToken')
        if(!jwtToken || returnToLogin){
            return <Navigate to="/login"/>
        }
        return(
            <div className="employee-container">
                <nav className="nav-container">
                    <h1 className="employee-header">Welcome {employeeDetails.name}</h1>
                    <button type="button" className="logout-button"
                      onClick={this.onClickLogout}>Logout</button>
                </nav>
                <div className="create-trip">
                    <button type="button" className="request-button"
                      onClick={this.onClickPopout}>Create Trip Request</button>
                    <button type="button" className="request-button"
                      onClick={this.onClickApprovedTrip}>Approved Trip</button>
                </div>

                {isPopupVisible && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                           <button className="close-popup" onClick={this.handleClosePopup}>X</button>
                            <h1>Please Fill the Request Entities</h1>
                            <form className="create-trip-request" onSubmit={this.onSubmitRequestTrip}>
                            <div className="unique-list-request">
                                    <label htmlFor="employeeUserId" className="request-header">Employee ID</label>  
                                    <p type="text" id="employeeUserId" name="clientPlace" className="request-input paragraph">{employeeDetails.id}(Name : {employeeDetails.name})</p>
                                </div>
                                <div className="unique-list-request">
                                    <label htmlFor="clientPlace" className="request-header">Client Place</label>
                                    <input type="text" id="clientPlace" name="clientPlace" className="request-input" 
                                      value={clientPlace} onChange={this.onChangeClientPlace}required/>
                                </div>
                                <div className="unique-list-request">
                                    <label htmlFor="startDate" className="request-header">Start Date</label>
                                    <input type="date" id="startDate" name="startDate" className="request-input"
                                      value={startDate} onChange={this.onChangeStartDate} required/>
                                </div>
                                <div className="unique-list-request">
                                    <label htmlFor="endDate" className="request-header">End Date</label>
                                    <input type="date" id="endDate" name="endDate" className="request-input" 
                                      value={endDate} onChange={this.onChangeEndDate} required/>
                                </div>
                                <button type="submit" className="request-submit-button">Submit</button>
                            </form>
                        </div>
                    </div>
                )}
                <div className="trip-details">
                    <h2 className="trip-header">TRIP SUMMARY</h2>
                    {tripDetails.length > 0 ? (
                        <ul className="trip-container">
                            {tripDetails.map((trip) => (
                                <li key={trip.trip_id} className="trip-item">
                                    <div className="unique-list">
                                    <p className="list-item">Client:</p> <span className="list-value">{trip.client_place}</span>
                                    </div>
                                    <div className="unique-list">
                                        <p className="list-item">Start Date: </p><span className="list-value">{trip.start_date}</span>
                                    </div>
                                    <div className="unique-list">
                                        <p className="list-item">End Date: </p><span className="list-value">{trip.end_date}</span>
                                    </div>
                                    <div className="unique-list">
                                        <p className="list-item">Status:</p><span className={`list-value ${this.getStatusColor(trip.status)}`}>{trip.status}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No trip details available.</p>
                    )}
                  </div>
            </div>
        )
    }

}

export default Employee