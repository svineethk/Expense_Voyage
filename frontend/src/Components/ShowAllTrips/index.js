import { Component } from "react";
import { FaEdit } from "react-icons/fa";
import axios from 'axios'
import './index.css'
import { Navigate } from "react-router-dom";

class ShowAllTrips extends Component {
  state = { allTrips: [], returnToAdmin: false, isModifyTrip: false, respectiveTrip: {}
            ,respectiveEmployee:{},tripImages:[],currentImageIndex: 0,chatInput: '',
            filteredTrips: [],aiSearch:false }

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

  onClickModifyTrip = async (id) => {
    const { allTrips } = this.state;
    const respectiveTrip = allTrips.filter(eachTrip => eachTrip.trip_id === id);

    try{
      const response = await axios.get(`http://localhost:5000/trip/getTripImages/${id}`);
      const result = await response.data;
      console.log(result);
      this.setState({tripImages:result});
    }catch(error){
      console.error(error);
    }

    this.setState({ isModifyTrip: true, respectiveTrip: respectiveTrip[0] });
  }

  handleClosePopup = () => {
    this.setState({ isModifyTrip: false });
  };

  statusChanged = (event) => {
    const {allTrips, respectiveTrip } = this.state;
    const updatedStatus= event.target.value

    const updatedRespectiveTrip = {...respectiveTrip,status:updatedStatus}
    const updatedAllTrips = allTrips.map((trip) => trip.trip_id === respectiveTrip.trip_id ? updatedRespectiveTrip : trip);

    this.setState({
      respectiveTrip:updatedRespectiveTrip,allTrips:updatedAllTrips
    });
  }

  handleStatusChange = async (event) => {
    const {respectiveTrip} = this.state
    const {status} = respectiveTrip;
  
    try{
      const response = await axios.post(`http://localhost:5000/trip/updateStatusByTripId/${respectiveTrip.trip_id}`,{
        status
      })
      const result = await response.data;
      alert(result);
      this.setState({isModifyTrip:false},this.fetchAllTrips)
    }catch(error){
      console.error(error)
      console.log(`Error Throws while Updating the status ${error}`)
    }
  };

  goToPreviousImage = () => {
    this.setState(prevState => ({
      currentImageIndex: prevState.currentImageIndex === 0 
        ? prevState.tripImages.length - 1 
        : prevState.currentImageIndex - 1
    }));
  };
  
  goToNextImage = () => {
    this.setState(prevState => ({
      currentImageIndex: (prevState.currentImageIndex + 1) % prevState.tripImages.length
    }));
  };

  handleChatSubmit = async (event) => {
    event.preventDefault();
    const { chatInput, allTrips } = this.state;
    if (!chatInput.trim()) return;

    this.setState({
        chatInput: ''
    });

    try {
        const aiResponse = await this.processChatInput(chatInput, allTrips);

        this.setState({
            filteredTrips: this.getFilteredTrips(aiResponse.results)
        });
    } catch (error) {
        console.error('AI Processing Error:', error);
    }
}

  handleChatInputChange = (event) => {
    this.setState({chatInput:event.target.value})
  }

  async processChatInput(input, allTrips) {
    let results = [...allTrips];
    let message = "Here are the results:"; 

  
    if (input.includes('employeeId')) {
        const employeeIdMatch = input.match(/employeeId\s+(\d+)/); 
        if (employeeIdMatch) {
            const employeeId = parseInt(employeeIdMatch[1]); 
            results = results.filter(trip => trip.employee_id === employeeId); 
            if (results.length === 0) {
              message = `No trips found for Employee ID: ${employeeId}`;
            } else {
              message = `Trips for Employee ID: ${employeeId}`;
            }
        } else {
          message = "Invalid employeeId format. Please specify a number after employeeId.";
        }
    }

    
    if (input.includes('client_place')) {
        const client_placeMatch = input.match(/client_place\s+([\w\s]+)/i); 
        if (client_placeMatch) {
            const clientPlace = client_placeMatch[1].toLowerCase(); 
            results = results.filter(trip => trip.client_place.toLowerCase().includes(clientPlace));
             if (results.length === 0) {
              message = `No trips found for Client Place containing: ${clientPlace}`;
            } else {
              message = `Trips for Client Place containing: ${clientPlace}`;
            }
        } else {
          message = "Invalid client_place format. Please specify the place name after client_place.";
        }
    }

    
    if (input.includes('status')) {
        const statusMatch = input.match(/status\s+([\w]+)/i); 
        if (statusMatch) {
            const status = statusMatch[1].toUpperCase();
            results = results.filter(trip => trip.status === status);
             if (results.length === 0) {
              message = `No trips found with status: ${status}`;
            } else {
              message = `Trips with status: ${status}`;
            }
        } else {
          message = "Invalid status format. Please specify the status name after status.";
        }
    }

    
    if (input.includes('start_date')) {
        const startDateMatch = input.match(/start_date\s+([\d-]+)/);
        if (startDateMatch) {
            const startDate = startDateMatch[1]; 
            results = results.filter(trip => trip.start_date === startDate); 
            if (results.length === 0) {
              message = `No trips found with start date: ${startDate}`;
            } else {
              message = `Trips with start date: ${startDate}`;
            }
        } else {
          message = "Invalid start_date format. Please specify the date in YYYY-MM-DD format after start_date.";
        }
    }

    
    if (input.includes('tripId')) {
      const tripIdMatch = input.match(/tripId\s+(\d+)/);
      if(tripIdMatch){
        const tripId = parseInt(tripIdMatch[1]);
        results = results.filter(trip => trip.trip_id === tripId);
        if(results.length === 0){
          message = `No trips found with tripId: ${tripId}`;
        } else {
          message = `Trips with tripId: ${tripId}`;
        }
      } else {
        message = "Invalid tripId format. Please specify the tripId after tripId."
      }
    }

    
    if (input.includes('end_date')) {
      const endDateMatch = input.match(/end_date\s+([\d-]+)/);
      if(endDateMatch){
        const endDate = endDateMatch[1];
        results = results.filter(trip => trip.end_date === endDate);
        if(results.length === 0){
          message = `No trips found with end date: ${endDate}`;
        } else {
          message = `Trips with end date: ${endDate}`;
        }
      } else {
        message = "Invalid end_date format. Please specify the date in YYYY-MM-DD format after end_date."
      }
    }

    if (results.length === 0 && message === "Here are the results:") {
        message = "No matching results found.";
    }

    return { results, message };
}

onChangeAi = (event) => {
  if(event.target.checked){
    this.setState({aiSearch:true})
  }
  else{
    this.setState({aiSearch:false})
  }
}

onCloseAisearch = () => {
  this.setState({aiSearch:false})
}

