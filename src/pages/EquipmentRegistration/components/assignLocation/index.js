import { useEffect, useState } from 'react';
import { Col, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify';

import { connect, useDispatch } from 'react-redux';

import _ from 'lodash'

import Footer from '../../Footer'
import LocationItem from './LocationItem';

import { AddEditLocation, FilterForm } from '@/components';
import { EmptyComponent, TextInput } from '@/components/common';
import { isNotUser } from '@/helpers';
import { getLocations } from '@/services';

const AssignLocation = (props) => {
   const dispatch = useDispatch()
   const [states, setStates] = useState({});
   const { active, state, handleChange, goBack, goForward, locationList, id, medication } = props;
   const { filter, showModal, LocationList, isLoading } = states;

   useEffect(() => {
      if (state) {
         setStates({ ...states, isLoading: true })
         dispatch(getLocations()).unwrap().then((res) => {
            setStates({ ...states, LocationList: res?.data || [], isLoading: false })
         });
      }
   }, [])

   const handleFilter = () => {
      let { location, city, state } = filter;
      if (location || city || state) {
         let filteredLocations = locationList;

         if (location)
            filteredLocations = _.filter(filteredLocations, key => { return key.name.toLowerCase().trim().includes(location.toLowerCase().trim()) })
         if (city)
            filteredLocations = _.filter(filteredLocations, key => { return key.city.toLowerCase().trim().includes(city.toLowerCase().trim()) })
         if (state)
            filteredLocations = _.filter(filteredLocations, key => { return key.state.toLowerCase().trim().includes(state.toLowerCase().trim()) })

         setStates({ ...states, LocationList: filteredLocations, filter: { ...filter, isClearable: true } });
      }
   }

   const handleFilterChange = (e, value) => setStates({ ...states, filter: { ...filter, [e.target.name]: value } });

   const closeModal = () => setStates({ ...states, showModal: false })

   const onSuccess = () => {
      dispatch(getLocations()).unwrap().then((res) => {
         setStates({ ...states, showModal: false, LocationList: res?.data || [] })
      });
   }

   const handleForward = () => {
      if (state.location)
         goForward(id)
      else
         toast.warn("Please select Loaction !")
   }
   const clearFilter = () => {
      setStates({ ...states, LocationList: props?.locationList, filter: { location: '', city: '', state: '', isClearable: false } });
   }

   return (
      <div className='h-100 d-flex flex-column justify-content-between pb-3'
         style={{ minHeight: window.innerHeight - 230 }}
      >
         <div>
            <div className='Bg-light C-primary bold ps-4 d-flex align-items-center'>Assign Location to {medication ? "Medication" : "Equipment"}</div>
            <FilterForm
               name='New Location'
               onAddClick={ isNotUser() ? () => { setStates({ ...states, showModal: true })} : false}
               onFilterClick={() => handleFilter()}
               isClearable={filter?.isClearable}
               onClearFilter={() => clearFilter()}
            >
               <Col xs={12} lg={4} className='mt-2'>
                  <TextInput placeholder='Location' name='location' value={filter?.location} onChange={(e) => handleFilterChange(e, e.target.value)} classes={filter?.location && 'C-primary bold'} onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) handleFilter() }} />
               </Col>
               <Col xs={12} lg={4} className='mt-2'>
                  <TextInput placeholder='City' name='city' value={filter?.city} onChange={(e) => handleFilterChange(e, e.target.value)} classes={filter?.city && 'C-primary bold'} onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) handleFilter() }} />
               </Col>
               <Col xs={12} lg={4} className='mt-2'>
                  <TextInput placeholder='State' name='state' value={filter?.state} onChange={(e) => handleFilterChange(e, e.target.value)} classes={filter?.state && 'C-primary bold'} onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) handleFilter() }} />
               </Col>
            </FilterForm>
            <div className={`Content d-flex flex-column`}
               style={{ height: window.innerHeight - 400, minHeight: '300px', maxHeight: window.innerHeight }}
            >
               {!_.isEmpty(state.location) && _.includes(LocationList, state.location) &&
                  <LocationItem item={state.location} state={state} setSelected={() => handleChange("location", state.location)} />
               }
               {!_.isEmpty(LocationList) && !isLoading ?
                  LocationList.map((item, key) => {
                     return (state.location !== item &&
                        <div key={key}>
                           <LocationItem item={item} state={state} setSelected={() => handleChange("location", item)} />
                        </div>
                     )
                  })
                  :
                  !locationList || isLoading ?
                     <div className='h-100 center'>
                        <Spinner animation='border' />
                     </div>
                     :
                     <EmptyComponent title='Location' />
               }
            </div>
         </div>

         <Footer active={active} goBack={() => goBack()} goForward={() => handleForward()} />
         {showModal && <AddEditLocation
            show={showModal}
            type='Add' name='New Location'
            closeModal={() => closeModal()}
            onSuccess={() => onSuccess()}
         />
         }
      </div>
   )
}
function mapStateToProps(state) {
   return {
      locationList: state.location.locationList,
   }
} const actionCreators = {
   getLocations: () => (dispatch) => dispatch(getLocations()),
}

export default connect(mapStateToProps, actionCreators)(AssignLocation);