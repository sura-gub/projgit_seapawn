import React, { useEffect } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert
import 'sweetalert2/dist/sweetalert2.css'; // Import SweetAlert styles
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './../css/style.css';
import log from './../img/orclogo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Cmpregis() {
  const navigate = useNavigate(); // Create a navigate function for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const response = await fetch('http://localhost:5000/regis', {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.message === 'Registration successful') {
          // Show SweetAlert on successful registration
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your registration was successful!',
          }).then((result) => {
            if (result.isConfirmed) {
              // Check if the server response indicates redirection
              if (responseData.message === 'Redirect to login') {
                // Redirect to login.js page
                navigate('/login');
              } else {
                // Reload the page after the user clicks "OK"
                window.location.reload();
              }
            }
          });
        } else {
          console.error('Registration failed');
        }
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };
  useEffect(() => {
    // Automatically check for existing data in cmpany_details and redirect
    const checkExistingData = async () => {
      try {
        const response = await fetch('http://localhost:5000/check-company');
        const result = await response.json();

        if (result.message === 'Redirect to login') {
          // Redirect to login.js page
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking existing data:', error);
      }
    };

    checkExistingData();

    // Reload the page after checking for existing data
    // window.location.reload();
  }, [navigate]);

    return (
        <div className='coming-page-info-6'>
            <div className='login-container'>
                <div className='text-center'><img src={log} alt='' width={'50%'} style={{marginBottom: '5%',marginTop: '8%'}} /></div>
                <div className='text-center'><label style={{marginBottom: '5%'}} className='fs-5'><b>YOUR COMPANY DETAILS</b></label></div>  
                <form onSubmit={handleSubmit}>
                    <label style={{ marginBottom: '2%' }} className='fs-6'><b>Company Name</b></label>
                    <input type='text' style={{ marginBottom: '4%' }} placeholder='Company Name' name='companyName' />
                    <label style={{ marginBottom: '2%' }} className='fs-6'><b>Company logo</b></label><br />
                    <input type='file' style={{ marginBottom: '4%' }} name='logo' />
                    <label style={{ marginBottom: '2%' }} className='fs-6'><b>Username</b></label>
                    <input type='text' style={{ marginBottom: '4%' }} placeholder='Username' name='username' />
                    <label style={{ marginBottom: '2%' }} className='fs-6'><b>Password</b></label>
                    <input type='password' style={{ marginBottom: '4%' }} placeholder='Password' name='password' />
                    <div className='text-center' style={{ marginBottom: '6%' }}><button className='btn btn-primary'>Sign in</button></div>
                </form>              
            </div>
        </div>
    );
}

export default Cmpregis;
