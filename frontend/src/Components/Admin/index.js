import { Component } from "react";
import axios from 'axios'
import "./adminIndex.css";
import { Navigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
  } from "recharts"

class Admin extends Component {
    state = {dashboardData:[],monthlyTripData:[],tripStatusData:[],employeeTripData:[],tripRequestData:[],isLoading:false
    ,error:'',returnToLogin:false,showAllTrips:false}


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

    onClickLogout = () => {
        localStorage.removeItem('jwtToken');
        this.setState({ returnToLogin: true });
      };

      onClickShowAllTrips = () => {
        this.setState({showAllTrips:true})
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
        const {monthlyTripData} = this.state;
        return(
            <div className="linear-chart">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={monthlyTripData}
                        margin={{
                        top: 5,
                        }}
                    >
                        <XAxis
                        dataKey="month"
                        tick={{
                            stroke: "gray",
                            strokeWidth: 1,
                        }}
                        />
                        <YAxis
                        tick={{
                            stroke: "gray",
                            strokeWidth: 0,
                        }}
                        />
                        <Legend
                        wrapperStyle={{
                            padding: 30,
                        }}
                        />
                        <Bar dataKey="tripCount" name="tripCount" fill="#1f77b4" barSize="20%" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }

    getPieChart = () => {
        const {tripStatusData} = this.state

        return(
            <div className="pie-chart">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                        cx="70%"
                        cy="40%"
                        data={tripStatusData}
                        startAngle={0}
                        endAngle={360}
                        innerRadius="40%"
                        outerRadius="70%"
                        dataKey="count"
                        >
                        <Cell name="APPROVED" fill="#fecba6" />
                        <Cell name="PENDING" fill="#b3d23f" />
                        <Cell name="REJECTED" fill="#a44c9e" />
                        <Cell name="COMPLETED" fill="#000000"/>
                        </Pie>
                        <Legend
                        iconType="circle"
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )
    }

    getFilteredData = employeeTripData => {
        const getUpdatedTripData = employeeTripData.filter(eachData => eachData.name !== "Admin")
        return getUpdatedTripData
    }


    getEmployeeTripDetails = () => {
        const {employeeTripData} = this.state
        const getUpdatedTripData = this.getFilteredData(employeeTripData)

        return (
            <table className="employee-trip-table">
            <thead>
                <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Trips Taken</th>
                <th>Total Amount Reimbursed</th>
                </tr>
            </thead>
            <tbody>
                {getUpdatedTripData.map((eachEmployee) => (
                <tr key={eachEmployee.employeeId}>
                    <td>{eachEmployee.employeeId}</td>
                    <td>{eachEmployee.name}</td>
                    <td>{eachEmployee.tripsTaken}</td>
                    <td>{eachEmployee.totalAmountReimbursed}</td>
                </tr>
                ))}
            </tbody>
            </table>
        );
    }

    componentDidMount(){
        this.fetchData();
    }

    render(){
        const {returnToLogin,showAllTrips} = this.state

        const jwtToken = localStorage.getItem('jwtToken');
    
        if (!jwtToken || returnToLogin) {
        return <Navigate to="/login" />;
        }
        else if(showAllTrips){
            return <Navigate to="/showAllTrips"/>
        }
        return(
            <div className="employee-container">
                <nav className="nav-container">
                    <h1 className="employee-header">Welcome Boss</h1>
                    <button type="button" className="logout-button" onClick={this.onClickLogout}>Logout</button>
                </nav>
                <div className="admin-header">
                    <h1 className="header-admin">Admin Dashboard</h1>
                    <div className="create-trip">
                        <button type="button" className="request-button" onClick={this.onClickShowAllTrips}>Show All Trips</button>
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
                                {this.getPieChart()}
                            </div>
                        </div>
                    </div>
                    <div className="graph2-container">
                        <div className="employee-chart-container">
                            <h1 className="data data-dark">Employee-wise Trip Details</h1>
                            {this.getEmployeeTripDetails()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Admin