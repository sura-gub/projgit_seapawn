import React from 'react';
import wall1 from './../img/heart_banner-set.svg';
import wall2 from './../img/user.png';
import wall3 from './../img/about1.png';
import wall4 from './../img/bgshad.png';
import wall44 from './../img/money1.png';
import wall5 from './../img/seapawn_logo.png';
import wall6 from './../img/login.png';
import './../css/style.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


function WelcomePage(){

    return(
        <div className='bgcolor'>
            <div className=''>
                <img src={wall5} alt="log" className='mtt'/>
                <Link to={`/login`}> <button role="button" className='golden-button bttn'>
       <img src={wall6} width='20px' height='20px'/> <span className="golden-text">Login</span>
                </button></Link>
            </div>
            <div className='container-fluid clfl spc'>
            <div className='col-md-6 ee'>
                    <div className='banner_sidebar text-center'>
                        <img src={wall3} alt="" className="ee" />
                        {/* <img src={wall4} alt="" className="heartone" /> */}
                        <img src={wall44} alt="" className="hearttwo" />
                    </div>
                </div>
                <div className='col-md-6'>
                <img src={wall1} alt="log" width={"2%"} className='iimgg' />
                <div className='txt'>100% SECURE</div>
                
                <div className='txt1'>"Your Gateway To Financial Success"</div>
                <h4 className='txt2'>One of the India's best known brands and the world's largest financial service.</h4>

                <Link to={`/login`}> <button role="button" className='golden-button bttn1'>
       <span className="golden-text">Sign Up</span><img src={wall2} width='20px' height='20px'/>
                </button></Link>
                </div>
                <div className='col-md-6 dd'>
                    <div className='banner_sidebar text-center'>
                        <img src={wall3} alt="" className="bannermile" />
                        {/* <img src={wall4} alt="" className="heartone" /> */}
                        <img src={wall44} alt="" className="hearttwo" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;