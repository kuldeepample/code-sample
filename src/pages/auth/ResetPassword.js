import React, { useEffect, useState, useRef } from 'react';
import { Spinner } from "react-bootstrap";
import { connect, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { required, password, confirmPassword } from 'helpers';
// import { resetPassword } from "actions";
import { Link, useLocation } from "react-router-dom";

import ShowEye from './ShowEye';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import PasswordReset from '@images/PasswordReset.png'
import Verified from '@images/Verified.png'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import Wrapper from './Wrapper';
import { resetPassword } from '@/services';

const ResetPassword = (props) => {
  const dispatch = useDispatch()
  const [states, setStates] = useState({
    resetForm: {
      password: '',
      cpassword: '',
      email: '',
      token: ''
    },
    isReset: false,
    isLoggingIn: false,
    show: false
  })
  const { resetForm, isReset, isLoggingIn, show } = states;
  const location = useLocation()
  const formRef = useRef(null)
  const checkRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const token = params.get('token');

    let newState = resetForm;
    newState.email = email;
    newState.token = token;

    setStates({ ...states, resetForm: newState });
  }, [])

  const handleFormChange = (e) => {
    let newState = resetForm;
    newState = _.update(newState, e.target.name, function () { return e.target.value; });
    setStates({ ...states, resetForm: newState });
  }

  const handleReset = (e) => {
    e.preventDefault();

    formRef.current.validateAll();

    if (checkRef.current.context._errors.length === 0 && !isLoggingIn) {
      setStates({ ...states, isLoggingIn: true })
      dispatch(resetPassword(resetForm)).then(() => {
        toast.success('Password reset Successfully.');
        setStates({ ...states, isReset: true, isLoggingIn: false });
      }).catch((er) => {
        setStates({ ...states, isLoggingIn: false })
        toast.error(er || 'Error in password reset!');
      });
    }
  }

  return (
    <Wrapper>
      <div className="PasswordReset" >
        <img alt="Reset" src={isReset ? Verified : PasswordReset} className="w-100" />
      </div>
      <div className="forgotPasswordForm pb-4">
        <p className="welcome center">Reset Your</p>
        <p className="signIn center" >Password</p>
        {isReset ?
          <div className='d-flex flex-column' >
            <p className="resetText C-818188 ">Password reset successfully</p>
            <Link to='/' className="form">
              <input type='button' value='Sign In' className="bold C-fff Bg-primary" />
            </Link>
          </div>
          :
          <Form ref={formRef} onSubmit={(e) => handleReset(e)} className="form d-flex flex-column">
            <p className="email C-dark bold mb-1">Password</p>
            <Input
              type={show ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={resetForm.password}
              onChange={(e) => handleFormChange(e)}
              validations={[required, password]}
            />
            <ShowEye show={show} onClick={() => setStates({ ...states, show: !show })} />

            <p className="email C-dark bold mb-1 mt-3">Confirm Password</p>
            <Input
              type={show ? 'text' : 'password'}
              name="cpassword"
              placeholder="Confirm Password"
              value={resetForm.cpassword}
              onChange={(e) => handleFormChange(e)}
              validations={[required, confirmPassword]}
            />

            <button type='submit' style={{ marginTop: 26 }} className='submit center Bg-primary C-fff bold' >
              {!isLoggingIn ?
                "Submit"
                :
                <Spinner animation='border' size='sm' />
              }
            </button>
            <CheckButton style={{ display: "none" }} ref={checkRef} />
          </Form>
        }
      </div>
    </Wrapper>
  );
}

const actionCreators = {
  // resetPassword: (data) => (dispatch) => dispatch(resetPassword(data))
};

export default connect(null, actionCreators)(ResetPassword);