import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [responseData1, setResponseData1] = useState('');
  const [responseData2, setResponseData2] = useState('');
  const [responseData3, setResponseData3] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('None');

  const handleFileChange1 = (e) => {
    setSelectedFile1(e.target.files[0]);
  };

  const handleFileChange2 = (e) => {
    setSelectedFile2(e.target.files[0]);
  };

  const handleUpload1 = async () => {
    if (selectedFile1) {
      const formData = new FormData();
      formData.append('image', selectedFile1);

        try
        {
          const response = await axios.post('http://localhost:5000/upload1', formData)
          const data = response.data
          setResponseData1(data)
          console.log(data)
        }
        catch(error)
        {
          console.log(error)
        }
    }
  };

  const handleUpload2 = async () => {
    if (selectedFile2) {
      const formData = new FormData();
      formData.append('image', selectedFile2);

        try
        {
          const response = await axios.post('http://localhost:5000/upload2', formData)
          const data = response.data
          setResponseData2(data)
          console.log(data)
        }
        catch(error)
        {
          console.log(error)
        }
    }
  };

  const districts = [
    'None', 'NICOBAR', 'DIMAPUR', 'DARJEELING', 'KOLKATA', 'PURI',
    'PATNA', 'KOTA', 'NARMADA', 'PUNE', 'VARANASI', 'AGRA', 'NEW DELHI',
    'AMRITSAR', 'CHENNAI', 'MALDA', 'GWALIOR', 'NASIK', 'PALAKKAD', 'NORTH & MIDDLE ANDAMAN'
  ];
  

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Redirect to a specific function or perform an action based on selectedDistrict
    if (selectedDistrict !== 'None') {
      // Replace the following line with the desired action or redirection
      try {
        const response = await axios.post('http://localhost:5000/upload3', {
          district_name: selectedDistrict,
        });
        const data = response.data
        console.log('Server response:', response.data);
        setResponseData3(data)
      } catch (error) {
        console.error('Error:', error);
      }
      console.log(`Redirecting to function for district: ${selectedDistrict}`);
    }
  };

  return (
    <div>
      <h1>Satellite Image Uploader</h1>
      <input type="file" accept="image/*" onChange={handleFileChange1} />
      <button onClick={handleUpload1}>Upload</button>
      <p id='ans1'>{responseData1}</p>
      <h1>Cloud Image Uploader</h1>
      <input type="file" accept="image/*" onChange={handleFileChange2} />
      <button onClick={handleUpload2}>Upload</button>
      <p id='ans2'>{responseData2}</p>
      <h2>Select a District:</h2>
      <form onSubmit={handleSubmit}>
        <select value={selectedDistrict} onChange={handleDistrictChange}>
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </form>
      <p>You selected: {selectedDistrict}</p>
      <p>{responseData3}</p>
    </div>
  );
}

export default App;
