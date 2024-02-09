import { useEffect, useState } from 'react';
import './../css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import log1 from './../img/logout1.png';
import { CalendarFill } from 'react-bootstrap-icons';
import { FaCoins } from 'react-icons/fa';

function Header() {
    const [logoUrl, setLogoUrl] = useState('');
    const [username, setUsername] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // Fetch the logo, username, and current date when the component mounts
        fetchLogo();
        fetchUsername();
        fetchCurrentDate();
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

    const fetchUsername = async () => {
        try {
            // Assuming your username is stored in the session
            const storedUsername = sessionStorage.getItem('username');

            if (storedUsername) {
                // If the username is found in the session, set it in the state with the first letter of each word in uppercase
                const formattedUsername = storedUsername.replace(/\b\w/g, (char) => char.toUpperCase());
                setUsername(formattedUsername);
            }
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    const fetchCurrentDate = () => {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        setCurrentDate(formattedDate);
    };

    return (
        <div className='d-flex bg-light'>
            <div className='mt-1'>
                {logoUrl && <img src={logoUrl} width={'23%'} alt='Company Logo' style={{ marginLeft: '8%' }} />}
            </div>
            <div style={{marginRight: '15%'}} className='mt-2 dd'>
                <table style={{ background: 'darkgray', color: '#142b6e', border: '1px solid white', letterSpacing: '1px', fontSize: '12px', wordSpacing: '6px', whiteSpace: 'nowrap' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '3px' }}> Date <CalendarFill /></td>
                            <td style={{ padding: '3px', border: '1px solid #ffffff', background: 'lightgray' }}> {currentDate}</td>
                            <td style={{ padding: '3px' }}> Gold Rate <FaCoins /></td>
                            <td style={{ padding: '3px', border: '1px solid #ffffff', background: 'lightgray' }}></td>
                            <td style={{ padding: '3px' }}> Monthly Interest %</td>
                            <td style={{ padding: '3px', border: '1px solid #ffffff', background: 'lightgray' }}></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ marginLeft: 'auto', marginRight: '2%', whiteSpace: 'nowrap' }} className='d-flex'>
                <p className='my-2 dd'>Welcome <b>{username}!</b></p>&nbsp;
                {/* <a href='login'><button className='btn' style={{marginBottom:'2px',marginTop:'2px',background: '#004AAD',height:'37px', color: 'white', cursor: 'pointer'}}><img src={log1} alt='' width={'18px'} height={'18px'} /> Logout</button></a> */}
           

                <a href='login'><button class="Btn">
  
  <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
  
  <div class="text">Logout</div>
</button></a>


</div>
        </div>
    );
}
     
export default Header;