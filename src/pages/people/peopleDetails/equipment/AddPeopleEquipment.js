import React, { useState, useEffect } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';

import { TextInput, DropDown, EmptyComponent } from '@components/common'
import EquipmentItem from './EquipmentItem';
import { FilterForm, AddEditModal } from '@/components';
import _ from 'lodash'
import { useNavigate } from 'react-router-dom';
import UserTypeModal from '@/components/people/UserTypeModal';
import { addEquipmentsToPeople, getAvailableEquipments, getLocations } from '@/services';
import { toast } from 'react-toastify';

const AddPeopleEquipment = (props) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({
    selectedEquipments: []
  })
  const navigate = useNavigate()
  const { closeModal, onSubmitAddEquipments, availableEquipmentList, locationList, peopleData, complianceStatusList, addNewEquipment, modelName} = props;
  const { serial_number, location, status, isClearable, selectedEquipments, equipmentList, isLoading, isOpenUserTypeModal, checkedArray, lot_number } = state;

  useEffect(() => {
    if (peopleData?.id) {
      dispatch(getAvailableEquipments({ user_id: peopleData?.id , slug : modelName.toLowerCase()})).unwrap().then(res => {
        dispatch(getLocations()).unwrap().then(() => {
          if (res) setState({ ...state, equipmentList: res?.data })
        });
      })
    }
  }, [])

  useEffect(() => {
    if (location?.name || status?.id)
      handleFilter()
  }, [location, status])


  const handleFilterChange = (e, value) => setState({ ...state, [e.target.name]: value })

  const handleFilter = () => {
    let equipments = availableEquipmentList;
    if (serial_number || location || status || lot_number) {
      if (serial_number)
        equipments = _.filter(equipments, key => { return key.serial_number?.toLowerCase().trim().includes(serial_number?.toLowerCase().trim()) })
      if (location?.name)
        equipments = _.filter(equipments, key => { return key?.location?.id === location?.id })
      if (status)
        equipments = _.filter(equipments, key => { return key.compliance_status?.id === status?.id })
      if(lot_number)
        equipments = _.filter(equipments, key => { return key.lot_number?.toLowerCase().trim().includes(lot_number?.toLowerCase().trim())})

      setState({ ...state, isClearable: true, equipmentList: equipments })
    }
  }

  const handleCheck = (e, id) => {
    if (e.target.checked) {
      setState({ ...state, isOpenUserTypeModal: id, selectedEquipments: _.concat(selectedEquipments || [], [{ equipment_id: id, user_type_id: 1 }]), checkedArray: [...(checkedArray || []), id], })
    }
    else
      setState({ ...state, selectedEquipments: _.remove(selectedEquipments, (key) => { return key.equipment_id !== id; }), checkedArray: _.pull(checkedArray, id), })
  }

  const handleClick = (typeId, equipmentId) => {
    const equipments = (selectedEquipments || []).slice();
    const index = equipments.findIndex(item => item.equipment_id === equipmentId);
    if (index >= 0) equipments[index].user_type_id = typeId;
    setState({ ...state, isOpenUserTypeModal: -1, selectedEquipments: equipments })
  }

  const handleFormSubmit = () => {
    let payload = {
      user_id: peopleData?.id,
      equipments: selectedEquipments
    }
    setState({ ...state, isLoading: true })
    dispatch(addEquipmentsToPeople(payload)).unwrap().then(res => {
      if (res?.success){
        toast.success(res?.message)
        onSubmitAddEquipments();
      }
      else 
        setState({ ...state, isLoading: false })
    })
  }

  const clearFilter = () => {
    setState({ ...state, isClearable: false, location: '', serial_number: '', status: '', equipmentList: availableEquipmentList })
  }

  return (
    <>
      <AddEditModal
        show={true}
        size='xl'
        type="Add" name={`${modelName} to ${peopleData?.fname} ${peopleData?.lname}`}
        isSubmitting={isLoading}
        isDisableAddNew={false}
        isDisableSave={_.isEmpty(selectedEquipments)}
        onSubmit={() => handleFormSubmit()}
        onAddNew={() => addNewEquipment()}
        closeModal={closeModal}
      >
        <FilterForm name={modelName}
          onFilterClick={() => handleFilter()}
          isClearable={isClearable}
          onClearFilter={() => clearFilter()}
        >{ modelName === 'Medication' ?
          <Col xs={12} lg={4} className='mt-2'>
            <TextInput placeholder='Lot Number' name='lot_number' value={lot_number}
              onChange={(e) => handleFilterChange(e, e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) handleFilter() }}
            />
          </Col>
          :
          <Col xs={12} lg={4} className='mt-2'>
            <TextInput placeholder='Serial Number' name='serial_number' value={serial_number}
              onChange={(e) => handleFilterChange(e, e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) handleFilter() }}
            />
          </Col> }
          <Col xs={12} lg={4} className='mt-2'>
            <DropDown value={location?.name} placeholder='Location' name='location' data={locationList} onChange={(e) => handleFilterChange(e, JSON.parse(e.target.id))} />
          </Col>
          <Col xs={12} lg={4} className='mt-2'>
            <DropDown value={status?.name} placeholder='Status' name='status' data={complianceStatusList} onChange={(e) => handleFilterChange(e, JSON.parse(e.target.id))} />
          </Col>
        </FilterForm>
        <div className='Content border-top' style={{ height: '370px' }}>
          {!_.isEmpty(equipmentList) ?
            equipmentList.map((data, index) => {
              return (
                <Row key={index} className='d-flex flex-row border-bottom'>
                  <Col lg={'auto'} xs={'auto'} className='d-flex align-items-center justify-content-center pe-0'>
                    <input
                      type='checkbox'
                      className='regular-checkbox'
                      onClick={(e) => handleCheck(e, data.id)}
                      checked={_.includes(checkedArray, data?.id)}
                    />
                  </Col>
                  <Col>
                    <EquipmentItem item={data} />
                  </Col>
                  <UserTypeModal
                    forEquipment={data?.serial_number}
                    show={isOpenUserTypeModal === data.id}
                    closeModal={() => setState({ ...state, isOpenUserTypeModal: -1 })}
                    handleSelection={(typeId) => handleClick(typeId, data.id)}
                    userData={peopleData}
                    selectedPeople={selectedEquipments}
                    checkedPeople={checkedArray}
                  />
                </Row>
              )
            })
            : equipmentList ?
              <EmptyComponent title='Equipment' />
              :
              <div className='h-100 w-100 center'>
                <Spinner animation='border' />
              </div>
          }
        </div>
      </AddEditModal>
    </>
  )
}

function mapStateToProps(state) {
  return {
    locationList: state.location.locationList,
    availableEquipmentList: state.equipment.availableEquipmentList,
    complianceStatusList: state.location.complianceStatusList
  }
}
const actionCreators = {
  // getAvailableEquipments: (params) => (dispatch) => dispatch(getAvailableEquipments(params)),
  // addEquipmentsToPeople: (data) => (dispatch) => dispatch(addEquipmentsToPeople(data)),
  // getLocations: (data) => (dispatch) => dispatch(getLocations(data)),
}

export default connect(mapStateToProps, actionCreators)(AddPeopleEquipment);
