import { Component } from "react";
import { FaEdit } from "react-icons/fa";
import './index.css'
import { Navigate } from "react-router-dom";

class ShowAllTrips extends Component{
    state = {allTrips:[],returnToAdmin:false}

    fetchAllTrips = async () => {
        try{
            const response = await fetch('http://localhost:5000/trip/allTrips')
            const result = await response.json()
            this.setState({allTrips:result})
        }catch(error){
            console.error(error)
            console.log('Error from fetching trip Details from server');
        }
    }


    componentDidMount(){
        this.fetchAllTrips()
    }

    convertDateFormat(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');  
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear(); 
        return `${day}-${month}-${year}`;
    }

    closeAllTrips = () => {
        this.setState({returnToAdmin:true})
    }

    getFilteredTrips = (allTrips) => {
        const filteredAllTrips = allTrips.map(eachTrip => {
            if (eachTrip.status === "PENDING") {
                return {
                    ...eachTrip,
                    initial_amount: "Waiting for Approval",
                    total_expense: "Waiting for Approval",
                    balance_settlement: "Waiting for Approval"
                };
            }
    
        
            if (eachTrip.status === "APPROVED" && 
                (!eachTrip.initial_amount || !eachTrip.total_expense || !eachTrip.balance_settlement)) {
                return {
                    ...eachTrip,
                    initial_amount: "Complete the Trip",
                    total_expense: "Complete the Trip",
                    balance_settlement: "Complete the Trip"
                };
            }
            if (eachTrip.status === "COMPLETED" || eachTrip.status === "REJECTED") {
                return {
                    ...eachTrip,
                    initial_amount: "COMPLETED",
                    total_expense: "COMPLETED",
                    balance_settlement: "COMPLETED"
                };
            }
    
            return eachTrip;
        });

        return filteredAllTrips;
    }
    
    





    render(){
        const {allTrips,returnToAdmin} = this.state
        const filteredAllTrips = this.getFilteredTrips(allTrips);
        console.log(filteredAllTrips)

        if(returnToAdmin){
            return <Navigate to="/admin"/>
        }

        return(
            <div className="approved-trips-container">
                                <div className="trip-header-container">
                                    <h2 className="trip-header">Approved Trips</h2>
                                    <button type="button" className="close-button"
                                     onClick={this.closeAllTrips}>Close</button>
                                </div>
                                <div className="trip-table-container">
                                <table className="trip-table">
                                    <thead>
                                    <tr>
                                        <th>Trip ID</th>
                                        <th>Employee ID</th>
                                        <th>Client Place</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Initial Amount (₹)</th>
                                        <th>Total Expense (₹)</th>
                                        <th>Balance to Settlement (₹)</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredAllTrips.map((trip) => (
                                        <tr key={trip.trip_id}>
                                        <td>{trip.trip_id}</td>
                                        <td>{trip.employee_id}</td>
                                        <td>{trip.client_place}</td>
                                        <td>{this.convertDateFormat(trip.start_date)}</td>
                                        <td>{this.convertDateFormat(trip.end_date)}</td>
                                        <td>{isNaN(parseInt(trip.initial_amount)) ? trip.initial_amount : `₹${parseInt(trip.initial_amount).toLocaleString()}`}</td>
                                        <td>{isNaN(parseInt(trip.total_expense)) ? trip.total_expense : `₹${parseInt(trip.total_expense).toLocaleString()}`}</td>
                                        <td>{isNaN(parseInt(trip.balance_settlement)) ? trip.balance_settlement : `₹${parseInt(trip.balance_settlement).toLocaleString()}`}</td>
                                        <td>{trip.status}</td>
                                        <td>
                                            <button className="delete-button" onClick={() => this.onClickEditApprovedRequest(trip.trip_id)}><FaEdit /></button>
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                </div>
            </div>
        )
    }

}

export default ShowAllTrips