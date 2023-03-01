import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import Verified from '@images/Verified.png'
import notVerified from '@images/notVerified.png'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import Wrapper from './Wrapper';

const VerifyEmail = () => {
	const [state, setState] = useState({
			type: null,
			message: null,
		})
	const navigate = useNavigate();
	const location = useLocation()

	useEffect(() => {
		const windowUrl = location.search;
		const params = new URLSearchParams(windowUrl);
		let type = params.get('type');
		let message = params.get('message')
		if (type === 'success') {
			toast.success(message)
			setState({ type, message });
		}
		else if (type === 'error') {
			toast.error(message)
			setState({ type, message });
		}
		else {
			navigate('/')
		}
	}, [])

		const { type } = state
		return (
			<Wrapper>
				{
					type === 'success' ?
						<div className='d-flex flex-column align-items-center w-100'>
							<div className="PasswordReset" >
								<img alt="Warning" src={Verified} className="w-100" />
							</div>
							<div className="forgotPasswordForm pb-4">
								<p className="welcome center">Email Verification</p>
								<p className="signIn center" >Successful</p>

								<div className='d-flex flex-column C-818188' >
									<p className="verify-email">Thank you, your email has been verified</p>
									<p className="verify-email">Your account is now active.</p>
									<p className="verify-email mt-0">please click on below button to Sign In to your account.</p>
									<Link to='/' className="form w-75 d-flex align-self-center">
										<input type='button' value='Sign In' className="bold C-fff Bg-primary" />
									</Link>
								</div>
							</div>
						</div>
						: type === 'error' ?
							<div className='d-flex flex-column align-items-center w-100'>
								<div className="PasswordReset" >
									<img alt="Image" src={notVerified} className="w-100" />
								</div>
								<div className="forgotPasswordForm pb-4">
									<p className="welcome center">Email Verification</p>
									<p className="signIn center" >Failed</p>

									<div className='d-flex flex-column C-818188' >
										<p className="verify-email">There is some error in verification.</p>
										<p className="verify-email">Please try again,</p>
										<p className="verify-email mt-0">or click on the Resend button to receive a new verification mail.  </p>
										<Link to='/' className="form w-75 d-flex align-self-center">
											<input type='button' value='Sign In' className="bold C-fff Bg-primary" />
										</Link>
									</div>
								</div>
							</div>
							: null
				}
			</Wrapper>
		);
	}

export default VerifyEmail;