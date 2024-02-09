import React from 'react';

const Footer = () => {

    const centerStyle = {
        textAlign: 'center',
    };

    const smallStyle = {
        fontSize: '11px',
    };

    return (
        <div className='foot'>
            <center style={centerStyle}>
                <small style={smallStyle}>
                    GOLD FINANCE MANAGEMENT SYSTEM: For Support : Sea Sense - Marthandam
                </small>
            </center>
        </div>
    );
};

export default Footer;
