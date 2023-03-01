import { AddEditModal } from '@/components';
import { getCredentialDetail } from '@/services';
import moment from 'moment';
import React, { useState } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CredentialInfo from '../Credential/CredentialInfo';

const CredentialItem = (props) => {
    const dispatch = useDispatch()

    const [state, setState] = useState({})
    const { detail, showDetail, loading } = state
    const { data = {} } = props;
    const { credential_type, credential_at, expire_at, state: status } = data
    const { color } = status?.state_level || {}

    const location = useLocation()
    const params = new URLSearchParams(location?.search)
    const credential = params.get('tab')

    const getColor = (slug) => {
        if (slug === 'confirmed')
            return 'success';
        if (slug === 'expired')
            return 'danger'
        if (slug === 'expiring-soon')
            return 'warning'
    }

    const showDetails = (data) => {
        setState({ ...state, loading: true, showDetail: true })
        dispatch(getCredentialDetail({ id: data?.id })).unwrap().then((res) => {
            setState({ ...state, detail: res?.data, showDetail: true, loading: false })
        })
    }
    return (
        <div className={`m-0 Bg-fff d-flex flex-row rounded mt-2 Shadow overflow-hidden`} >
            <div className={`Bg-${getColor(status?.slug || 'confirmed')} p-0`} style={{ minWidth: '12px', backgroundColor: color, zIndex: 222 }}></div>
            <Row as={Col} xs={12} className={`credential-item ${+credential === data?.id ? 'highlight' : ''} justify-content-between align-items-center`}  >
                <Col xs={12} lg={5} as={Row} className={'align-items-center justify-content-between pe-lg-0'}>
                    <Col sm={4} className='C-primary itemText' role={'button'} onClick={() => showDetails(data)}>{credential_type?.name}</Col>
                    {/* <Col sm={4} xs={6} title={user?.fname + ' ' + user?.lname} className='C-primary itemText text-capitalize text-truncate' onClick={isNotUser() ? userDetails : ''} role={'button'}>
                        <FaRegUser className='C-primary me-1' size={16} />
                        {user?.fname + ' ' + user?.lname}
                    </Col> */}
                    <Col sm={3} xs={6} style={{ color: color }} className={`C-${getColor(status?.slug || 'confirmed')} itemText ps-md-0`}>{status?.name || 'Confirmed'}</Col>
                </Col>
                <Col xs={11} lg={6} as={Row} className='C-dark ps-lg-0'>
                    <Col sm={5} lg={6}><span className='itemText C-818188'>Completed:</span> <span className='C-818188'>{credential_at ? moment(credential_at).format('MM/DD/YYYY') : ' - '}</span></Col>
                    <Col sm={5} lg={6}><span className='itemText C-818188'>Expiration:</span> <span className='C-818188'>{expire_at ? moment(expire_at).format('MM/DD/YYYY') : ' - '}</span></Col>
                </Col>
            </Row>
            {showDetail &&
                createPortal(
                    <AddEditModal
                        name={detail?.credential_type?.name}
                        show={showDetail}
                        closeModal={() => setState({ ...state, showDetail: false })}>
                        {
                            loading ?
                                <div className='d-flex center flex-grow-1' style={{minHeight: '110px'}}>
                                    <Spinner animation='border' className='d-flex align-self-center' />
                                </div>
                                : <CredentialInfo
                                    data={detail}
                                />

                        }
                    </AddEditModal>
                    , document.body)
            }
        </div>
    )
}

export default CredentialItem