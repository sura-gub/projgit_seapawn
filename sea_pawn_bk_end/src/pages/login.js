import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './../css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logout from './../img/logout.png';
import Swal from 'sweetalert2';

function Log() {
    const [logoUrl, setLogoUrl] = useState('');
    const [userType, setUserType] = useState('admin'); // Default to 'admin'
    const [branch, setBranch] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleBranchChange = (e) => {
        setBranch(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check for missing values
        if (!username || !password) {
            Swal.fire('Warning', 'Please enter both username and password', 'warning');
            return;
        }
        // If userType is 'staff', check for missing branch
        if (userType === 'staff' && !branch) {
            Swal.fire('Warning', 'Please enter the branch', 'warning');
            return;
        }
        // Send the data to the server for authentication
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userType, username, password, branch }),
            });
            const result = await response.json();
            if (response.ok) {
                // Display success message
                Swal.fire({
                    title: 'Success',
                    text: 'Login successful',
                    icon: 'success',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect to home.js page
                        window.location.href = '/home';
                        // Save username and password in session storage
                        sessionStorage.setItem('username', username);
                        sessionStorage.setItem('password', password);
                        // If userType is 'staff', save brch_id in session storage
                        if (userType === 'staff') {
                            const brch_id = branch; // Assuming the server sends brch_id in the response
                            sessionStorage.setItem('brch_id', brch_id);
                        }
                        else{
                            const brch_id = 0;
                            sessionStorage.setItem('brch_id', brch_id);
                        }
                    }
                });
            } else {
                // Display error message
                Swal.fire('Error', result.error || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Error during login:', error);
            Swal.fire('Error', 'An unexpected error occurred', 'error');
        }
    };

    useEffect(() => {
        // Fetch the logo when the component mounts
        fetchLogo();
    }, []);

    const fetchLogo = async () => {
        try {
            const response = await fetch('http://localhost:5000/company-logo');

            if (response.ok) {
                // If the response is successful, set the logo URL
                setLogoUrl(response.url);
            } else {
                console.error('Error fetching company logo:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching company logo:', error);
        }
    };

    return (
        <div className='coming-page-info-6'>
            <div className='login-container'>
                <div>
                    <div className='d-flex'>
                        <div className='mt-5 mb-4'>
                            {logoUrl && <img src={logoUrl} width={'43%'} alt='Company Logo' style={{ marginLeft: '23%' }} />}
                        </div>
                        <Link to={`/`} className='lgar'><img src={logout} alt='' width={'5%'} height={'15%'} /></Link>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {/* Radio buttons for user type */}
                        <div style={{ marginBottom: '2%', marginTop: '1%' }} className='d-flex'>
                            <div style={{ marginRight: '10%', marginLeft: '20%' }}>
                                <label className='fs-5'>
                                    Admin
                                    <input
                                        type='radio'
                                        value='admin'
                                        checked={userType === 'admin'}
                                        onChange={handleUserTypeChange}
                                    />
                                </label>
                            </div>
                            <div style={{ marginLeft: '10%' }}>
                                <label className='fs-5'>
                                    Staff
                                    <input
                                        type='radio'
                                        value='staff'
                                        checked={userType === 'staff'}
                                        onChange={handleUserTypeChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <label style={{ marginBottom: '2%' }} className='fs-6'><b>Username</b></label>
                        <input type='text' style={{ marginBottom: '4%' }} placeholder='Username' name='username' value={username} onChange={handleUsernameChange} />
                        <label style={{ marginBottom: '2%' }} className='fs-6'><b>Password</b></label>
                        <input type='password' style={{ marginBottom: '4%' }} placeholder='Password' name='password' value={password} onChange={handlePasswordChange} />
                        {userType === 'staff' && (
                            <div style={{ marginBottom: '2%' }}>
                                <label className='fs-6'><b>Branch</b></label>
                                <input
                                    type='text'
                                    style={{ marginBottom: '4%' }}
                                    placeholder='Branch'
                                    name='branch'
                                    value={branch}
                                    onChange={handleBranchChange}
                                />
                            </div>
                        )}
                        <div style={{ marginBottom: '6%' }} className='text-center'>
                            <button type='submit' className='btn btn-primary'>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Log;
