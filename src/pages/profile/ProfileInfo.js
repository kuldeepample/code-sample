import React from 'react'
import { Link } from 'react-router-dom';
import { Container, Pressable } from '@components/common';
import LineItem from './LineItem'
import moment from 'moment';
import { getMobile } from "@/helpers";
import { Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Profile from '.';
import AddressBar from '@/components/Layout/AddressBar';
import Ellipsis from './Ellipsis';


const ProfileInfo = (props) => {
    let { fname, lname, email, mobile, updated_at, image, login_info, account, address, timezone, settings } = props?.profile || {};

    const email_delivery = settings?.find((item) => item?.name === 'email_delivery_time')
    const receive_email = settings?.find((item) => item?.name === 'receive_email')
    const receive_notification = settings?.find((item) => item?.name === 'receive_notification')

    return (
        <>
            <AddressBar page={[{ name: "Profile" }]} right={<Ellipsis active={'general'} />} />

            <div className='d-flex flex-column flex-lg-row'>
                <Profile active={'general'} />
                <Col>
                    <Container classes='mt-2 profile-field py-4'>
                        <Col>
                            <LineItem classes="pb-2" heading='Last Login' value={moment(login_info?.login_at).format("hh:mm a | MMM DD,YYYY (dddd)")} />
                            <LineItem heading='Last Update' value={moment(updated_at).format("hh:mm a | MMM DD,YYYY (dddd)")} />
                        </Col>
                        <Col xs={12} xl={6}>
                            <LineItem classes='pt-2 pt-xl-0' heading='Location' value={account?.name} />
                        </Col>
                    </Container>

                    <Container classes='mt-2 profile-field'>
                        <LineItem heading='Name' value={`${fname || ''} ${lname || ''}`} />
                    </Container>
                    <Container classes='mt-2 profile-field'>
                        <LineItem heading='Email' value={email} />
                    </Container>
                    <Container classes='mt-2 profile-field'>
                        <LineItem heading='Phone' value={getMobile(mobile)} />
                    </Container>
                    <Container classes='mt-2 profile-field'>
                        <LineItem heading='Organization' value={(account?.name || "") + " | " + (address || '')} />
                    </Container>
                    <Container classes='mt-2 profile-field'>
                        <LineItem heading='Time Zone' value={timezone?.text || " NA "} />
                    </Container>
                    <Container classes='mt-2 profile-field'>
                        <LineItem heading='Email Delivery Time' value={email_delivery?.value || " NA "} />
                    </Container>

                    <Container classes='mt-2 profile-field align-items-center'>
                        <Col md={6} className='d-flex pb-2 pb-md-0 justify-content-between justify-content-lg-start'>
                            <LineItem heading='Receive Notification' value={receive_notification?.value === '1' ? 'Enabled' : 'Disabled'}
                                valueColor={receive_notification?.value === '1' ? '#b3dfb6' : '#d65b9e'} />
                            {/* <Switch text isActive={receive_notification?.value === '1'} disable/> */}
                        </Col>
                        <Col md={6} className='d-flex justify-content-between justify-content-md-start'>
                            <LineItem heading='Receive Email' value={receive_email?.value === '1' ? 'Enabled' : 'Disabled'}
                                valueColor={receive_email?.value === '1' ? '#b3dfb6' : '#d65b9e'} />
                        </Col>
                    </Container>

                    <div className="d-flex justify-content-end">
                        <Pressable
                            as={Link}
                            to='/profile/edit'
                            title={'Edit Profile'}
                            style={{ width: '111px' }}
                            classes='p-1 mt-4 center'
                        />
                    </div>
                </Col>
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        profile: state?.auth?.user,
    }
}
export default connect(mapStateToProps, null)(ProfileInfo);