  render() {
    const { allTrips, returnToAdmin, isModifyTrip, respectiveTrip,tripImages,currentImageIndex,chatInput,
      filteredTrips,aiSearch } = this.state;
    const filteredAllTrips = this.getFilteredTrips(allTrips);
    const { trip_id,client_place, start_date, end_date, status,employee_id,initial_amount,total_expense,balance_settlement } = respectiveTrip;
    const modifiedAllTrips = filteredTrips.length === 0 ? filteredAllTrips : filteredTrips;

    if (returnToAdmin) {
      return <Navigate to="/admin" />;
    }

    return (
      isModifyTrip ? (
        <div className="popup-overlay-trip">
          <div className="popup-content-trip">
            <button className="close-popup" onClick={this.handleClosePopup}>X</button>
            <h1 className="popup-modify-header">Modify Trip Status</h1>
            <div className="popup-row-container">
            <form className="create-trip-request-form">
              <div className="unique-list-request">
                <label htmlFor="employeeUserId" className="request-header">Employee ID</label>
                <p type="text" id="employeeUserId" className="request-input paragraph">
                  {employee_id}
                </p>
              </div>
              <div className="unique-list-request">
                <label htmlFor="clientPlace" className="request-header">TRIP ID</label>
                <p className="request-input paragraph">{trip_id}</p>
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
                <label htmlFor="clientPlace" className="request-header">Initial Amount</label>
                <p className="request-input paragraph">{initial_amount}</p>
              </div>
              <div className="unique-list-request">
                <label htmlFor="clientPlace" className="request-header">Total Expense Amount</label>
                <p className="request-input paragraph">{total_expense}</p>
              </div>
              <div className="unique-list-request">
                <label htmlFor="clientPlace" className="request-header">Balance Settlement</label>
                <p className="request-input paragraph">{balance_settlement}</p>
              </div>
              <div className="unique-list-request">
                <label htmlFor="status" className="request-header">Status</label>
                <select
                  id="status"
                  className="request-input"
                  value={status}
                  onChange={this.statusChanged}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <button type="submit" className="request-submit-button-trip" onClick={this.handleStatusChange}>Submit</button>
            </form>
            <div className="trip-image-container">
              <h1 className="trip-image-header">Trip Images</h1>
              {Array.isArray(tripImages) && tripImages.length > 0 && (
                <>
                  <div className="image-slider">
                  <img
                    src={`http://localhost:5000${tripImages[currentImageIndex]}`}
                    alt={`Trip Not Available ${currentImageIndex + 1}`}
                    className="trip-image"
                  />
                </div>
                <div className="image-indicator">
                  <button onClick={this.goToPreviousImage} className="nav-button">◀️</button>
                  <button onClick={this.goToNextImage} className="nav-button">▶️</button>
                </div>

                </>
              )}
            </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="approved-trips-container">
          <div className="trip-header-container">
            <h2 className="trip-header">Approved Trips</h2>
           <div className="chat-row-container">
            {aiSearch ? (<div className="chat-container">
              <form className="chat-input-form" onSubmit={this.handleChatSubmit}>
                <input
                   type="text"
                   value={chatInput}
                   onChange={this.handleChatInputChange}
                   placeholder="Type your message..."
                   className="chat-input"
                />
                <button type="submit" className="chat-submit-button">AI Search</button>
                <button type="button" onClick={this.onCloseAisearch} className="clost_aisearch">X</button>
              </form>
            </div>) : (<div className="ai-button-container">
              <label htmlFor="ai-button">AI Search</label>
              <input type="checkbox" id="ai-button" onChange={this.onChangeAi}/>
            </div>)}
            <button type="button" className="close-button" onClick={this.closeAllTrips}>Close</button>
           </div>
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
                {modifiedAllTrips.map((trip) => (
                  <tr className="trip-table-row" key={trip.trip_id}>
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
