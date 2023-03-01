import { AddEditModal, PaginationComponent } from '@/components'
import { DropDown, ReactDatePicker } from '@/components/common'
import DocumentFilter from '@/pages/equipment/equipmentDetail/documents/DocumentFilter'
import DocumentList from '@/pages/equipment/equipmentDetail/documents/DocumentList'
import { uploadFile } from '@/services'
import { addLocationDoc, editLocationDoc, getDocList } from '@/services/location.service'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { BsCheckCircleFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const LocationDoc = (props) => {
    const dispatch = useDispatch()
    const [state, setState] = useState({})

    const reducerData = useSelector((state) => {
        return {
            currentUser: state.auth.user
        }
    })
    const { currentUser } = reducerData
    const { activeItem, isInActive, expDate, filterType, isFetching, filter, activePage = 1, loading,
        isClearable, type, showModal, docName = activeItem?.name, docType, status, file, docList, isEdit,
        totalItemsCount, expiration, name, uploadDate =[ null, null] } = state

    useEffect(() => {
        const payload = {
            status: isInActive ? "inactive" : "active",
            type: filterType?.key,
            expiration: expDate,
            limit: 10,
            name: name,
            startDate: uploadDate.at(0),
            endDate: uploadDate.at(1),
            offset: 10 * (activePage - 1),
        }
        setState({ ...state, isFetching: true })
        dispatch(getDocList({ id: props.location?.id, data: payload })).unwrap().then((res) => {
            if (res?.success)
                setState({ ...state, isFetching: false, totalItemsCount: res?.total || 0, docList: res?.data })
        })
    }, [filter, isClearable, isInActive, activePage])

    const clearFilter = () => setState({ ...state, isClearable: false, expDate: '', filterType: null, uploadDate: [null, null] });
    const openAddDocumentModal = () => setState({ ...state, type: {}, status: {}, file: null, notified: null, expiration: '', showModal: true })
    const equipmentDoc = [
        { id: 1, key: "medical_direction", name: "Medical Direction Certificate" },
        { id: 2, key: "ems_notification", name: "EMS Notification" },
        { id: 3, key: 'other', name: 'Other' }
    ]
    const statusData = [{ name: 'Active', key: 'active' }, { name: 'Inactive', key: 'inactive' }];
    const handleFilter = () => {
        if (!isFetching)
            setState({ ...state, isClearable: true, filter: !filter, activePage: 1 })
    }

    const handleChange = (name, value) => {
            let states = {}
            if (name === 'type' && type?.id !== value?.id)
                states = { /* status: {}, file: null, */ notified: null, expiration: '' }
            setState({ ...state, [name]: value, ...states })
    }
    const handleAddDocument = async () => {
        setState({ ...state, loading: true, })
        let payload = {
            name: docName,
            location_id: props.location?.id,
            user_id: currentUser?.id,
            type: docType?.key,
            status: status?.key,
            expire_at: expiration
        }
        if (file.size) {
            const formData = new FormData()
            formData.append('file', file, file?.name)
            await dispatch(uploadFile(formData)).unwrap().then((res) => {
                payload.file = res?.url
            })
        }
        dispatch(
            isEdit ? editLocationDoc({ id: activeItem?.id, data: payload }) : addLocationDoc(payload)
        ).unwrap().then((res) => {
            if (res?.success) {
                toast.success(res?.message)
            } else { toast.error(res?.message) }
            setState({ ...state, loading: false, showModal: false, filter: !filter })
        })
    }
    const checkDisable = () => {
        return !(docName && docType && status && file)
    }
    const handleEdit = (itemData) => {
        const { name, file, status, type, expire_at } = itemData
        const doc = equipmentDoc.find((item) => item?.key === type)
        const statusType = statusData.find((item) => item.key === status)
        setState({
            ...state, activeItem: itemData, isEdit: true, file: { name: file }, docType: doc, status: statusType,
            docName: name, showModal: true, expiration: expire_at
        })
    }
    const handlePageChange = (page) => setState({ ...state, activePage: page });
    const handleCheckBtn = () => setState({ ...state, isInActive: !isInActive, activePage: 1 })
    let switchBtnColor = isInActive ? 'Bg-danger' : 'Bg-success'
    return (
        <>
            <DocumentFilter clearFilter={clearFilter} openAddDocumentModal={openAddDocumentModal} handleFilter={handleFilter}
                handleChange={handleChange} handleCheckBtn={handleCheckBtn} documentType={equipmentDoc}
                isInActive={isInActive} switchBtnColor={switchBtnColor} expDate={expDate} filterType={state?.filterType}
                isClearable={isClearable} name={name} uploadDate={uploadDate} locationDoc />

            {showModal &&
                <AddEditModal show={showModal}
                    type={isEdit ? "Save" : "Add"} name='Document'
                    closeModal={() => setState({ ...state, showModal: false, docName: '', docType: '', status: '', file: '', isEdit: false })}
                    isDisableSave={checkDisable()}
                    isSubmitting={loading}
                    onSubmit={() => handleAddDocument()}
                >
                    <>
                        <label className={`itemText lable C-dark`} >Name*</label>
                        <input
                            type={'text'}
                            name='docName'
                            onChange={(e) => handleChange('docName', e.target.value)}
                            placeholder="Enter document name"
                            lableClass='mb-0 mt-2'
                            className='p-2 dropDown  w-100 text-capitalize'
                            value={docName}
                        />
                    </>
                    <Row>
                        <Col className='mt-2'>
                            <DropDown
                                placeholder='Select Type'
                                lable='Type*'
                                lableClass='itemText'
                                noShadow
                                value={docType?.name}
                                data={equipmentDoc}
                                onChange={(e) => handleChange('docType', JSON.parse(e.target.id))} />
                        </Col>
                        <Col className='mt-2'>
                            <DropDown
                                placeholder='Select status'
                                lable='Status*'
                                lableClass='itemText'
                                noShadow
                                value={status?.name}
                                data={statusData}
                                onChange={(e) => handleChange('status', JSON.parse(e.target.id))} />
                        </Col>
                    </Row>
                    <Col>
                        <Form.Label className='itemText lable mt-2 C-dark' >Date of Expiration</Form.Label>
                        <ReactDatePicker
                            placeholderText='Date of Expiraton'
                            selected={state?.expiration}
                            onChange={(date) => handleChange("expiration", date)}
                            classes='text-dark'
                        />
                    </Col>
                    <Col className='mt-2'>
                        <Form.Label className='itemText lable mt-1 C-dark' >Attachment*</Form.Label>
                        <div className='d-flex align-items-center'>
                            {
                                <>
                                    <input style={{ display: 'none' }} type={'file'} id='fileInput' accept='pdf/'
                                        onChange={(e) => handleChange("file", e?.target?.files[0])} />
                                    <label htmlFor='fileInput' className='mt-1'>
                                        <span className='fileSelector'>Browse...</span>
                                        <span className='F-12 mx-3 text-truncate' style={{ display: 'inline-block', width: '160px' }}>{state?.file?.name || 'No file selected'}</span>
                                    </label>
                                </>
                            }
                            {/* <Form.Control type="file" accept=".pdf" fileName={state?.file?.name} name={`${state?.file?.name}`} size="md" className='d-flex dropDown border-0 w-50 h-100' onChange={(e) => handleOnChange("file", e?.target?.files[0])} /> */}
                            {state?.file &&
                                <BsCheckCircleFill size={18} color='#5ac26a' className='mt-1' />
                            }
                        </div>
                    </Col>
                </AddEditModal>
            }

            <DocumentList
                locationTab
                documentList={docList}
                isFetching={isFetching}
                handleEdit={handleEdit}
                afterEdit={() => setState({ ...state, filter: !filter })}
            />
            {totalItemsCount > 10 && !isFetching &&
                <PaginationComponent
                    activePage={activePage}
                    limit={10}
                    totalItemsCount={totalItemsCount}
                    handlePageChange={(page) => !isFetching && handlePageChange(page)}
                />
            }
        </>
    )
}

export default LocationDoc