import React, { useState, useEffect } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { connect, useDispatch, useSelector } from 'react-redux';

import { TextInput, EmptyComponent } from '@components/common';
import { FilterForm, AddEditModal, AddEditLocation } from '@/components';
import _ from 'lodash';
import LocationItem from './LocationItem';
import { getAvailableLocationList, getLocations } from '@/services';

const AddPeopleLocation = (props) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({
    selectedLocations: []
  })

  const reducerData = useSelector((state) => {
    return {
      availableLocationList: state.location.availableLocationList,
      locationList: state.location.locationList,
      permissions: state.auth.licensePermissions,
    }
  })
  const { availableLocationList, locationList, permissions} = reducerData
  const { closeModal, onSubmitAddLocations, peopleData, handleSelectedLocation, modalName = '' } = props;
  const { isClearable, selectedLocations, locations, isLoading, isSubmitting, location, city, State, showModal, afterAdd, selectedItem = [] } = state;

  useEffect(() => {
    if (peopleData?.id) {
      dispatch(getAvailableLocationList({ user_id: peopleData?.id })).unwrap().then(res => {
        if (res?.success) setState({ ...state, locations: res?.data })
      })
    }
    else {
      dispatch(getLocations()).unwrap().then((res) => {
        if (res?.success) setState({ ...state, locations: res?.data })
      })
    }
  }, [afterAdd])

  const handleFilterChange = (e, value) => setState({ ...state, [e.target.name]: value })

  const handleFilter = () => {
    if (location || city || State) {
      let filteredLocations = peopleData?.id ? availableLocationList : locationList;
      if (location)
        filteredLocations = _.filter(filteredLocations, key => { return key.name.toLowerCase().trim().includes(location.toLowerCase().trim()) })
      if (city)
        filteredLocations = _.filter(filteredLocations, key => { return key.city.toLowerCase().trim().includes(city.toLowerCase().trim()) })
      if (State)
        filteredLocations = _.filter(filteredLocations, key => { return key.state.toLowerCase().trim().includes(State.toLowerCase().trim()) })
      setState({ ...state, isClearable: true, locations: filteredLocations })
    }
  }

  const handleCheck = (e, item) => {
    if (e.target.checked) setState({ ...state, selectedLocations: [...(selectedLocations || []), item.id] })
    else setState({ ...state, selectedLocations: _.pull(selectedLocations, item.id), })
  }

  const handleAddLocations = () => {
    let payload = {
      user_id: peopleData?.id,
      location_ids: selectedLocations,
      selectedItem
    }
    setState({ ...state, isSubmitting: true })
    onSubmitAddLocations(payload);
  }

  const clearFilter = () => setState({ ...state, isClearable: false, location: '', city: '', State: '', locations:  availableLocationList || locationList })

  return (
    <>
      <AddEditModal type='Add' name={`${modalName}Location`}
        show={!showModal} size='xl'
        closeModal={closeModal}
        isDisableAddNew={!permissions?.location?.canCreate}
        isDisableSave={_.isEmpty(selectedLocations) && _.isEmpty(selectedItem)}
        onSubmit={handleAddLocations}
        isSubmitting={isSubmitting}
        onAddNew={() => { setState({ ...state, showModal: true }) }}
      >
        <FilterForm
          name='Location'
          onFilterClick={() => handleFilter()}
          isClearable={isClearable}
          onClearFilter={() => clearFilter()}
        >
          <Col xs={12} lg={4} className='mt-2'>
            <TextInput placeholder='Location' name='location' value={location} onChange={(e) => handleFilterChange(e, e.target.value)} />
          </Col>
          <Col xs={12} lg={4} className='mt-2'>
            <TextInput placeholder='City' name='city' value={city} onChange={(e) => handleFilterChange(e, e.target.value)} />
          </Col>
          <Col xs={12} lg={4} className='mt-2'>
            <TextInput placeholder='State' name='State' value={State} onChange={(e) => handleFilterChange(e, e.target.value)} />
          </Col>
        </FilterForm>
        <div className={`Content d-flex flex-column ${isLoading && 'center'}`} style={{ height: '360px' }}>

          {!_.isEmpty(locations) ?
            locations.map((item, key) => {
              return (state.location !== item &&
                <Row key={key} className='d-flex flex-row border-bottom'>
                  <Col lg={'auto'} xs={'auto'} className='d-flex align-items-center justify-content-center pe-0'>
                    {modalName
                      ? <input
                        type='radio'
                        className='radio'
                        onClick={() => setState({ ...state, selectedItem: item })}
                        name='people'
                      />
                      :
                      <input
                        type='checkbox'
                        className='regular-checkbox'
                        onClick={(e) => handleCheck(e, item)}
                        checked={_.includes(selectedLocations, item?.id)}
                      />
                    }
                  </Col>
                  <Col>
                    <LocationItem item={item} onAddModal={true} />
                  </Col>
                </Row>
              )
            })
            :
            locations ?
              <EmptyComponent title='Location' onAddNew={() => { setState({ ...state, showModal: true }) }} isDisableAddNew={!permissions?.location?.canCreate} />
              :
              <div className='center' style={{ width: '98%', flex: '1' }}>
                <Spinner animation="border" />
              </div>
          }
        </div>
      </AddEditModal>

      {showModal && <AddEditLocation
        show={showModal}
        type='Add' name='New Location'
        closeModal={() => setState({ ...state, showModal: false })}
        onSuccess={() => setState({ ...state, showModal: false, afterAdd: !afterAdd })}
      />}
    </>
  )
}

function mapStateToProps(state) {
  return {
    // availableLocationList: state.location.availableLocationList,
    // locationList: state.location.locationList,
    // permissions: state.auth.licensePermissions,
  }
}
const actionCreators = {
  // getAvailableLocationList: (params) => (dispatch) => dispatch(getAvailableLocationList(params)),
  // addLocationsToPeople: (data) => (dispatch) => dispatch(addLocationsToPeople(data)),
}

export default connect(mapStateToProps, actionCreators)(AddPeopleLocation);
