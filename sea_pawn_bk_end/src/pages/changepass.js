import React, { useEffect,useState } from 'react';
import Header from './header';
import Header1 from './header1';
import Footer from './footer';
import { FaWarehouse } from "react-icons/fa";
import swal from 'sweetalert2';

function Changepass() {

    useEffect(() => {
        // Check if username and password are present in session storage
        const username = sessionStorage.getItem('username');
        const password = sessionStorage.getItem('password');

        if (!username || !password) {
            // Redirect to login.js if username or password is missing
            window.location.href = '/';
        }
    }, []);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = async () => {
        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            swal.fire({
                title: 'Warning!',
                text: 'New password and confirm password do not match', // Assuming the server sends a 'message' field in the response
                icon: 'warning',
                confirmButtonText: 'OK'
            }).then(() => {
                // Reload the page
                window.location.reload();
            });
            return;
        }

        // Make API call to update password
        try {
            const response = await fetch('http://localhost:5000/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: sessionStorage.getItem('username'),
                    oldPassword,
                    newPassword,
                    confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {                
                swal.fire({
                    title: 'Success!',
                    text: data.message, // Assuming the server sends a 'message' field in the response
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Reload the page
                    window.location.reload();
                });
                // Optionally, you can redirect the user to another page
            } else {                
                swal.fire({
                    title: 'Error!',
                    text: data.error, // Assuming the server sends a 'message' field in the response
                    icon: 'error',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Reload the page
                    window.location.reload();
                });
            }
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (
        <div className='bghome'>
            <Header />
            <Header1 />
            <div className='col-md-12 col-sm-12 title'>
                <FaWarehouse className='mb-2' size={22} /> Change Password
            </div>
            <div className='text-center mt-5 col-md-12 vh-100'>
                <center>
                <div className='bg-white col-md-5 p-3'>
                <div className='col-md-12'>
                    <label style={{marginBottom: '5px', marginLeft: '30px'}}><b style={{fontWeight: '600'}}>Old Password</b></label><br />
                    <input type='password' style={{margin: '5px 0px', marginLeft: '30px', width: '60%', padding: '6px'}} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>
                <div className='col-md-12'>
                    <div className='mb-3'>
                        <label style={{marginBottom: '5px', marginLeft: '30px'}}><b style={{fontWeight: '600'}}>New Password</b></label><br />
                        <input type='password' style={{margin: '5px 0px', marginLeft: '30px', width: '60%', padding: '6px'}} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className='mt-4'>
                        <label style={{marginBottom: '5px', marginLeft: '30px'}}><b style={{fontWeight: '600'}}>Confirm Password</b></label><br />
                        <input type='password' style={{margin: '5px 0px', marginLeft: '30px', width: '60%', padding: '6px'}} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
                <div className='col-md-12 text-center mt-4'>
                    <button className='btn' style={{ background: '#004AAD', color: 'white' }} onClick={handlePasswordChange}>Set Now</button>
                </div> 
            
            </div></center>
            </div>
                          
            <Footer />
        </div>
    );
}

export default Changepass;