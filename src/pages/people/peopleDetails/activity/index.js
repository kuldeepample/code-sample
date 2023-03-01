import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { DropDown, ReactDatePicker } from '@/components/common'
import { FilterForm, AddEditModal, PaginationComponent, ActivityList } from '@/components';
import ActivityForm from './ActivityForm';
import { connect, useDispatch } from 'react-redux'
import { getEquipments } from '@/helpers';
import { useParams } from 'react-router-dom';
import { activityChannel } from "@/helpers";
import { addActivity, getActivityList, getLocations } from '@/services';
import { uploadFile } from '@/services/auth.service';
import { getEquipmentList } from '@/services';

const Activity = (props) => {
   const dispatch = useDispatch()
   const params = useParams();
   const [state, setState] = useState({
      activePage: 1,
   })
   const [dateRange, setDateRange] = useState([null, null]);
   const [startDate, endDate] = dateRange;

   const { data, currentUser, isActivityTab } = props
   const { formState, showModal, onFilter, afterAdd, isClearable, location, equipment, loading,
      isLoading, activePage, totalItems, activeLocation,
      allLocations = [],
      allEquipments = [], } = state;

   useEffect(() => {
      callGetActivityList();
      activityChannel.bind("new", function (data) {
         if (isActivityTab && data?.activity?.user_id === params.peopleId) {
            callGetActivityList()
         }
      });
      return (() => {
         activityChannel.unbind();
      })
   }, [afterAdd, isClearable, activePage, onFilter])

   useEffect(() => {
      if ((startDate && endDate) || equipment?.id || location?.id) {
         handleFilter()
      }
   }, [equipment, endDate, location])

   useEffect(() => {
      dispatch(getEquipmentList({ user_id: data?.id, sort_order: 'serial_number' })).unwrap().then(res => {
         const equipment =  getEquipments(res?.data) 
         let arr = [];
         let location = []
         equipment.forEach((item) => {
            (!arr.includes(item?.location?.id)) && location.push(item?.location)
            arr = [...arr, item?.location?.id];
         })
         setState(prev => ({ ...prev, allEquipments: equipment, activeLocation: location}))
      });
      dispatch(getLocations({ user_id: data?.id })).unwrap().then(res => setState(prev => ({ ...prev, allLocations: res?.data })));
   }, [])

   const callGetActivityList = (isAutoUpdating) => {
      if (data?.id) {
         let payload = {
            user_id: data?.id,
            location_id: location?.id,
            equipment_id: equipment?.id,
            startDate: startDate || '',
            endDate: endDate || '',
            limit: 10,
            offset: 10 * (activePage - 1),
         }
         setState({ ...state, isLoading: !isAutoUpdating })
         dispatch(getActivityList(payload)).unwrap().then((res) => {
            setState({ ...state, totalItems: res?.total || 0, isLoading: false })
         })
      }
   }

   const handleFilterChange = (e, value) => setState({ ...state, [e.target.name]: value })

   const handleOnChange = state => setState(prev => ({ ...prev, formState: state }))

   const openAddModal = () => setState({ ...state, showModal: true })

   const handlePageChange = (page) => setState({ ...state, activePage: page });

   const handleFilter = () => {
      if (location?.id || equipment?.id || endDate)
         setState({ ...state, isClearable: true, onFilter: !onFilter })
   }

   const clearFilter = () => {
      setState({ ...state, location: {}, equipment: {}, isClearable: false })
      setDateRange([null, null])
   }

   const handleAddActivity = async () => {
      let payload = {
         type: "manual",
         user_id: data?.id,
         location_id: formState?.location?.id,
         equipment_id: formState?.equipment?.id,
         note: formState?.note
      }
      setState({ ...state, loading: true })
      let canAdd = true
      if (formState?.file) {
         let filess = new FormData();
         filess.append('file', formState?.file, formState?.file?.name);
         await dispatch(uploadFile(filess)).unwrap().then((res) => {
            if (res?.url) {
               payload.file = res.url;
            }
            else canAdd = false
         })
      }
      if (canAdd) {
         dispatch(addActivity(payload)).unwrap().then((res) => {
            if (res?.success)
               setState({ ...state, formState: {}, afterAdd: !afterAdd, loading: false, showModal: false })
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
            onAddClick={(currentUser?.id === data?.id) && openAddModal}
            isClearable={isClearable}
            onClearFilter={() => !isLoading && clearFilter()}
         >
            <Col xs={12} lg={4} className='mt-2'>
               <DropDown
                  searchable
                  name='location'
                  value={location?.name}
                  placeholder='Location'
                  data={allLocations}
                  onChange={(e) => handleFilterChange(e, JSON.parse(e.target.id))}
               />
            </Col>
            <Col xs={12} lg={4} className=' mt-2'>
               <DropDown
                  searchable
                  name='equipment'
                  value={equipment?.name}
                  placeholder={'Equipment'}
                  data={allEquipments}
                  onChange={(e) => handleFilterChange(e, JSON.parse(e.target.id))}
               />
            </Col>
            <Col xs={12} lg={4} className='mt-2'>
               <ReactDatePicker
                  selectsRange
                  placeholderText='Duration'
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => { setDateRange(update); }}
                  classes='text-dark Shadow'
                  isClearable
               />
            </Col>
         </FilterForm>
         <ActivityList people
            isFetching={isLoading}
            callList={() => callGetActivityList()}
         />
         {(totalItems > 10 && !isLoading) &&
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
               closeModal={() => setState({ ...state, formState: {}, showModal: false })}
               isDisableSave={!(formState?.note && formState?.equipment?.id && formState?.location?.id)}
               isSubmitting={loading}
               onSubmit={() => handleAddActivity()}
            >
               <ActivityForm
                  state={formState}
                  data={data}
                  user={currentUser}
                  equipmentList={allEquipments}
                  locationList={activeLocation}
                  handleOnChange={state => handleOnChange(state)}
               />
            </AddEditModal>
         }
      </>
   )
}

function mapStateToProps(state) {
   return {
      currentUser: state.auth.user,
   }
}
const actionCreators = {
   // addActivity: (data) => (dispatch) => dispatch(addActivity(data)),
   // uploadFile: (data) => (dispatch) => dispatch(uploadFile(data)),
   // getActivityList: (data) => (dispatch) => dispatch(getActivityList(data)),
   // getEquipmentList: (data) => (dispatch) => dispatch(getEquipmentList(data)),
   // getLocations: (data) => (dispatch) => dispatch(getLocations(data))
};
export default connect(mapStateToProps, actionCreators)(Activity);