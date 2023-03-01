import React, { Component } from 'react';
import { Spinner } from "react-bootstrap";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { email, required, password } from 'helpers';
import { Link, Navigate } from "react-router-dom";
import ShowEye from './ShowEye';
import SocialIcons from './SocialIcons';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Wrapper from './Wrapper';
import playStoreIcon from '@images/playStoreIcon.png';
import iosStoreIcon from '@images/iosStoreIcon.png'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { login } from '@/services';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginForm: {
        email: '',
        password: ''
      },
      isLoggingIn: false,
      show: false,
      isLoggedIn: false
    }

    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleFormChange = (e) => {
    let newState = this.state.loginForm;
    newState = _.update(newState, e.target.name, function () { return e.target.value; });
    this.setState({ loginForm: newState });
  }

  handleLogin = (e) => {
    e.preventDefault();

    const { loginForm } = this.state;
    const { login } = this.props;
    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0 && !this.state.isLoggingIn) {
      this.setState({ isLoggingIn: true })
      login(loginForm).then(() => {
        this.setState({ ...this.state, isLoggedIn: true })
        toast.success('Login Successfully.');
        // window.location.reload()
      }).catch((er) => {
        this.setState({ isLoggingIn: false })
        toast.error(er || 'Error in Login!');
      });
    }
  }

  render() {
    const { loginForm, isLoggingIn, show, isLoggedIn } = this.state;

    return (
      <>{
        isLoggedIn ?
          <Navigate to={'/dashboard'} />
          :
          <Wrapper>
            <div className="loginForm pb-4">
              <p className="welcome">Welcome</p>
              <p className="signIn">Sign In</p>
              <Form ref={c => { this.form = c }} onSubmit={this.handleLogin} className="form d-flex flex-column " >
                <p className="email C-dark bold mb-1">Email</p>
                <Input
                  type='text'
                  name="email"
                  placeholder='Enter your Email here'
                  value={loginForm.email}
                  onChange={this.handleFormChange}
                  validations={[required, email]}
                />
                <p className="email C-dark bold mb-1 mt-3">Password</p>
                <Input
                  type={show ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={this.handleFormChange}
                  validations={[required, password]}
                />
                <ShowEye show={show} onClick={() => this.setState({ show: !show })} />
                <Link to="./forgot-password" className='forgotPass C-818188 align-self-center'>Forgot Password</Link>
                <button type='submit' className='submit center Bg-primary C-fff bold' >
                  {!isLoggingIn ?
                    "Sign In"
                    :
                    <Spinner animation='border' size='sm' />
                  }
                </button>
                <CheckButton style={{ display: "none" }} ref={c => { this.checkBtn = c }} />
              </Form>

              <p className="or center C-818188">OR</p>
              <SocialIcons />
              {/* <div className="d-flex justify-content-center mt-4">
                <p >Don't have an account?</p>
                <Link to="/signup" className="signUp C-primary">&nbsp;Sign Up</Link>
              </div> */}
              <div className="d-flex justify-content-center mt-4">
                <Link to="/pages/privacy-policy" className="privacy C-818188">Privacy Policy</Link>
              </div>
              <div className=' mt-3 center'>
                <a className='pe-2' target='_blank' href='http://play.google.com/store/apps/details?id=com.schoolhealth'><img alt='playstore' src={playStoreIcon} className='appStoreIcon' role="button" /></a>
                <a className='ps-2' target='_blank' href='https://apple.co/3Q8SAII'><img alt='appstore' src={iosStoreIcon} className='appStoreIcon' role="button" /> </a>
              </div>
            </div>
          </Wrapper>
      }
      </>
    );
  }
}

function mapStateToProps(state) {
  return {}
}

const actionCreators = {
  login: (data) => (dispatch) => dispatch(login(data)),
};

export default connect(mapStateToProps, actionCreators)(Login);