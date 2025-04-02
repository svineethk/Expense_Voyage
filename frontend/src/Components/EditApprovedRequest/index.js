import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './index.css';

const EditApprovedRequest = () => {
  const { tripId } = useParams();
  const location = useLocation();
  
  const { currentEmployee, selectedTrip } = location.state || {};
  
  const [totalSpent, setTotalSpent] = useState('');
  const [selectedBillType, setSelectedBillType] = useState('');
  const [bills, setBills] = useState([]);
  
  if (!currentEmployee || !selectedTrip) {
    return <p className="error-message">Error: Missing employee or trip data.</p>;
  }

  const handleBillTypeChange = (event) => {
    setSelectedBillType(event.target.value);
  };

  function convertDateFormat(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear(); 
    return `${day}-${month}-${year}`;
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const newBill = {
        type: selectedBillType,
        file: file,
        name: file.name,
        preview: URL.createObjectURL(file),
      };
      setBills((prevBills) => [...prevBills, newBill]);
      console.log(`File uploaded:, ${newBill}`);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();  
    const formData = new FormData();
    formData.append('tripId', tripId);
    formData.append('totalSpent', totalSpent);
  
    bills.forEach((bill, index) => {
      formData.append('bills[]', bill.file);
    });

    for (let [key, value] of formData.entries()) {
      console.log(`the formData of ${key} and the value is ${value}`); // Log each form field
    }
  
    try {
      const response = await fetch('http://localhost:5000/trip/uploadTripDetails', {
        method: 'POST',
        body: formData,
    });
    const result = await response.json();
    alert(result.message);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
    
  };

  

  return (
    <div className="container-approval">
      <div className="form-container">
        <h1 className="header">Edit Approved Trip</h1>
        <p className="trip-id">Editing Trip with ID: {tripId}</p>

        <div className='row-container'>
          <div className="employee-details">
            <p><strong>Name:</strong> {currentEmployee.name}</p>
            <p><strong>Email:</strong> {currentEmployee.email}</p>
            <p><strong>Position:</strong> {currentEmployee.designation}</p>
            <p><strong>Department:</strong> {currentEmployee.department}</p>
          </div>
          <div className="trip-details">
            <h2 className="subheader">Trip Details</h2>
            <form className="trip-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="totalSpent">Total Money Spent</label>
                <input
                  type="number"
                  id="totalSpent"
                  value={totalSpent}
                  onChange={(e) => setTotalSpent(e.target.value)}
                  placeholder="Enter total money spent"
                  required
                />
              </div>

              <div className="upload-section">
                <h3>Select Bill Type and Upload</h3>

                <div className='bill-type-selection'>
                <label htmlFor="billType" className='bill-type'>Select Bill Type:</label>
                <select id="billType" className="select-bill" onChange={handleBillTypeChange} value={selectedBillType}>
                  <option value="">-- Select Bill Type --</option>
                  <option value="travel">Travel</option>
                  <option value="room">Room</option>
                  <option value="food">Food</option>
                  <option value="others">Others</option>
                </select>
                </div>

                {selectedBillType && (
                  <div className="file-upload bill-type-selection">
                    <label htmlFor="fileInput" className='bill-type'>Upload {selectedBillType.charAt(0).toUpperCase() + selectedBillType.slice(1)} Bill</label>
                    <input
                      type="file"
                      id="fileInput"
                      name="bills[]"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className='select-bill'
                    />
                  </div>
                )}

                <div className="uploaded-files">
                  <h4>Uploaded Bills:</h4>
                  {bills.length > 0 && (
                    <div className="file-list">
                      {bills.map((bill, index) => (
                        <div key={index} className="file-item">
                          <div className="file-info">
                            <p><strong>{bill.type.charAt(0).toUpperCase() + bill.type.slice(1)} Bill:</strong> {bill.name}</p>
                            {bill.file.type.startsWith('image') ? (
                              <img src={bill.preview} alt={bill.name} className="image-preview" />
                            ) : (
                              <p className="pdf-preview">PDF File</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="submit-button">Upload and Update Trip Details</button>
            </form>
          </div>
          <div className='employee-details'>
            <p><strong>Client Place:</strong> {selectedTrip.client_place}</p>
            <p><strong>Start Date:</strong> {convertDateFormat(selectedTrip.start_date)}</p>
            <p><strong>End Date:</strong> {convertDateFormat(selectedTrip.end_date)}</p>
            <p><strong>Status:</strong> {selectedTrip.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditApprovedRequest;
