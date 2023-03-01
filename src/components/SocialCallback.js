import React, { useEffect } from 'react';
import { Col, Row } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import Banner from '../pages/auth/Banner';
import Logo from '../pages/auth/Logo';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages/auth/index.css'
import { socialLogin } from '@/services';

const SocialCallback = (props)=> {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const expiresAt = params.get('expiresAt');
    const user = JSON.parse(params.get('user'));
    if (accessToken && user && user.id) {
      socialLogin({ accessToken, expiresAt, user });
      navigate('/dashboard');
    } else {
      toast.error('Invalid Social Login attempt!');
      navigate('/');
    }
  })

    return (
      <div className="App">
        <Row className='p-0 m-0'>
          <Banner />
          <Col md={5} xs={12} sm={12} className="d-flex flex-column align-items-center p-0 m-0 Bg-fff" style={{ zIndex: '1' }}>
            <Logo />
            <div className="forgotPasswordForm pb-4">
              <p className="welcome center">Unexpected</p>
              <p className="signIn center" >Error</p>

              <div className='d-flex flex-column' >
                <p className="resetText C-818188 ">Go to Home Page</p>
                <Link to='/' className="form">
                  <input type='button' value='Home' className="bold C-fff Bg-primary" />
                </Link>
              </div>

            </div>
          </Col>
        </Row>
      </div>
    );
  }

export default SocialCallback;