import { Component } from "react";
import { FaEdit } from "react-icons/fa";

class ShowAllTrips extends Component{
    state = {allTrips:[]}

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




    render(){
        const {allTrips} = this.state
        return(
            <div className="approved-trips-container">
                                <h2 className="trip-header">Approved Trips</h2>
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
                                    {allTrips.map((trip) => (
                                        <tr key={trip.trip_id}>
                                        <td>{trip.trip_id}</td>
                                        <td>{trip.employee_id}</td>
                                        <td>{trip.client_place}</td>
                                        <td>{this.convertDateFormat(trip.start_date)}</td>
                                        <td>{this.convertDateFormat(trip.end_date)}</td>
                                        <td>₹{trip.initial_amount}</td>
                                        <td>₹{trip.total_expense}</td>
                                        <td>₹{trip.balance_settlement}</td>
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