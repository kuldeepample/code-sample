import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Spinner } from 'react-bootstrap';
import _ from 'lodash';

import AddressBar from '@components/Layout/AddressBar';
import { AddEditLocation, FilterForm, DeleteModal, PaginationComponent, LocationItem } from '@/components';
import { EmptyComponent, TextInput, DropDown } from '@/components/common';

import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import '@/theme/Colors.css';
import './index.css';
import { changeDataKeys, isNotUser } from '@/helpers';
import SortField from '@/components/common/SortField';
import { deleteLocation, getComplianceStatusLevelList, getLocations } from '@/services';

const Location = (props) => {
  const [state, setState] = useState({
    showMenu: undefined,
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
    limit: 10,
    sort: { key: 'compliance_level_id', name: "Status" },
    activePage: 1,
    totalItemsCount: 0,
    loading: false,
  });
  const dispatch = useDispatch()

  const reducerData = useSelector((state) => {
    return {
      locationList: state.location.locationList,
      permissions: state.auth.licensePermissions,
      complianceStatusLevel: state.location.complianceStatusLevelList
    }
  })
  const { locationList, permissions, complianceStatusLevel } = reducerData;
  const { showMenu, filter, modalOpen, location, deleteModalOpen, listData, isClearable, activePage, limit, totalItemsCount, loading, sort, onFilter, isFetching, } = state;
  const locationParam = useLocation();
  const navigate = useNavigate();
  const sortData = [{ key: 'name', name: "Location" }, { key: 'city', name: "City" }, { key: 'compliance_level_id', name: "Status" }]

  useEffect(() => {
    callGetLocationList();
  }, [limit, activePage, onFilter, sort?.name, isClearable])

  useEffect(() => {
    if (filter?.status?.name) {
      handleFilter()
    }
    if (_.isEmpty(complianceStatusLevel))
      dispatch(getComplianceStatusLevelList())
  }, [filter?.status])

  const callGetLocationList = () => {
    let level = locationParam?.search?.substring(11);
    setState({ ...state, isFetching: true, })

    let payload = {
      city: isClearable ? filter?.city : '',
      name: isClearable ? filter?.location : '',
      // compliance_status_id: isClearable ? filter?.status?.id : '',
      limit: limit || 10,
      offset: limit * (activePage - 1) || 0,
      sort: sort?.key || '',
      compliance_status_level: filter?.status?.level || '',
      compliant_level: level === '0' ? 'danger' : level === '1' ? 'info' : level === '2' ? 'pending' : '',
    }
    let { location, city, status } = state?.filter;
    if (location || city || status)
      payload.compliant_level = '';

    dispatch(getLocations(payload)).unwrap().then(res => {
      if (res) setState({ ...state, modalOpen: false, deleteModalOpen: false, showMenu: undefined, listData: res?.data, totalItemsCount: res?.total, isFetching: false })
    })
  }
  const handleFilterChange = (e) => setState({ ...state, filter: { ...state.filter, [e.target.name]: e.target.value } });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value) handleFilter()
  }

  const handleFilter = () => {
    let { location, city, status } = state?.filter;
    if ((location || city || status?.name) && !isFetching) {
      setState({ ...state, onFilter: !onFilter, isClearable: true, activePage: 1 })
    }
  }

  const toggleModal = item => setState({ ...state, location: item?.id ? item : {}, modalOpen: !modalOpen, showMenu: item ? false : undefined });

  const toggleDeleteModal = (item) => setState({ ...state, deleteModalOpen: !deleteModalOpen, showMenu: item ? false : undefined, loading: false, location: item?.id ? item : {} });

  const handleDeleteLocation = () => {
    if (location?.id) {
      setState({ ...state, loading: true })
      dispatch(deleteLocation(location?.id)).unwrap().then((res) => {
        if (res?.success) {
          toast.success(res.message)
          toggleDeleteModal();
          callGetLocationList();
        }
        else{
          toast.error(res.message)
          setState({ ...state, loading: false })
        }
      })
    } else {
      toast.error('Something went wrong!');
    }
  }

  const clearFilter = () => {
    if (locationParam?.search) {
      navigate('/locations');
      setState({ ...state, filter: { location: '', city: '', status: '' }, isClearable: false, listData: locationList });
    } else
      setState({ ...state, filter: { location: '', city: '', status: '' }, isClearable: false, listData: locationList });
  }

  const handlePageChange = (page) => setState({ ...state, activePage: page });
  return (
    <>
      <AddressBar page={[{ name: 'Location' }]} right={<SortField sortData={sortData} sort={sort}
        handleChange={(e, value) => setState({ ...state, [e.target.name]: value, activePage: 1 })}/>}
      />
      <FilterForm
        name='Location'
        onAddClick={isNotUser() &&  toggleModal}
        isDisableAdd={!permissions?.location?.canCreate}
        onFilterClick={() => handleFilter()}
        isClearable={isClearable}
        onClearFilter={!isFetching ? clearFilter : null}
      >
        <Col xs={12} lg={4} className='mt-2'>
          <TextInput placeholder='Location' name='location' value={filter?.location} onChange={handleFilterChange} onKeyDown={handleKeyDown} />
        </Col>
        <Col xs={12} lg={4} className='mt-2'>
          <TextInput placeholder='City' name='city' value={filter?.city} onChange={handleFilterChange} onKeyDown={handleKeyDown} />
        </Col>
        <Col xs={12} lg={4} className='mt-2'>
          <DropDown
            value={filter?.status?.name}
            placeholder='Compliance Status Level'
            name='status'
            data={changeDataKeys(complianceStatusLevel, { level_name: 'name' })}
            onChange={(e) => !isFetching ? setState(prev => ({ ...prev, filter: { ...prev.filter, [e.target.name]: JSON.parse(e.target.id) } })) : null}
          />
        </Col>
      </FilterForm>
      {
        !_.isEmpty(listData) && !isFetching ?
          <div>
            {listData.map((item, idx) =>
              <LocationItem key={'location-' + idx} item={item} show={showMenu} toggleModal={() => toggleModal(item)} toggleDeleteModal={() => toggleDeleteModal(item)} />
            )}
            {totalItemsCount > 10 &&
              <PaginationComponent
                activePage={activePage}
                limit={limit}
                isLimit
                totalItemsCount={totalItemsCount}
                handlePageChange={(page) => !isFetching && handlePageChange(page)}
                handleChange={(e, value) => setState({ ...state, [e.target.name]: value, activePage: 1 })}
              />}
          </div>
          :
          !listData || isFetching ?
            <div className='center' style={{ flex: '1' }}>
              <Spinner animation="border" />
            </div>
            :
            <EmptyComponent title="Location" empty={!isClearable} onAddNew={!isClearable && toggleModal} isDisableAddNew={!permissions?.location?.canCreate} />
      }

      {modalOpen && <AddEditLocation
        show={modalOpen}
        location={location}
        type={location?.id ? 'Edit' : 'Add'} name='Location'
        closeModal={() => toggleModal()}
        onSuccess={() => { callGetLocationList(); toggleModal(); }}
      />}

      <DeleteModal
        show={deleteModalOpen}
        isSubmitting={loading || isFetching}
        name={location.name}
        closeModal={() => toggleDeleteModal()}
        messageComponent={<p className='lable mt-1 text-center C-dark'>Are you sure you want to remove <b className='text-break '>{location?.name}</b>?</p>}
        onClickDelete={() => handleDeleteLocation()}
      />
    </>
  );
}

export default Location;