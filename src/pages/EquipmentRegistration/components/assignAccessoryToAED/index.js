import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap'
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment';
import { connect, useDispatch } from 'react-redux';

import Footer from '../../Footer'
import { DropDown, ReactDatePicker } from '@components/common'
import { AddEditModal, AccessoriesItem, AccessoriesForm, FilterForm } from '@/components';
import { getModelAccessoriesList } from '@/services/equipment.services';

const AssignAccessoryToAED = (props) => {
   const dispatch = useDispatch()
   const { active, state, handleChange, goBack, goForward, modelAccessories, id} = props;
   const [states, setStates] = useState({})
   const [showModal, setShowModal] = useState(false)
   const [formState, setFormState] = useState({})
   const stateList = [{ key: 'active', name: 'Active' }, { key: 'inactive', name: 'Inactive' }, { key: 'backup', name: 'Backup' }]
   let { model, status, startDate, endDate, isClearable, AccessoryList, filteredAccessories } = states

   useEffect(() => {
      dispatch(getModelAccessoriesList(state?.aed?.id))
   }, [])

   // useEffect(() => {
   //    let list = _.map(modelAccessories, (key) => { return { ...key.accessory_type, model_accessory_id: `${key.id}` } });
   //    setStates({ ...states, AccessoryList: list, filteredAccessories: state?.accessories || [] })
   // }, [modelAccessories, state?.accessories])
   useEffect(() => {
      setStates({...state, filteredAccessories: state.accessories})
   }, [state.accessories])

   const handleFilter = () => {
      let filteredAccessories = state?.accessories;
      if (model?.id || status?.key || startDate || endDate) {
         if (model?.id)
            filteredAccessories = _.filter(filteredAccessories, key => { return key.model_accessory_id === model?.id })
         if (status?.key)
            filteredAccessories = _.filter(filteredAccessories, key => { return key.status === status?.key })
         if (startDate)
            filteredAccessories = _.filter(filteredAccessories, key => { return moment(key.installation).format('YYYY/MM/DD') === moment(startDate).format('YYYY/MM/DD') })
         if (endDate)
            filteredAccessories = _.filter(filteredAccessories, key => { return moment(key.expiration).format('YYYY/MM/DD') === moment(endDate).format('YYYY/MM/DD') })
         setStates({ ...states, isClearable: true, filteredAccessories: filteredAccessories })
      }
   }

   const handleFilterChange = (name, value) => {
      setStates({ ...states, [name]: value })
   }

   const clearFilter = () => {
      setStates({ ...states, model: '', status: '', startDate: null, endDate: null, isClearable: false, filteredAccessories: state?.accessories || [] })
   }

   const handleFormChange = (name, value) => {
      setFormState({ ...formState, [name]: value })
   }

   const handleAddAccessories = () => {
      let accessory = {
         model: formState?.model,
         icon: formState?.model?.accessory_type?.icon,
         name: formState?.model?.name,
         location_id: state?.location?.id,
         model_accessory_id: formState?.model?.id,
         installation: formState?.installation,
         expiration: formState?.expiration,
         lot_number: formState?.lot_number,
         status: formState?.status?.key,
      }
      let accessories = state?.accessories || []
      accessories = [...accessories, accessory];
      let activeAccessories = _.filter(accessories, { status: 'active' })

      // let countBy = _.countBy(modelAccessories, "accessory_type_id");
      // let totalSlot = countBy[accessory?.model?.accessory_type?.id] || 0
      // let countActive = _.countBy(activeAccessories, (item) => item?.model?.id);
      // let plugedSlot = countActive[accessory?.model?.id] || 0

      let countBy = _.countBy(modelAccessories, "id");
      let totalSlot = countBy[accessory?.model_accessory_id] || 0
      let countActive = _.countBy(activeAccessories, "model_accessory_id");
      let plugedSlot = countActive[accessory?.model?.id] || 0
      let canAddAccessory = totalSlot >= plugedSlot;

      if (canAddAccessory) {
         handleChange('accessories', accessories)
         closeModal()
      }
      else {
         toast.warn('Oops! Slot is not available for active Accessory.')
      }
   }

   const handleForward = () => {
      if (!_.isEmpty(state?.accessories))
         goForward(id)
      else
         toast.warn('Please add accessories.')
   }

   const closeModal = () => {
      setFormState({})
      setShowModal(false)
   }

   const removeAccessory = (accessory) => {
      let newList = _.pull(state.accessories, accessory)
      let newFilteredList = _.pull(filteredAccessories, accessory)
      setStates({ ...states, filteredAccessories: newFilteredList })
      handleChange('accessories', newList)
   }

   const handleDisable = () => {
      if(formState?.model?.id && formState?.status?.key){
         // const accessory = _.find(modelAccessories, {id : +formState.model?.id})
         let attributes = _.filter(formState?.model?.accessory_type?.accessory_type_attributes, {is_show : 1, is_required: 1})
         let isDisable = attributes?.length;
         attributes?.forEach((item) => {
            if(item.is_required){
               isDisable =  formState[item.name]? isDisable - 1: isDisable
            }
         });
         return isDisable;
      }
      return true
   }

   return (
      <div className='h-100 d-flex flex-column justify-content-between pb-3'
         style={{ minHeight: window.innerHeight - 230 }}
      >
         <div>

            <div className='Bg-light C-primary bold ps-4 d-flex align-items-center'>Assign Accessories to Equipment</div>
            <FilterForm
               name='Accessory'
               onAddClick={() => { setShowModal(true) }}
               onFilterClick={() => handleFilter()}
               isClearable={isClearable}
               onClearFilter={() => clearFilter()}
            >
               <Col xs={12} lg={3} className='mt-2'>
                  <DropDown placeholder='Type' name='model'
                     value={model?.name}
                     data={modelAccessories}
                     onChange={(e) => handleFilterChange(e.target.name, JSON.parse(e.target.id))}
                  />
               </Col>
               <Col xs={12} lg={3} className='mt-2'>
                  <DropDown placeholder='State' name='status'
                     value={status?.name}
                     data={stateList}
                     onChange={(e) => handleFilterChange(e.target.name, JSON.parse(e.target.id))}
                  />
               </Col>
               <Col xs={12} lg={3} className='mt-2'>
                  <ReactDatePicker
                     placeholderText='Date of Installation'
                     selected={startDate}
                     closeOnScroll={true}
                     isClearable
                     classes='Shadow'
                     onChange={(date) => handleFilterChange('startDate', date)}
                  />
               </Col>
               <Col xs={12} lg={3} className='mt-2'>
                  <ReactDatePicker
                     placeholderText='Date of Expiration'
                     selected={endDate}
                     closeOnScroll={true}
                     isClearable
                     classes='Shadow C-primary'
                     onChange={(date) => handleFilterChange('endDate', date)}
                  />
               </Col>
            </FilterForm>

            <div className={`Content d-flex flex-column `}
               style={{ height: window.innerHeight - 400, minHeight: '300px', maxHeight: window.innerHeight }}
            >
               {!_.isEmpty(filteredAccessories) &&
                  (filteredAccessories || []).map((item, key) => {
                     return (
                        <AccessoriesItem key={key} data={item} onRemove={() => { removeAccessory(item) }} onReview={true} />
                     )
                  })
               }
            </div>
         </div>
         <Footer active={active} goBack={() => goBack()} goForward={() => handleForward()} />
         {
            showModal && (
               <AddEditModal show={showModal}
                  type='Add'
                  name='Accessories'
                  onSubmit={() => handleAddAccessories()}
                  isDisableSave={handleDisable()}
                  closeModal={() => closeModal()}
               >
                  <AccessoriesForm
                     handleFormChange={handleFormChange}
                     formState={formState}
                     state={state}
                     modelAccessories={modelAccessories}
                  />
               </AddEditModal>
            )
         }
      </div>
   )
}
function mapStateToProps(state) {
   return {
      usersList: state.location.usersList,
      modelAccessories: state.equipment.modelAccessories,
   }
}
const actionCreators = {
   // getModelAccessoriesList: (modelId) => (dispatch) => dispatch(getModelAccessoriesList(modelId)),
}
export default connect(mapStateToProps, actionCreators)(AssignAccessoryToAED);