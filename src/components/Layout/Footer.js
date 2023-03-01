import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <>
        <div style={{ height: '44px', position: 'fixed', bottom: 0, color: '#a2a2a2', zIndex: 999 }} className="align-items-center w-100 p-1 Bg-fff F-14 footer body">
          <span className='ms-1'>School Health © {new Date().getFullYear()}</span>
          <Link to="/pages/privacy-policy" className="privacyLink F-14" style={{color : "#a2a2a2"}}>Privacy Policy</Link>
        </div>
      </>
    );
  }
}

export default Footer;

