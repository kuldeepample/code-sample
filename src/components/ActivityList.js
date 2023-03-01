import { Spinner, Row, Form } from 'react-bootstrap'
import _ from 'lodash'
import { EmptyComponent } from '@components/common';
import { ActivityItem } from '@/components';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { AddEditModal, IncidentInfo, DeleteModal } from '@/components';
// import { getActivityDetails, deleteActivity, editActivity } from 'actions'
import { toast } from 'react-toastify';
import IncidentForm from '@pages/equipment/equipmentDetail/activity/IncidentForm';
import { deleteActivity, editActivity, getActivityDetails } from '@/services';


const ActivityList = (props) => {
   let { isFetching, equipment, location, people, isClearable, onAddNew, callList } = props;

   const dispatch = useDispatch()
   const activityData = useSelector((state) => {
      return {
         currentUserId: state.auth.user?.id,
         activityList: state.location.activityList,
      }
   })
   const { currentUserId , activityList } = activityData
   const [state, setState] = useState({})
   const {
      detailModal,
      loading,
      formValues,
      incidentName,
      activityId,
      deleteModal,
      editModal,
      formData,
      show
   } = state;

   const setShow = (show) => setState({ ...state, show });

   const openModal = (item, modalState) => {
      setState({ ...state, [modalState]: true, loading: true, show: false })
      dispatch(getActivityDetails(item.id)).unwrap().then((res) => {
         if (res?.success) {
            setState({
               ...state, formValues: res?.data?.user_form?.form_values,
               formData: res?.data?.user_form?.form,
               incidentName: res?.data?.note,
               loading: false,
               show: undefined,
               activityId: item.id,
               [modalState]: true
            })
         }
         else {
            setState({ ...state, loading: false, [modalState]: false })
            toast.warn(res?.message);
         }
      })
   }

   const toggleDeleteModal = (item) => {
      setState({ ...state, deleteModal: !deleteModal, activityId: item?.id, show: item?.id && false })
   }

   const handleEditIncident = (e) => {
      setState({ ...state, loading: true });
      e.preventDefault();
      let payload = {
         form_id: formData?.id,
         status: 'active',
         form_values: formValues,
         type: 'incident',
         note: incidentName,
      }
      dispatch(editActivity({id: activityId, data: payload})).unwrap().then((res) => {
         if (res?.success) {
            setState({ ...state, loading: false, editModal: false, formValues: [], incidentName: '' })
            callList()
         }
         else
            setState({ ...state, loading: false })
      })
   }

   const deleteActivityItem = () => {
      setState({ ...state, loading: true })
      dispatch(deleteActivity(activityId)).unwrap().then((res) => {
         if (res?.success) {
            toggleDeleteModal();
            callList();
            toast.success(res?.message || "Item removed successfully")
         }
         else {
            toast.error(res?.message || "Item does not removed")
            setState({ ...state, loading: false })
         }
      })
   }

   const handleIncidentFormChange = (elementId, value, parent) => {
      if (elementId) {
         let values = _.cloneDeep(formValues);
         let elementIndex = _.findIndex(values, { form_element_id: `${elementId}` });
         if (elementIndex !== -1)
            values[elementIndex].value = value;
         else
            values.push({
               form_element_id: `${elementId}`,
               value: value
            })
         if (value === 'no' && parent?.type === 'radio') {
            let childrenIds = parent.elements.map(e => e.id)
            values = values.filter((item) => !childrenIds.includes(item?.form_element_id))
         }
         setState({ ...state, formValues: values });
      }
      else {
         /* value as an event of TextInput component */
         setState({ ...state, [value.target.name]: value.target.value });
      }
   }

   return (
      <>
         {!_.isEmpty(activityList) && !isFetching ?
            activityList?.map((item, key) => {
               return (
                  <ActivityItem
                     key={key}
                     show={show}
                     item={item}
                     people={people}
                     setShow={setShow}
                     location={location}
                     equipment={equipment}
                     currentUserId={currentUserId}
                     openViewModal={() => openModal(item, 'detailModal')}
                     openEditModal={() => openModal(item, 'editModal')}
                     toggleDeleteModal={() => toggleDeleteModal(item)}
                  />
               )
            })
            : isFetching ?
               <Row style={{ zIndex: 1, opacity: 0.8, flex: '1' }} className='center'>
                  <Spinner animation='border' />
               </Row>
               : _.isEmpty(activityList) &&
               <EmptyComponent title='Activity' onAddNew={!isClearable && onAddNew} />
         }

         <AddEditModal
            size='lg'
            name='Incident Detail'
            show={detailModal}
            scrollable
            isSubmitting={loading}
            closeModal={() => setState({ ...state, detailModal: false, formValues: [], incidentName: '' })}
         >
            <IncidentInfo
               formValues={formValues}
               incidentName={incidentName}
               formElements={formData?.form_elements}
            />
         </AddEditModal>


         <AddEditModal
            size={'lg'}
            type='Edit' name='Incident'
            show={editModal}
            isSubmitting={loading}
            closeModal={() => setState({ ...state, editModal: false, formValues: [], incidentName: '', show: undefined })}
         >
            <Form id={"incidentForm"} onSubmit={(e) => handleEditIncident(e)}>
               <IncidentForm handleChange={handleIncidentFormChange} states={state} />
            </Form>
         </AddEditModal>

         <DeleteModal
            show={deleteModal}
            isSubmitting={loading}
            closeModal={() => toggleDeleteModal()}
            messageComponent={<p className='lable mt-1 text-center'>Are you sure you want to remove Incident </p>}
            onClickDelete={() => deleteActivityItem()}
         />

      </>
   )
}

export default ActivityList;