import React, { Component } from "react";
import { FaUser, FaLock,FaPhoneAlt,FaAccusoft  } from "react-icons/fa";
import { FcDepartment } from "react-icons/fc";
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import "./index.css";

class Login extends Component {
  state = { name:"",email: "", password: "",PhoneNumber:"", isSignUp: false,showPasswordText:false 
    ,successMessage:'',errorMessage:'',designation:'',deparment:'',redirectToHome:false};

  onLoginFormSubmit = async (event) => {
    const {email,password} = this.state;
    event.preventDefault();
    try{
      const response = await axios.post('http://localhost:5000/employee/login', {
        email,
        password
      })
      const result = await response.data
      if(result.message){
        localStorage.setItem('jwtToken',result.token)
        this.setState({successMessage:result.message,errorMessage:"",email:"",password:"",redirectToHome:true})
      }else{
        this.setState({errorMessage:result.error,email:"",password:"",})
      }
    } catch (error) {
      this.setState({ errorMessage: error.message, successMessage: '',email:"",password:"" });
    }
  };

  onChangeEmail = (event) => {
    this.setState({email:event.target.value})
  }

  onChangePassword = (event) => {
    this.setState({password:event.target.value})
  }

  showPassword = () => {
    this.setState(prevState => ({showPasswordText:!prevState.showPasswordText}))
  }

  onRegisterForm = () => {
    this.setState(prevState => ({isSignUp:!prevState.isSignUp,password:''}))
  }

  onChangeName = (event) => {
    this.setState({name:event.target.value})
  }

  onChangePhonenumber = (event) => {
    this.setState({PhoneNumber:event.target.value})
  }

  onChangeDepartment = event => {
    this.setState({deparment:event.target.value})
  }

  onChangeDesgination = event => {
    this.setState({designation:event.target.value})
  }



  loginContainer = () => {
    const {email,password,showPasswordText} = this.state
    return (
      <form className="form-container" onSubmit={this.onLoginFormSubmit}>
        <h1 className="login-header">Login</h1>
        <div className="input-container">
          <FaUser className="icon" />
          <input type="text" placeholder="Email" 
            className="input-field" value={email}
            onChange={this.onChangeEmail} />
        </div>
        <div className="input-container">
          <FaLock className="icon" />
          <input type= {showPasswordText ? "text" : "password"}
            placeholder="Password" className="input-field" 
            value={password}  onChange={this.onChangePassword}/>
        </div>
        <div className="options-container">
            <input type="checkbox"  onChange={this.showPassword}/>
            <p className="password">Show Password</p>
        </div>
        <button type="submit" className="login-btn">Login</button>
        <p className="register-text">
          No Account Yet? <button type="button" onClick={this.onRegisterForm}>Register</button>
        </p>
      </form>
    );
  };


  signupContainer = () => {
    const {name,email,PhoneNumber,designation,deparment}= this.state

    return(
      <form className="form-container" onSubmit={this.onSignupSubmit}>
        <h1 className="login-header">Sign Up</h1>
        <div className="input-container">
          <FaUser className="icon" />
          <input type="text" placeholder="Name" 
            className="input-field" value={name}
            onChange={this.onChangeName} />
        </div>
        <div className="input-container">
          <FaUser className="icon" />
          <input type="text" placeholder="Email" 
            className="input-field" value={email}
            onChange={this.onChangeEmail} />
        </div>
        <div className="input-container">
          <FaPhoneAlt  className="icon" />
          <input type="number" placeholder="Phone Number" 
            className="input-field" value={PhoneNumber}
            onChange={this.onChangePhonenumber} />
        </div>
        <div className="input-container">
          <FaAccusoft className="icon" />
          <input type="text" placeholder="Designation" 
            className="input-field" value={designation}
            onChange={this.onChangeDesgination} />
        </div>
        <div className="input-container">
          <FcDepartment  className="icon" />
          <input type="text" placeholder="Department" 
            className="input-field" value={deparment}
            onChange={this.onChangeDepartment} />
        </div>  
        <button type="submit" className="login-btn">Sign Up</button>
        <p className="register-text">
          Already Register? <button type="button" onClick={this.onRegisterForm}>Login</button>
        </p>
      </form>
    )

  }

  render() {
    const{isSignUp,successMessage,redirectToHome}= this.state


    const jwtToken =localStorage.getItem('jwtToken');
    if (jwtToken || redirectToHome === true) {
      return <Navigate to="/employee"/>
    }

    return (
      <div className="app-container">
        <div className="login-container">
          <div className="login-form">{isSignUp ? this.signupContainer() : this.loginContainer()}</div>
          <div className="image-container">
            <img src="/Captureimg.png" alt="Illustration" className="illustration" />
          </div>
          <p>{successMessage}</p>
        </div>
      </div>
    );
  }
}

export default Login;
