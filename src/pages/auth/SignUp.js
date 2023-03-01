import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinner } from "react-bootstrap";
import _ from 'lodash';

import { userSchema, email, required, password, confirmPassword, mobile, formatMobile } from 'helpers';

import './index.css'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import SocialIcons from './SocialIcons'
import Wrapper from './Wrapper';
import { register } from '@/services';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      terms: '',
      user: userSchema,
      isLoggingIn: false,
    }

    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleFormChange = (e) => {
    let newState = this.state.user;
    newState = _.update(newState, e.target.name, function () { return e.target.value; });
    this.setState({ user: newState });
  }

  setTerms = (e) => {
    this.setState({ terms: e.target.checked ? true : '' });
  }

  handleSignUp = (e) => {
    e.preventDefault();

    let { user } = this.state;
    const { register, history } = this.props;

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0 && !this.state.isLoggingIn) {
      this.setState({ isLoggingIn: true })
      let userData = _.mapValues(user, function (v, key) { return key === 'mobile' ? v.replace(/\D/g, "") : v });
      register(userData).then(() => {
        history.push('/');
        toast.success('Successfully created user.');
      }).catch((er) => {
        this.setState({ isLoggingIn: false })
        toast.error(er || 'Error in creating user!');
      });
    }
  }

  render() {
    const { user, terms, isLoggingIn } = this.state;

    return (
          <Wrapper>
            <div className="loginForm pb-4">
              <p className="welcome">Welcome</p>
              <p className="signIn">Sign Up</p>
              <Form ref={c => { this.form = c }} onSubmit={this.handleSignUp} className="form">
                <p className="email C-dark bold mb-1">Email</p>
                <Input
                  type='text'
                  name="email"
                  placeholder='Enter your Email here'
                  value={user.email}
                  onChange={this.handleFormChange}
                  validations={[required, email]}
                />

                <p className="email C-dark bold mb-1 mt-3">First Name</p>
                <Input
                  type='text'
                  name="fname"
                  className='text-capitalize'
                  placeholder='First Name'
                  value={user.fname}
                  onChange={this.handleFormChange}
                  validations={[required]}
                />

                <p className="email C-dark bold mb-1 mt-3">Last Name</p>
                <Input
                  type='text'
                  name="lname"
                  className='text-capitalize'
                  placeholder='Last Name'
                  value={user.lname}
                  onChange={this.handleFormChange}
                  validations={[required]}
                />

                <p className="email C-dark bold mb-1 mt-3">Password</p>
                <Input
                  type='password'
                  name="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={this.handleFormChange}
                  validations={[required, password]}
                />

                <p className="email C-dark bold mb-1 mt-3">Confirm Password</p>
                <Input
                  type='password'
                  name="cpassword"
                  placeholder="Confirm Password"
                  value={user.cpassword}
                  onChange={this.handleFormChange}
                  validations={[required, confirmPassword]}
                />

                <p className="email C-dark bold mb-1 mt-3">Phone Number</p>
                <Input
                  type='text'
                  name="mobile"
                  placeholder="Mobile"
                  value={formatMobile(user?.mobile)}
                  onChange={(mobile) => this.handleFormChange(mobile)}
                  validations={[required, mobile]}
                />

                <label className="checkBoxLable" >
                  <Input
                    type='checkbox'
                    name="terms"
                    className='checkBox shadow'
                    value={terms}
                    onChange={this.setTerms}
                    validations={[required]}
                  />
                  I accept the Terms of Use.
                </label>

                <button type='submit' className='submit center Bg-primary C-fff bold' >
                  {!isLoggingIn ?
                    "Sign Up"
                    :
                    <Spinner animation='border' size='sm' />
                  }
                </button>
                <CheckButton style={{ display: "none" }} ref={c => { this.checkBtn = c }} />
              </Form>
              <p className="or center">OR</p>
              <SocialIcons />
            </div>
            </Wrapper>
            );
  }
}

function mapStateToProps(state) {
  return {
    // profile: state.authentication.user,
  }
}

const actionCreators = {
  register: (data) => (dispatch) => dispatch(register(data))
};

export default connect(mapStateToProps, actionCreators)(SignUp);