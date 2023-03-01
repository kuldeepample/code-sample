import { getServiceOrg } from '@/services'
import React, { useEffect, useState } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { EmptyComponent, TextInput } from './common'

const OrgModal = (props) => {
    const dispatch = useDispatch()
    const { handleSelectedOrg, loading } = props
    // const organizationList = useSelector((state) => state.auth.organizationList)
    const [state, setState] = useState({})
    const { name, orgList, organizationList, fetching } = state

    useEffect(() => {
        setState({...state, fetching: true})
        dispatch(getServiceOrg({is_service_account: 1})).unwrap().then((res) => {
            if(res?.success){
                setState({...state, organizationList: res.data, orgList: res?.data, fetching: false})
            }
        })
    }, [])

    const handleFilterChange = (e, value) => {
        const list = organizationList?.filter((item) => item?.name?.toLowerCase().includes(value))
        setState({ ...state, [e.target.name]: value, orgList: list })
    }
    return (
        <>
                <Col xs={12} className='mt-2 px-3 py-1 Shadow' style={{ border: '1px solid #d2d2d8', borderRadius: '20px'}}>
                    <TextInput style={{all: 'unset'}} placeholder='Search organization' name='name' value={name} onChange={(e) => handleFilterChange(e, e.target.value)} />
                </Col>

            <div className={`Content mt-4 ${orgList?.length > 0 ? '' : 'd-flex text-center'}`} style={{ height: window.innerHeight / 2.2 }}>
                {
                    loading || fetching ?
                        <div className='d-flex center flex-grow-1 h-100 margin-auto'>
                            <Spinner animation='border' className='d-flex align-self-center' />
                        </div>
                        :
                        orgList?.length > 0 ?
                        orgList?.map((item) => {
                            return <OrgItem data={item} handleSelectedOrg={handleSelectedOrg} />
                        })
                        : <EmptyComponent title={'Service organization'}/>

                }
            </div>
        </>
    )
}

const OrgItem = (props) => {
    const { data, handleSelectedOrg } = props
    return (
        <Row className='d-flex py-2 flex-row border-bottom m-0 hide-scroll-bar align-items-center'>
            <Col xs={'auto'}>
                <input
                    type='radio'
                    className='radio'
                    onClick={(e) => handleSelectedOrg(data)}
                    name='orgName'
                />
            </Col>
            <Col>
                <img src={data?.image} className='avatar me-1 mb-1 rounded-circle border' style={{ objectFit: 'contain' }} />
                <span className='ps-3'>{data?.name}</span>
            </Col>
        </Row>
    )
}
export default OrgModal