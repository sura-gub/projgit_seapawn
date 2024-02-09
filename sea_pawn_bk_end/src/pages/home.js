import React, { useEffect, useState } from 'react';
import Header from './header';
import Header1 from './header1';
import aboutimg from './../img/about.png';
import rm from './../img/request-money.png';
import { Link } from 'react-router-dom'; // Use Link for client-side routing
import Footer from './footer';

function Home() {
    const [companyName, setCompanyName] = useState('');
    useEffect(() => {
        // Check if username and password are present in session storage
        const username = sessionStorage.getItem('username');
        const password = sessionStorage.getItem('password');

        if (!username || !password) {
            // Redirect to login.js if username or password is missing
            window.location.href = '/login';
        }

        fetchCompanyDetails();
    }, []);

    const fetchCompanyDetails = async () => {
        try {
            const response = await fetch('http://localhost:5000/company-details');

            if (response.ok) {
                const companyDetails = await response.json();

                if (companyDetails && companyDetails.name) {
                    // Set the company name in the state
                    const storedUsername = companyDetails.name;
                    const formattedUsername = storedUsername.replace(/\b\w/g, (char) => char.toUpperCase());
                    setCompanyName(formattedUsername);
                } else {
                    console.error('Error fetching company details: Invalid response format');
                }
            } else {
                console.error('Error fetching company details:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching company details:', error);
        }
    };

    return (
        <div className='bghome'>
            <Header />
            <Header1 />
            <div className=' vh-100'>
            <div className='container'>
                <h2 style={{fontSize: '25px', marginBottom: '5px', marginTop: '20px', fontWeight: '450'}}>Welcome to {companyName && <span>{companyName}</span>}</h2>
                <p className='txt3'>Welcome to {companyName && <span>{companyName}</span>}, your trusted partner in navigating the vast seas of finance. At {companyName && <span>{companyName}</span>}, we understand that your financial journey is as unique as the waves that shape the ocean. Whether you're a seasoned investor seeking new opportunities or just setting sail on your financial voyage, our mission is to provide you with the tools, insights, and guidance you need to navigate confidently.</p>
            </div>
            <div className='container col-md-12 welmg1'>
            <div className='col-md-5'>
  <svg  xmlns="http://www.w3.org/2000/svg" style={{ left: '20px',top: '120px', position: 'absolute', zIndex: '0' }} width="600" height="550" viewBox="0 0 200 200" className="svflt">
  
  <defs>
   <radialGradient id="rgrad" cx="50%" cy="50%" r="50%" >
     <stop offset="0%" style={{stopColor: 'whitesmoke',stopOpacity:'1.00'}} />
     <stop offset="100%" style={{stopColor: 'lightgray',stopOpacity:'1.00'}} />
   </radialGradient>
  </defs>
  <path  d="M37.7,-15.4C44.8,9.8,43.9,34.4,28.7,47.3C13.5,60.2,-16,61.3,-33.8,48C-51.7,34.7,-57.9,6.9,-50.4,-18.8C-42.8,-44.5,-21.4,-68.2,-3.1,-67.2C15.3,-66.2,30.5,-40.6,37.7,-15.4Z" transform="translate(100 100)" stroke="none"  fill="#F2F4F8"  />
  </svg>
 
 
    <img src={aboutimg} alt='' className='welmg' style={{ position: 'relative', zIndex: '1' }} />
  </div>
                <div className='col-md-7'>
                    <h5 style={{fontSize: '25px', fontWeight: '600', color: '#3274c4'}}>{companyName && <span>{companyName}-Finance</span>}<hr /></h5>
                    <p className='txt3'>Certainly! Crafting a compelling slogan for a gold loan finance website like Seapawn is crucial for attracting customers and conveying the essence of your services. Here's a suggestion:</p>
                    <p className='txt3'>"At Seapawn Finance, Your Golden Dreams Take Flight! Unlock the Power of Your Precious Possessions with Swift and Secure Gold Loans. Navigate the Seas of Financial Freedom as We Pledge to Make Your Journey Smooth. Seapawn: Where Trust Meets Treasure, and Your Gold Finds Its True Value. Dive into a World of Confidence, Sail with Seapawn Finance!"</p>                    
                    <p className='txt3'>Feel free to customize it to better fit the tone and message you want to convey on your website.</p>
                    <ul style={{marginLeft: '-13px'}}>
                        <li><span className='txt3'>"Seapawn: Your Compass in the Sea of Finance."</span></li>
                    </ul>
                    <Link to="/loan"><button role="button" className='golden-button' ><span className="golden-text">APPLY LOAN</span><svg fill="currentColor" viewBox="0 0 24 24" class="icon">
    <path
      clip-rule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
      fill-rule="evenodd"
    ></path>
  </svg></button></Link>
                </div>                
            </div> </div>
                        <Footer />
        </div>
       
    );
}

export default Home;