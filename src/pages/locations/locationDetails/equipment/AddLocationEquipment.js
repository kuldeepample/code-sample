import React, { useState, useEffect } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
// import { getAvailableEquipments, addEquipmentsToLocation } from 'actions'
import { connect, useDispatch, useSelector } from 'react-redux';

import { TextInput, DropDown, EmptyComponent } from '@components/common'
import EquipmentItem from './EquipmentItem';
import { FilterForm, AddEditModal } from '@/components';
import _ from 'lodash'
import { addEquipmentsToLocation, getAvailableEquipments } from '@/services';
import { toast } from 'react-toastify';

const AddLocationEquipment = (props) => {
  const dispatch = useDispatch()
  const modelData = useSelector((state) => {
    return {
      availableEquipmentList: state.equipment.availableEquipmentList,
      permissions: state.auth.licensePermissions,
      equipmentCategories: state.equipment?.equipmentCategories,
      equipmentModelList: state.equipment.equipmentModelList,
      complianceStatusList: state.location.complianceStatusList
    }
  })
  const { availableEquipmentList, permissions, equipmentCategories, equipmentModelList, complianceStatusList } = modelData
  const [state, setState] = useState({
    selectedEquipments: []
  })
  const { closeModal, onSubmitAddEquipments, location, medication, modelList, addNewEquipment } = props;
  const { serial_number, model, status, isClearable, selectedEquipments, equipmentList, isLoading, isFetching } = state;

  useEffect(() => {
    if (location?.id) {
      setState({ ...state, isFetching: true })
      dispatch(getAvailableEquipments({ location_id: location?.id, slug: medication ? 'medication' : 'equipment' })).unwrap().then(res => {
        if (res)
          setState({ ...state, equipmentList: res?.data, isFetching: false })
      })
    }
  }, [])

  useEffect(() => {
    if (model?.id || status?.id) {
      handleFilter()
    }
  }, [model?.id, status?.id])


  const handleFilterChange = (e, value) => {
    setState({ ...state, [e.target.name]: value })
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value) handleFilter()
  }

  const handleFilter = () => {
    let equipments = availableEquipmentList;
    if (serial_number || model || status) {
      if (serial_number)
        equipments = _.filter(equipments, key => { return key.serial_number.toLowerCase().trim().includes(serial_number.toLowerCase().trim()) })
      if (model)
        equipments = _.filter(equipments, key => { return key?.equipment_model?.name === model?.name })
      if (status)
        equipments = _.filter(equipments, key => { return key.compliance_status?.id === status?.id })

      setState({ ...state, isClearable: true, equipmentList: equipments })
    }
  }

  const handleCheck = (e, id) => {
    if (e.target.checked)
      setState({ ...state, selectedEquipments: [...selectedEquipments, id] })
    else
      setState({ ...state, selectedEquipments: _.pull(selectedEquipments, id) })
  }

  const handleFormSubmit = () => {
    let payload = {
      location_id: location?.id,
      equipment_ids: selectedEquipments
    }
    setState({ ...state, isLoading: true })
    dispatch(addEquipmentsToLocation(payload)).unwrap().then(res => {
      if (res?.success) {
        toast.success(res?.message)
        onSubmitAddEquipments();
      }
      else {
        toast.error(res?.message)
        setState({ ...state, isLoading: false })
      }
    })
  }

  const clearFilter = () => {
    setState({ ...state, isClearable: false, model: '', serial_number: '', status: '', equipmentList: availableEquipmentList })
  }
  return (
    <>
      <AddEditModal
        show={true}
        size='xl'
        type="Add" name={`${medication ? 'Medication' : 'Equipment'} to ${location?.name}`}
        isSubmitting={isLoading}
        isDisableSave={_.isEmpty(selectedEquipments)}
        isDisableAddNew={isFetching}
        onSubmit={() => handleFormSubmit()}
        onAddNew={() => addNewEquipment() /*  navigate(medication ?"/medication/registration" : "/equipment/registration") */}
        closeModal={closeModal}
      >
        <FilterForm name='People'
          onFilterClick={() => handleFilter()}
          isClearable={isClearable}
          onClearFilter={() => clearFilter()}
        >
          <Col xs={12} lg={4} className='mt-2'>
            <TextInput placeholder={`${medication ? 'Lot' : 'Serial'} Number`} name={medication ? 'lot_number' : 'serial_number'} value={serial_number} onChange={(e) => handleFilterChange(e, e.target.value)} onKeyDown={handleKeyDown} />
          </Col>
          <Col xs={12} lg={4} className='mt-2'>
            <DropDown value={model?.name} placeholder='Model' name='model' data={modelList} onChange={(e) => handleFilterChange(e, JSON.parse(e.target.id))} />
          </Col>
          <Col xs={12} lg={4} className='mt-2'>
            <DropDown value={status?.name} placeholder='Status' name='status' data={complianceStatusList} onChange={(e) => handleFilterChange(e, JSON.parse(e.target.id))} />
          </Col>
        </FilterForm>
        <div className='Content border-top' style={{ height: '370px' }}>
          {isFetching ?
            <div className='h-100 w-100 center'>
              <Spinner animation='border' />
            </div>
            :
            _.isEmpty(equipmentList) ?
              <div className='center h-100'>
                <EmptyComponent title={medication ? 'Medication' : 'Equipment'} onAddNew={() => addNewEquipment()} />
              </div>
              :
              equipmentList?.map((data, index) => {
                return (
                  <Row key={index} className='d-flex flex-row border-bottom m-0'>
                    <Col lg={'auto'} xs={'auto'} className='d-flex align-items-center justify-content-center pe-0'>
                      <input
                        type='checkbox'
                        className='regular-checkbox'
                        onClick={(e) => handleCheck(e, data.id)}
                        checked={_.includes(selectedEquipments, data?.id)}
                      />
                    </Col>
                    <Col>
                      <EquipmentItem item={data} />
                    </Col>
                  </Row>
                )
              })
          }
        </div>
      </AddEditModal>
    </>
  )
}

function mapStateToProps(state) {
  return {
    // availableEquipmentList: state.equipment.availableEquipmentList,
    // permissions: state.auth.licensePermissions,
    // equipmentCategories: state.equipment?.equipmentCategories,
    // equipmentModelList: state.equipment.equipmentModelList,
    // complianceStatusList: state.location.complianceStatusList
  }
}
const actionCreators = {
  // getAvailableEquipments: (params) => getAvailableEquipments(params),
  // addEquipmentsToLocation: (data) => addEquipmentsToLocation(data),
}

export default connect(mapStateToProps, actionCreators)(AddLocationEquipment);
