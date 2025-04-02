import { Component } from "react";
import axios from 'axios'
import "./adminIndex.css";


class Admin extends Component {
    state = {dashboardData:[],monthlyTripData:[],tripStatusData:[],employeeTripData:[],tripRequestData:[],isLoading:false
    ,error:''}


    fetchData = async () => {
        this.setState({isLoading:true})
        try{
            const dashboardResponse = await axios.get('http://localhost:5000/api/dashboard');
            const monthlyTripResponse = await axios.get('http://localhost:5000/api/monthly-trips');
            const tripStatusResponse = await axios.get('http://localhost:5000/api/trip-status');
            const employeeTripResponse = await axios.get('http://localhost:5000/api/employee-trips');
            const tripRequestResponse = await axios.get('http://localhost:5000/api/trip-requests');

            this.setState({dashboardData:dashboardResponse.data.dashboard
                          ,monthlyTripData:monthlyTripResponse.data.monthlyTrips
                          ,tripStatusData:tripStatusResponse.data.tripStatus
                          ,employeeTripData:employeeTripResponse.data.employeeTrips
                          ,tripRequestData:tripRequestResponse.data.tripRequests
            })
            
        } catch (error) {
            this.setState({error:error || 'An error occurred while fetching data.'})
        } finally {
            this.setState({isLoading:false})
        }
    }

    getOverviewData = () => {
        const {dashboardData} = this.state;
        const {totalTrips,approvedTrips,pendingTrips,totalInitialAmount,totalPendingReimbursements} = dashboardData

        return(
            <>
                <div className="overviewData-container">
                    <h1 className="data">Total Trips</h1>
                    <h1 className="data">{totalTrips}</h1>
                </div>
                <div className="overviewData-container">
                    <h1 className="data">Pending Trips</h1>
                    <h1 className="data">{pendingTrips}</h1>
                </div>
                <div className="overviewData-container">
                    <h1 className="data">Approved Trips</h1>
                    <h1 className="data">{approvedTrips}</h1>
                </div>
                <div className="overviewData-container">
                    <h1 className="data">Total Initial Amount</h1>
                    <h1 className="data data-dark">{totalInitialAmount}</h1>
                </div>
                <div className="overviewData-container">
                    <h1 className="data">Total Pending Reimbursements</h1>
                    <h1 className="data data-dark">{totalPendingReimbursements}</h1>
                </div>
            </>
            
        )
    }


    getLinearBarChart = () => {
        return(
            <h1>Vineeth</h1>
        )
    }

    
    



    componentDidMount(){
        this.fetchData();
    }





    render(){



        return(
            <div className="employee-container">
                <nav className="nav-container">
                    <h1 className="employee-header">Welcome Boss</h1>
                    <button type="button" className="logout-button" onClick={this.onClickLogout}>Logout</button>
                </nav>
                <div className="admin-header">
                    <h1 className="header-admin">Admin Dashboard</h1>
                    <div className="create-trip">
                        <button type="button" className="request-button" onClick={this.onClickPopout}>Show All Trips</button>
                    </div>
                </div>
                <div className="dashboard-container">
                    <div className="graph1-container">
                        <div className="overview-container">
                            <h1 className="overview-header data-dark"> Dashboard Overview</h1>
                            {this.getOverviewData()}
                        </div>
                        <div className="graph-container">
                            <h1 className="overview-header data-dark">Monthly Trip Statistics</h1>
                            <div className="row-container">
                                {this.getLinearBarChart()}
                            </div>
                        </div>
                    </div>
                    <div className="graph2-container">
                        <h1>Hello 2</h1>
                    </div>
                </div>
            </div>
        )
    }
}
export default Admin