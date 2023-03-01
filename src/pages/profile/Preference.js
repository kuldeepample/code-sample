import { Container, DropDown, Pressable } from '@/components/common';
import Switch from '@/components/common/Switch';
import AddressBar from '@/components/Layout/AddressBar';
import { isValidMobile, setUserToken } from '@/helpers';
import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import ReactDatePicker from 'react-datepicker';
import { connect, useDispatch } from 'react-redux';
import Profile from '.';
import _ from 'lodash'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import Ellipsis from './Ellipsis';
import { getTimeZoneList, getUserProfile, updateProfile } from '@/services';

const Preference = (props) => {
    const dispatch = useDispatch()
    let { timezone, settings } = props.profile || {};
    
    const receive_email = settings?.find((item) => item?.name === 'receive_email')
    const allowed_week_days = settings?.find((item) => item?.name === 'allowed_week_days')
    const receive_notification = settings?.find((item) => item?.name === 'receive_notification')

    const [state, setState] = useState({
        receive_email: receive_email?.value === '1',
        receive_notification: receive_notification?.value === '1',
        allowed_week_days: allowed_week_days?.value?.split('|') || [ "Mo", "Tu", "We", "Th", "Fr"],
    });

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    let email_delivery_time = settings?.find(item => item?.name === "email_delivery_time")?.value;
    const [hours, minutes] = email_delivery_time ? email_delivery_time?.split(':') : ['08', '00'];
    email_delivery_time = new Date(_, _, _, +hours, +minutes);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getTimeZoneList())
    }, []);

    const handleDays = (isPresent, select) => {
        if (isPresent) {
            const newDays = state.allowed_week_days?.filter((day) => day !== select)
            setState({ ...state, allowed_week_days: newDays })
        } else
            setState({ ...state, allowed_week_days: state.allowed_week_days.concat(select) })
    }

    const handleChange = (name, value) => {
        setState({ ...state, [name]: value })
        if (name === 'mobile' && !isValidMobile(value))
            setState(prev => ({ ...prev, mobileWarning: 'Invalid phone number!' }))
        else
            setState(prev => ({ ...prev, mobileWarning: '' }))
    }

    const handleSubmit = () => {
        if (!_.isEmpty(state)) {
            let userData = _.mapValues(state, function (v, key) {
                if (key === 'email_delivery_time')
                    return moment(v).format("HH:mm")
                if(key === 'allowed_week_days')
                    return v.join('|')
                return v
            });
            userData.timezone_id = userData.timeZone?.id
            setState(prev => ({ ...prev, isUpdating: false }))
            dispatch(updateProfile(userData))
                .then((res) => {
                    if (res) {
                        dispatch(getUserProfile());
                        let token = JSON.parse(localStorage.getItem('token'));
                        token.user = res;
                        setUserToken(token);
                        setState(prev => ({ ...prev, isUpdating: false }))
                        toast.success(res?.message)
                        navigate('/profile');
                    }
                    else {
                        setState(prev => ({ ...prev, isUpdating: false }))
                        toast.error(res?.message)
                    }
                })
        }
        else
            navigate('/profile');
    }
    const handleSwitch = (value, name) => setState({...state, [name]: value })
    const bg1 = { backgroundColor: "#c60970", color: "#fff" }
    const bg2 = { border: '1px solid #888888' }

    return (
        <>
            <AddressBar page={[{ name: "Profile" }]} right={<Ellipsis active={'settings'}/>} />
            <div className='d-flex flex-column flex-lg-row'>
                <Profile active={'settings'}/>
                <Col>
                    <Container classes='mt-2 profile-field pb-3'>
                        <Col className='p-0'>
                            <Container>
                                <Col lg={6} className='ps-lg-0 '>
                                    <DropDown
                                        noShadow
                                        searchable
                                        name='timeZone'
                                        lable='Time Zone'
                                        placeholder='Select Time Zone'
                                        value={state.timeZone?.name || timezone?.text}
                                        data={props.timeZoneList}
                                        onChange={(e) => handleChange(e.target.name, JSON.parse(e.target.id))}
                                    />
                                </Col>
                                <Col lg={6}>
                                    <span className='profile-text'>Email Delivery Time</span>
                                    <ReactDatePicker
                                        selected={state?.email_delivery_time || email_delivery_time}
                                        onChange={(date) => handleChange('email_delivery_time', date)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        placeholderText="Choose email delivery time"
                                        timeIntervals={10}
                                        timeFormat="HH:mm"
                                        dateFormat="HH:mm"
                                        className="dropDown datePicker text-dark"
                                    />
                                </Col>
                            </Container>
                        </Col>
                    </Container>
                    <Col>
                        <Container classes='mt-2 profile-field py-4 align-items-center'>
                            <Col md={6} className='d-flex pb-2 pb-md-0 justify-content-between justify-content-lg-start'>
                                <div className='p-0 profile-text'> Receive Notifications </div>
                                <Switch text isActive={state.receive_notification} handleSwitch={(e) => handleSwitch(e, 'receive_notification')} />
                            </Col>
                            <Col md={6} className='d-flex justify-content-between justify-content-md-start'>
                                <div className='pe-5 profile-text p-0'> Receive Emails </div>
                                <Switch text isActive={state.receive_email} handleSwitch={(e) => handleSwitch(e, 'receive_email')} />
                            </Col>
                        </Container>
                    </Col>
                    <Col>
                        <Container classes='mt-2 profile-field py-4'>
                            <Col className='d-flex justify-content-between align-items-center'>
                                <div className='profile-text p-0'>Allowed Weekdays</div>
                                <div className='C-dark' role={"button"} style={{ fontSize: '12px' }}>
                                    {days?.map((day) => {
                                        return <span className='days-options'
                                            style={state?.allowed_week_days?.includes(day) ? bg1 : bg2}
                                            onClick={() => handleDays(state.allowed_week_days?.includes(day), day)}>{day}</span>
                                    })}
                                </div>
                            </Col>
                        </Container>
                    </Col>

                    <Col>
                        <div className='d-flex flex-row justify-content-end mt-4'>
                            <Pressable
                                title='Back'
                                classes='me-2 mt-3 d-flex Bg-fff C-dark align-self-center center p-1'
                                style={{ minWidth: '100px' }}
                                onPress={() => { navigate(-1) }}
                            />
                            <Pressable
                                title='Update'
                                // disabled={state?.mobileWarning || loading}
                                classes='ms-2 mt-3 d-flex align-self-center center p-1'
                                style={{ minWidth: '100px' }}
                                onPress={() => handleSubmit()}
                            />
                        </div>
                    </Col>
                </Col>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        profile: state.auth && state.auth.user,
        timeZoneList: state.auth.timeZoneList
    };
}

const actionCreators = {
    // updateProfile: (data) => updateProfile(data),
    // getTimeZoneList: () => getTimeZoneList(),
    // getUserProfile: () => getUserProfile()
}

export default connect(mapStateToProps, actionCreators)(Preference);