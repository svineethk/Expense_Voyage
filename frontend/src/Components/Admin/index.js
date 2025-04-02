import { Component } from "react";
import "./adminIndex.css";


class Admin extends Component {
    state = {allTrips: []}



    async componentDidMount(){
        try{
            const token = localStorage.getItem('token')
            if(token === undefined){
                this.props.history.replace('/login')    
            }
            else{
                const response = await fetch('http://localhost:5000/trip/allTrips')
                const result = await response.json()
                this.setState({allTrips: result})
            }
        }catch(error){
            console.log(error.message)
        }    
    }





    render(){
        const {allTrips} = this.state;



        return(
            <div className="employee-container">
                <nav className="nav-container">
                    <h1 className="employee-header">Welcome Boss</h1>
                    <button type="button" className="logout-button" onClick={this.onClickLogout}>Logout</button>
                </nav>
                <div className="create-trip">
                    <button type="button" className="request-button" onClick={this.onClickPopout}>Show All Trips</button>
                    <button type="button" className="request-button" onClick={this.onClickApprovedTrip}>Show Pending Trips</button>
                </div>
            </div>
        )
    }
}
export default Admin;