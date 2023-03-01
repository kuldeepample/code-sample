import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import _ from 'lodash'
import { TextInput, DropDown, ReactDatePicker } from '@components/common';
import { FilterForm, AddEditModal, PaginationComponent, ActivityList } from '@/components';
import ActivityForm from './ActivityForm';
import { connect, useDispatch, useSelector } from 'react-redux'
import { activityChannel, getEquipments } from '@/helpers';
import { useParams } from 'react-router-dom';
import { addActivity, deleteActivity, editActivity, getActivityList, getLocationEquipment } from '@/services';
import { uploadFile } from '@/services/auth.service';

const Activity = (props) => {
   const dispatch = useDispatch()
   const [state, setState] = useState({
      activePage: 1,
   })
   const [dateRange, setDateRange] = useState([null, null]);
   const [startDate, endDate] = dateRange;
   const params = useParams();

   const reducerData = useSelector((state) => {
      return {
         currentUser: state.auth.user,
         equipmentList: getEquipments(state.equipment.locationEquipmentList),
         equipmentModelList: state.equipment.equipmentModelList,
      }
   })
   const { currentUser, equipmentList, equipmentModelList } = reducerData
   const { location, isActivityTab } = props
   const { formState, showModal, filter, afterAdd, isClearable, loading, name, isFetching, activePage, totalItems } = state;

   useEffect(() => {
      callGetActivityList();
      activityChannel.bind("new", function (data) {
         if (isActivityTab && data?.activity?.location_id === params.locationId) {
            callGetActivityList(true)
         }
      });
      return (() => {
         activityChannel.unbind();
      })
   }, [afterAdd, isClearable, activePage, filter])

   useEffect(() => {
      let payload = {
         sort_order: 'serial_number',
         location_id: location?.id
      }
      dispatch(getLocationEquipment(payload))
      handleFilter()
   }, [state.equipment, endDate])

   const callGetActivityList = (isAutoUpdating) => {
      if (location?.id) {
         let payload = {
            name: name,
            location_id: location?.id,
            equipment_id: state?.equipment?.id,
            startDate: startDate || '',
            endDate: endDate || '',
            limit: 10,
            offset: 10 * (activePage - 1),
         }
         setState({ ...state, isFetching: !isAutoUpdating });
         dispatch(getActivityList(payload)).unwrap().then(res => {
            setState({ ...state, totalItems: res?.total || 0, isFetching: false })
         })
      }
   }

   const handleFilterChange = (e, value) => setState({ ...state, [e.target.name]: value });

   const handleOnChange = (e, value) => setState({ ...state, formState: { ...formState, [e.target.name]: value } });

   const openAddModal = () => setState({ ...state, showModal: true });

   const handleFilter = () => {
      if ((name || state?.equipment?.id || (startDate && endDate)) && !isFetching)
         setState({ ...state, isClearable: true, filter: !filter, activePage: 1 });
   }

   const handlePageChange = (page) => setState({ ...state, activePage: page });

   const clearFilter = () => {
      setState({ ...state, name: '', equipment: {}, isClearable: false, activePage: 1 });
      setDateRange([null, null])
   }

   const handleAddActivity = async () => {
      let payload = {
         type: "manual",
         user_id: currentUser?.id,
         location_id: location?.id,
         equipment_id: formState?.equipment?.id,
         note: formState?.note
      }
      setState({ ...state, loading: true })
      let canAdd = true
      if (formState?.file) {
         let filess = new FormData();
         filess.append('file', formState?.file, formState?.file?.name);
         await dispatch(uploadFile(filess)).unwrap().then((res) => {
            if (res?.data?.url) {
               payload.file = res?.data?.url;
            }
            else canAdd = false
         })
      }
      if (canAdd) {
         dispatch(addActivity(payload)).unwrap().then((res) => {
            if (res?.success) {
               toast.success(res?.message)
               setState({ ...state, formState: {}, afterAdd: !afterAdd, loading: false, showModal: false })
            }
         })
      }
      else {
         setState({ ...state, loading: false })
         toast.error('File content too large.')
      }
   }

   return (
      <>
         <FilterForm
            name={'Activity'}
            onFilterClick={() => handleFilter()}
            onAddClick={() => openAddModal()}
            isClearable={isClearable}
            onClearFilter={() => clearFilter()}
         >
            <Col xs={12} lg={4} className='mt-2'>
               <TextInput placeholder='User Name' name='name' value={name} onChange={(e) => handleFilterChange(e, e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) handleFilter() }} />
            </Col>
            <Col xs={12} lg={4} className=' mt-2'>
               <DropDown
                  searchable
                  name='equipment'
                  value={state?.equipment?.name}
                  placeholder={'Equipment'}
                  data={equipmentList}
                  onChange={(e) => handleFilterChange(e, JSON.parse(e.target.id))}
               />
            </Col>
            <Col xs={12} lg={4} className='mt-2'>
               <ReactDatePicker
                  selectsRange={true}
                  placeholderText='Duration'
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => { setDateRange(update); }}
                  classes='text-dark Shadow'
                  isClearable
               />
            </Col>
         </FilterForm>
         <ActivityList location
            isFetching={isFetching}
            callList={() => callGetActivityList()}
         />
         {totalItems > 10 && !isFetching &&
            <PaginationComponent
               activePage={activePage}
               limit={10}
               totalItemsCount={totalItems}
               handlePageChange={(page) => !loading && handlePageChange(page)}
            />
         }

         {showModal &&
            <AddEditModal show={showModal}
               type={"Add"} name='Activity'
               closeModal={() => setState({ ...state, formState: {}, showModal: false, activeItemData: null })}
               isDisableSave={!(formState?.note && formState?.equipment?.id)}
               isSubmitting={loading}
               onSubmit={() => handleAddActivity()}
            >
               <ActivityForm
                  state={formState}
                  data={location}
                  user={currentUser}
                  equipmentList={equipmentList}
                  equipmentModelList={equipmentModelList}
                  handleOnChange={(e, value) => handleOnChange(e, value)}
               />
            </AddEditModal>
         }
      </>
   )
}

export default Activity;