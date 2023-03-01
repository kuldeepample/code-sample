import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Col, Spinner, Modal } from 'react-bootstrap';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { TextInput, DropDown, CloseButton, Pressable } from '@components/common';
import { FilterForm, DeleteModal, AddEditLocation, PaginationComponent, LocationItem } from '@/components';
import { toast } from 'react-toastify';
import AddPeopleLocation from './AddPeopleLocation';
import { isNotUser } from '@/helpers';
import { addLocationsToPeople, deletePeopleLocation } from '@/services/people.service';
import { EmptyComponent } from '@/components/common'
import { getComplianceStatusList, getLocations } from '@/services';

const Location = (props) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({
    location: {},
    filter: {
      location: '',
      city: '',
      status: '',
    },
    isClearable: false,
    modalOpen: false,
    deleteModalOpen: false,
    listData: [],
    activePage: 1,
    totalItemsCount: 0,
    loading: false,
  })

  const { data, currentUser, locationList, complianceStatusList } = props;
  const { showMenu, filter, modalOpen, addLocationModal, location, deleteModalOpen, listData, isClearable, totalItemsCount, activePage, loading, onFilter, showModal, modalData, isEquipment } = state;

  useEffect(() => {
    callGetLocationList();
  }, [activePage, onFilter, isClearable])

  useEffect(() => {
    if (filter?.status?.id) {
      handleFilter()
    }
    if (!complianceStatusList)
      dispatch(getComplianceStatusList(''))
  }, [filter?.status])

  const callGetLocationList = () => {
    let payload = {
      user_id: data?.id,
      city: filter?.city || '',
      name: filter?.location || '',
      compliance_status_id: filter?.status?.id || '',
      limit: 10,
      offset: 10 * (activePage - 1) || 0
    }
    setState({ ...state, loading: true })
    dispatch(getLocations(payload)).unwrap().then(res => {
      if (res) setState({ ...state, modalOpen: false, addLocationModal: false, showMenu: undefined, loading: false, deleteModalOpen: false, listData: res?.data, totalItemsCount: res?.total })
    })
  }

  const handleFilterChange = (e, value) => setState({ ...state, filter: { ...filter, [e.target.name]: value } });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value) handleFilter()
  }

  const handleFilter = () => {
    let { location, city, status } = filter;
    if ((location || city || status?.id) && !loading)
      setState({ ...state, onFilter: !onFilter, activePage: 1, isClearable: true })
  }

  const toggleModal = item => setState({ ...state, location: item?.id ? item : {}, modalOpen: !modalOpen, showMenu: item ? false : undefined });

  const toggleDeleteModal = item => {
    setState({ ...state, deleteModalOpen: !deleteModalOpen, showMenu: item ? false : undefined, loading: false, location: item?.id ? item : {} });
  }

  const addLocationToPeople = (data) => {
    dispatch(addLocationsToPeople(data)).unwrap().then(res => {
      if (res?.success) {
        toast.success(res?.message)
        setState({ ...state, addLocationModal: false, onFilter: !onFilter })
      }
      else
        setState({ ...state, isSubmitting: false })
    })
  }

  const handleDeleteLocation = () => {
    if (location?.id) {
      setState(prev => ({ ...prev, location: { ...prev.location, isSubmitting: true } }))
      dispatch(deletePeopleLocation({ data: { user_id: `${data?.id}`, location_id: `${location?.id}` } })).unwrap().then((res) => {
        if (res.success) {
          callGetLocationList();
          toggleDeleteModal();
        }
        else {
          const isEquipment = !!res?.equipment?.serial_number;
          toggleDeleteModal();
          setState(prev => ({ ...prev, showModal: true, modalData: res, isEquipment, location: { ...prev.location, isSubmitting: false } }))
        }
      }).catch((er) => {
        setState(prev => ({ ...prev, location: { ...prev.location, isSubmitting: false } }))
        toast.error(er || 'Error in deleting Location!');
      });
    } else {
      toast.error('Location Id not found!');
    }
  }

  const clearFilter = () => !loading && setState({ ...state, filter: { location: '', city: '', status: '' }, activePage: 1, isClearable: false, listData: locationList });

  const handlePageChange = page => setState({ ...state, activePage: page });

  return (
    <>
      <FilterForm
        name='Location'
        onAddClick={(currentUser?.id === data?.id || isNotUser()) ? () => setState({ ...state, addLocationModal: true }) : false}
        onFilterClick={() => handleFilter()}
        isClearable={isClearable}
        onClearFilter={() => clearFilter()}
      >
        <Col xs={12} lg={4} className='mt-2'>
          <TextInput placeholder='Location' name='location' value={filter?.location} onChange={(e) => handleFilterChange(e, e.target.value)} onKeyDown={handleKeyDown} />
        </Col>
        <Col xs={12} lg={4} className='mt-2'>
          <TextInput placeholder='City' name='city' value={filter?.city} onChange={(e) => handleFilterChange(e, e.target.value)} onKeyDown={handleKeyDown} />
        </Col>
        <Col xs={12} lg={4} className='mt-2'>
          <DropDown value={filter?.status?.name} name='status' placeholder='Compliance Status' data={complianceStatusList}
            onChange={(e) => handleFilterChange(e, JSON.parse(e.target.id))} />
        </Col>
      </FilterForm>
      {
        !_.isEmpty(listData) && !loading ?
          <div>
            {listData.map((item, idx) =>
              <div key={'location-' + idx} className='border-top'>
                <LocationItem item={item} show={showMenu} toggleModal={() => toggleModal(item)} toggleDeleteModal={() => toggleDeleteModal(item)} />
              </div>
            )}
            {totalItemsCount > 10 && <PaginationComponent
              activePage={activePage}
              limit={10}
              totalItemsCount={totalItemsCount}
              handlePageChange={(page) => !loading && handlePageChange(page)}
            />}
          </div>
          :
          listData !== [] && loading ?
            <div className='d-flex center'>
              <Spinner animation="border" className='d-flex center' style={{ marginTop: '10%' }} />
            </div>
            :
            <EmptyComponent title="Location" />
      }

      {addLocationModal && <AddPeopleLocation closeModal={() => setState({ ...state, addLocationModal: false })}
        onSubmitAddLocations={addLocationToPeople}
        peopleData={data} />}

      {modalOpen && <AddEditLocation
        show={modalOpen}
        location={location}
        type='Edit' name='Location'
        closeModal={() => toggleModal()}
        onSuccess={() => { callGetLocationList(); toggleModal(); }}
      />}

      <DeleteModal
        show={deleteModalOpen}
        isSubmitting={location?.isSubmitting}
        name={location.name}
        closeModal={() => toggleDeleteModal()}
        messageComponent={<p className='lable mt-1 text-center C-dark'>Are you sure you want to remove <b>{location?.name}</b>?</p>}
        onClickDelete={() => handleDeleteLocation()}
      />
      {showModal &&
        <Modal show={showModal}
          size={"sm"} centered
          onHide={() => setState({ ...state, showModal: false, modalData: {} })}
          backdropClassName='bg-dark'
        >
          <Modal.Header style={{ height: '50px' }}>
            <Modal.Title className='C-primary modalHeader bold text-truncate'>Can not Remove Location</Modal.Title>
            <CloseButton onClose={() => setState({ ...state, showModal: false, modalData: {} })} />
          </Modal.Header>
          <Modal.Body className='pt-2'>
            <div className='center flex-column C-dark text-center'>
              <p className='F-16'>{modalData?.message}</p>
              <p className='F-12'>If you want to remove location, please change it from {isEquipment ? 'equipment' : 'medication'} detail</p>
              <Pressable as={Link}
                classes='mt-2'
                to={`/${isEquipment ? 'equipment' : 'medication'}/` + modalData?.equipment?.id}
                title={`Go to ${isEquipment ? `SN: ${modalData?.equipment?.serial_number}` : `LN: ${modalData?.equipment?.lot_number}`}`}
              />
            </div>
          </Modal.Body>
        </Modal>
      }
    </>
  );
}


function mapStateToProps(state) {
  return {
    locationList: state.location.locationList,
    currentUser: state.auth.user,
    complianceStatusList: state.location.complianceStatusList
  }
}
const actionCreators = {
  // getLocations: (data) => (dispatch) => dispatch(getLocations(data)),
  // deletePeopleLocation: (data) => (dispatch) => dispatch(deletePeopleLocation(data))
}

export default connect(mapStateToProps, actionCreators)(Location);