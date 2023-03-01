import { ToolTip } from '@/components/common'
import React from 'react'
import { Col, Row } from 'react-bootstrap';
import CredentialIcon from '@images/credentialLogo.png';
import moment from 'moment';

const CredentialItem = (props) => {
    const { data , handleEdit, toolTip, showDetails, handleDelete} = props
    const { credential_type, state:status, credential_at, expire_at} = data || {}
    const color = status?.state_level?.color

    return (
        <div className={`m-0 Bg-fff rounded d-flex flex-row mt-2 Shadow overflow-hidden`}>
            <div className={`p-0`} style={{ minWidth: '12px', backgroundColor: color}}></div>
            <Row className='flex-grow-1'>
                <Col xs={11} as={Row} className='py-3 pe-0 align-items-center'>
                    <Col lg={3} className='d-flex ps-4' onClick={ showDetails } role={'button'}>
                        <img alt='Icon' src={CredentialIcon} style={{width: '18px', height: '18px'}} className={`credential-${status?.slug} me-2`}/>
                        <div className='itemText C-818188'>{credential_type?.name}</div>
                    </Col>
                    <Col lg={3} className='itemText C-818188 ps-4'>
                        Status: <span style={{color: color}} className={`text-capitalize`}>{status?.name}</span>
                    </Col>
                    <Col lg={3} md={6} className='itemText C-818188 ps-4'>
                        Completed: {credential_at ? moment(credential_at).format('MM/DD/YYYY') : null}
                    </Col>
                    <Col lg={3} md={6} className='itemText C-818188 ps-4'>
                        Expires: {expire_at ? moment(expire_at).format('MM/DD/YYYY') : null}
                    </Col>
                </Col>
                <Col className='center justify-content-end pe-0' xs={1} sm={1} lg={1}>
                    <ToolTip
                    show={toolTip}
                        options={[
                            {name: 'Edit', onClick: () => handleEdit(data)},
                            {name: 'Remove', onClick: () => handleDelete()}                            
                        ]}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default CredentialItem