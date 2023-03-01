import { useState } from "react"
import { Col, Spinner } from "react-bootstrap"

import AddressBar from "@components/Layout/AddressBar"
import { Container, Pressable, TextInput } from '@components/common';

import { useNavigate } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
import './index.css'
import { toast } from 'react-toastify';
import ShowEye from "../auth/ShowEye";
import Profile from ".";
import Ellipsis from "./Ellipsis";
import { changePassword } from "@/services";

const ChangePassword = (props) => {
    const dispatch = useDispatch()
    const [state, setState] = useState({})
    const { oldPass, newPass, confirmPass, loading, wrongOldPassMessage, showOld, showNew } = state;
    const navigate = useNavigate();

    const handleChange = (e) => setState({ ...state, [e.target.name]: e.target.value, wrongOldPassMessage: false });

    const handleSubmit = () => {
        let payload = { old_password: oldPass, password: newPass }
        setState({ ...state, loading: true })
        dispatch(changePassword(payload)).unwrap().then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                navigate('/profile');
            }
            else setState({ ...state, wrongOldPassMessage: true, loading: false })
        })
    }

    return (
        <div className=''>
            <AddressBar page={[{ name: 'Change Password' }]} right={<Ellipsis active={'password'} />} />
            <div className='d-flex flex-column flex-lg-row'>
                <Profile active={'password'} />
                <Col className="d-flex flex-column align-items-center">

                    <Container classes='mt-3 pb-3 justify-content- ps-md-5'>
                        <Col className="my-1 my-md-3 C-dark" md={3}>Old Passward</Col>
                        <Col className="my-1 my-md-3" md={7}>
                            <TextInput
                                name='oldPass' lable='' placeholder='Old Passward'
                                noShadow
                                value={oldPass} type={showOld ? 'text' : 'password'} onChange={(e) => handleChange(e)}
                                validationText={(oldPass && (oldPass.length > 15 || oldPass.length < 8) ? "Password length should be 8 to 15 characters." : (oldPass && !oldPass?.trim().length) && "password can't be blank.") || (wrongOldPassMessage && 'Incorrect old Password')}
                                EyeComponent={<ShowEye show={showOld} onClick={() => setState({ ...state, showOld: !showOld })} style={{ marginTop: '-27px' }} />}
                            />
                        </Col>
                        <Col className="my-1 my-md-3 C-dark" md={3}>New Passward</Col>
                        <Col className="my-1 my-md-3" md={7}>
                            <TextInput
                                name='newPass' lable='' placeholder='New Password'
                                noShadow
                                value={newPass} type={showNew ? 'text' : 'password'} onChange={(e) => handleChange(e)}
                                validationText={newPass && (newPass.length > 15 || newPass.length < 8) ? "Password length should be 8 to 15 characters." : (newPass && !newPass?.trim().length) && "password can't be blank."}
                                EyeComponent={<ShowEye show={showNew} onClick={() => setState({ ...state, showNew: !showNew })} style={{ marginTop: '-27px' }} />}
                            />
                        </Col>
                        <Col className="my-1 my-md-3 C-dark" md={3}>Confirm Passward</Col>
                        <Col className="my-1 my-md-3" md={7}>
                            <TextInput
                                name='confirmPass' lable='' placeholder='Confirm Passward'
                                noShadow
                                value={confirmPass} type={showNew ? 'text' : 'password'} onChange={(e) => handleChange(e)}
                                validationText={(newPass && confirmPass && newPass !== confirmPass) && "Password does not match."}
                            />
                        </Col>
                    </Container>

                    <Col md={8} className='pe-3'>
                        <div className='d-flex flex-row justify-content-end mt-4'>
                            <Pressable title='Back'
                                classes='me-2 mt-3 d-flex Bg-fff C-dark align-self-center center p-1'
                                style={{ minWidth: '100px' }}
                                onPress={() => { navigate(-1) }}
                            />
                            <Pressable title='Update'
                                disabled={!(oldPass && newPass && confirmPass === newPass && !(newPass.length > 15 || newPass.length < 8) && !(oldPass.length > 15 || oldPass.length < 8) && newPass?.trim().length && oldPass?.trim().length)}
                                classes='ms-2 mt-3 d-flex align-self-center center p-1'
                                style={{ minWidth: '100px' }}
                                onPress={() => handleSubmit()}
                            />
                        </div>
                    </Col>
                </Col>
                {loading && <div style={{ zIndex: 1, position: 'absolute', opacity: 0.8 }} className='h-100 w-100 center Bg-fff'>
                    <Spinner animation='border' />
                </div>}
            </div>
        </div>
    )
}
const mapStateToProps = state => {
    return {
        profile: state.auth && state.auth.user,
    };
}

const actionCreators = {
};
export default connect(mapStateToProps, actionCreators)(ChangePassword);