import React, { Component, useRef, useState } from 'react';
import { Spinner } from "react-bootstrap";
import { connect, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { email, required } from 'helpers';
import { Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import PasswordReset from '@images/PasswordReset.png'
import Verified from '@images/Verified.png'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import Wrapper from './Wrapper';
import { forgotPassword } from '@/services';

const ForgotPassword = (props) => {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     resetForm: {
  //       email: '',
  //     },
  //     isSent: false,
  //     isLoggingIn: false
  //   }

  //   this.handleFormChange = this.handleFormChange.bind(this);
  // }

  const [state, setState] = useState({})
  const { resetForm = { email: '' }, isSent = false, isLoggingIn = false } = state

  const formRef = useRef();
  const btnRef = useRef();

  const dispatch = useDispatch()

  const handleFormChange = (name, value) => {
    setState({ ...state, resetForm: { [name]: value } });
  }
  
  const handleReset = (e) => {
    e.preventDefault();
    const isValid = btnRef.current.context._errors.length === 0

    if ( isValid && !isLoggingIn) {
      setState({...state, isLoggingIn: true })
      dispatch(forgotPassword(resetForm)).unwrap().then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          setState({ isSent: true, isLoggingIn: false });
        } else {
          setState({ isLoggingIn: false })
          toast.error(res?.message);
        }
      });
    }
  }

  // const { resetForm, isSent, isLoggingIn } = this.state;

  return (
    <Wrapper>
      <div className="PasswordReset" >
        <img alt="Reset" src={isSent ? Verified : PasswordReset} className="w-100" />
      </div>
      <div className="forgotPasswordForm pb-4">
        <p className="welcome center">Reset Your</p>
        <p className="signIn center" >Password</p>
        {isSent ?
          <div className='d-flex flex-column' >
            <p className="resetText C-818188 d-flex align-self-center">Password reset link has been sent to your registered Email</p>
            <Link to='/' className="form">
              <input type='button' value='Sign In' className="bold C-fff Bg-primary" />
            </Link>
          </div>
          :
          <Form ref={formRef} onSubmit={handleReset} className="form d-flex flex-column">
            <p className="email C-dark bold mb-1">Email</p>
            <Input
              type='text'
              name="email"
              placeholder='Enter your registered Email'
              value={resetForm.email}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
              validations={[required, email]}
            />

            <button type='submit' style={{ marginTop: 26 }} className='submit center Bg-primary C-fff bold' >
              {!isLoggingIn ?
                "Submit"
                :
                <Spinner animation='border' size='sm' />
              }
            </button>
            <CheckButton style={{ display: "none" }} ref={btnRef} />
          </Form>
        }
      </div>
    </Wrapper>
  );
}

export default ForgotPassword;