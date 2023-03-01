import { AddEditModal, DeleteModal, FilterForm, PaginationComponent } from '@/components'
import { DropDown, EmptyComponent, ReactDatePicker, TextInput } from '@/components/common'
import { isNotUser } from '@/helpers'
import React, { useState } from 'react'
import { Col, Spinner } from 'react-bootstrap'
import { connect, useDispatch, useSelector } from 'react-redux';
import CredentialItem from './CredentialItem';
import CredentialForm from '@pages/Credential/CredentialForm'
import _ from 'lodash'
import { useEffect } from 'react'
import CredentialInfo from '@/pages/Credential/CredentialInfo'
import { toast } from 'react-toastify'
import { deleteCredential, getCategory, getCredentialsList, getCredentialTypesList } from '@/services'

const Credential = (props) => {
    const dispatch = useDispatch()
    const reducerData = useSelector((state) => {
        return {
            credentialList: state.credential.credentialList,
            credentialTypes: state.credential.credentialTypes,
            credentialCategory: state.credential.credentialCategory
        }
    })
    const { credentialTypes, credentialList} = reducerData
    const { data } = props;

    const [state, setState] = useState({})
    const { isClearable, loading, limit = 10, expiration_date, showModel, selectedCredential, selectedUser, url, callList,
        filterData, activePage = 1, totalItems, toolTip, credentialInfo,
        showDetail, details = {}, deleteModal, isSubmitting, selectedItem } = state

    const [expirationDate, setExpirationDate] = useState([null, null]);
    const [expire_start, expire_end] = expirationDate;

    const [credentialDate, setCredentialDate] = useState([null, null]);
    const [credential_start, credential_end] = credentialDate;
    useEffect(() => {
        callCredentialList()
    }, [callList]);

    useEffect(() => {
        dispatch(getCredentialTypesList())
        dispatch(getCategory('credential'))
    }, [])

    const callCredentialList = () => {
        let payload = {
            user_id: data.id,
            limit,
            credential_type_id: filterData?.credentialType?.id || '',
            credential_end: credential_end,
            credential_start,
            expire_start,
            expire_end,
            // user_id: filterData?.user?.id
            offset: limit * activePage - limit || 0,
        }
        setState({ ...state, loading: true })
        dispatch(getCredentialsList(payload)).unwrap().then((res) => {
            if (res?.success) {
                setState({ ...state, loading: false, totalItems: res?.total })
            }
        })
    }
    const userData = {
        id: data?.id,
        fname: data?.fname,
        lname: data?.lname
    }
    const handleFilter = (name, value) => {
        setState({
            ...state, filterData: {
                ...filterData,
                [name]: value
            }, callList: !callList, isClearable: true
        })
    }

    const showDetails = (data) => {
        setState({ ...state, showDetail: true, details: data })
    }
    const handleEdit = (data) => {
        setState({ ...state, showModel: true, toolTip: false, credentialInfo: data })
    }

    const handleDelete = (id) => {
        setState({ ...state, deleteModal: true, selectedItem: id, toolTip: false})
    }
    const deleteCredentialItem = () => {
        setState({ ...state, isSubmitting: true })
        dispatch(deleteCredential(selectedItem?.id)).unwrap().then((res) => {
            if (res?.success)
                toast.success(res?.message);
            else
                toast.error(res?.message)
            setState({ ...state, deleteModal: false, isSubmitting: false, callList: !callList, toolTip: undefined })
        })
    }
    return (
        <>
            <FilterForm
                name='Credential'
                onAddClick={(reducerData?.currentUser?.id === data?.id || isNotUser()) ? () => setState({ ...state, showModel: true, selectedUser: { name: data?.fname + ' ' + data?.lname, id: data?.id } }) : false}
                isClearable={isClearable}
                onFilterClick={() => setState({ ...state, callList: !callList, isClearable: true })}
                onClearFilter={() => {
                    setCredentialDate([null, null])
                    setExpirationDate([null, null])
                    setState({ isClearable: false, callList: !callList,  })
                }}
            >
                <Col xs={12} lg={4} className='mt-2 pe-0 pe-lg-2'>
                    <DropDown
                        placeholder='Credential Type'
                        data={credentialTypes}
                        value={filterData?.credentialType?.name}
                        onChange={(e) => handleFilter('credentialType', JSON.parse(e.target.id))} />
                </Col>
                <Col xs={12} lg={4} className='mt-2 pe-0 pe-lg-2'>
                    <ReactDatePicker
                        selectsRange={true}
                        placeholderText='Completion date'
                        startDate={credential_start}
                        endDate={credential_end}
                        classes='Shadow text-dark'
                        onChange={(update) => { setCredentialDate(update); }}
                    // isClearable={true}
                    />
                </Col>
                <Col xs={12} lg={4} className='mt-2 pe-0 pe-lg-2'>
                    <ReactDatePicker
                        selectsRange
                        placeholderText={'Expiration Date'}
                        startDate={expire_start}
                        endDate={expire_end}
                        onChange={(date) => { setExpirationDate(date) }}
                        classes={'text-dark Shadow'}
                    />
                </Col>
            </FilterForm>
            {loading ?
                <div className='d-flex center'>
                    <Spinner animation="border" className='d-flex center' style={{ marginTop: '10%' }} />
                </div>
                :
                _.isEmpty(credentialList)
                    ? <EmptyComponent title={'Credential'} />
                    :
                    <div>
                        {
                            credentialList?.map((item) => {
                                return <CredentialItem data={item}
                                    handleEdit={handleEdit} toolTip={toolTip}
                                    showDetails={() => showDetails(item)}
                                    handleDelete={() => handleDelete(item)} />
                            })
                        }
                        {totalItems > 10 && <PaginationComponent
                            activePage={activePage}
                            limit={10}
                            totalItemsCount={totalItems}
                            handlePageChange={(page) => !loading && setState({ ...state, activePage: page, callList: !callList })}
                        />}
                    </div>
            }
            {showModel &&
                <CredentialForm credentialTypes={credentialTypes} peopleDetail={userData} showModel={showModel}
                    handleClose={() => setState({ ...state, showModel: false, toolTip: undefined, credentialInfo: {} })} credentialInfo={credentialInfo} />
            }
            {showDetail &&
                <AddEditModal
                    name={details?.credential_type?.name}
                    show={showDetail}
                    closeModal={() => setState({ ...state, showDetail: false })}>
                    <CredentialInfo
                        data={details}
                    />
                </AddEditModal>
            }
            {deleteModal &&
                <DeleteModal
                    show={deleteModal}
                    name={selectedItem?.credential_type?.name}
                    isSubmitting={isSubmitting}
                    closeModal={() => setState({ ...state, deleteModal: false, toolTip: undefined })}
                    onClickDelete={deleteCredentialItem}
                />
            }
        </>
    )
}

const mapDispatchToProps = {
    // getCredentialTypesList: () => getCredentialTypesList(),
    // getCredentialsList: (data) => getCredentialsList(data),
    // addCredential: (data) => addCredential(data),
    // deleteCredential: (id) => deleteCredential(id),
    // getCategoryList: (data) => getCredentialsCategory(data),
}
export default connect(null, mapDispatchToProps)(Credential)