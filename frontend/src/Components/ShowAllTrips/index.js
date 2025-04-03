import { Component } from "react";
import { FaEdit } from "react-icons/fa";
import './index.css'
import { Navigate } from "react-router-dom";

class ShowAllTrips extends Component {
  state = { allTrips: [], returnToAdmin: false, isModifyTrip: false, respectiveTrip: {}
            ,respectiveEmployee:{} }

  fetchAllTrips = async () => {
    try {
      const response = await fetch('http://localhost:5000/trip/allTrips');
      const result = await response.json();
      this.setState({ allTrips: result });
    } catch (error) {
      console.error(error);
      console.log('Error from fetching trip Details from server');
    }
  }

  componentDidMount() {
    this.fetchAllTrips();
  }

  convertDateFormat(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  closeAllTrips = () => {
    this.setState({ returnToAdmin: true });
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

  onClickModifyTrip = (id) => {
    const { allTrips } = this.state;
    const respectiveTrip = allTrips.filter(eachTrip => eachTrip.trip_id === id);

    this.setState({ isModifyTrip: true, respectiveTrip: respectiveTrip[0] });
  }

  handleClosePopup = () => {
    this.setState({ isModifyTrip: false });
  };

  handleStatusChange = (event) => {
    const { respectiveTrip } = this.state;
    this.setState({
      respectiveTrip: { ...respectiveTrip, status: event.target.value }
    });
  };

  render() {
    const { allTrips, returnToAdmin, isModifyTrip, respectiveTrip } = this.state;
    const filteredAllTrips = this.getFilteredTrips(allTrips);
    const { client_place, start_date, end_date, status,employee_id,initial_amount,total_expense,balance_settlement } = respectiveTrip;

    if (returnToAdmin) {
      return <Navigate to="/admin" />;
    }

    return (
      isModifyTrip ? (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={this.handleClosePopup}>X</button>
            <h1 className="popup-header">Modify Trip Status</h1>
            <form className="create-trip-request">
              <div className="unique-list-request">
                <label htmlFor="employeeUserId" className="request-header">Employee ID</label>
                <p type="text" id="employeeUserId" className="request-input paragraph">
                  Vineeth
                </p>
              </div>
              <div className="unique-list-request">
                <label htmlFor="clientPlace" className="request-header">Client Place</label>
                <p className="request-input paragraph">{client_place}</p>
              </div>
              <div className="unique-list-request">
                <label htmlFor="startDate" className="request-header">Start Date</label>
                <p className="request-input paragraph">{this.convertDateFormat(start_date)}</p>
              </div>
              <div className="unique-list-request">
                <label htmlFor="endDate" className="request-header">End Date</label>
                <p className="request-input paragraph">{this.convertDateFormat(end_date)}</p>
              </div>
              <div className="unique-list-request">
                <label htmlFor="status" className="request-header">Status</label>
                <select
                  id="status"
                  className="request-input"
                  value={status}
                  onChange={this.handleStatusChange}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <button type="submit" className="request-submit-button">Submit</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="approved-trips-container">
          <div className="trip-header-container">
            <h2 className="trip-header">Approved Trips</h2>
            <button type="button" className="close-button" onClick={this.closeAllTrips}>Close</button>
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
                      <button className="delete-button" onClick={() => this.onClickModifyTrip(trip.trip_id)}><FaEdit /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    );
  }
}

export default ShowAllTrips;
