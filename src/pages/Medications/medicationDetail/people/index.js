import { addUserToEquipment, deleteEquipmentUser, editEquipmentUser, getEquipmentPeopleList } from '@/services'
import PeopleComponent from '@components/people'
import React from 'react'
import { useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const People = (props) => {
  const dispatch = useDispatch()
  const { data, peopleListData } = props;

  const [state, setState] = useState({});

  let { loading, totalItemsCount } = state

  const getPeopleList = ({activePage,  ...payload}) => {
    setState({...state, loading: true})
    let params = {
      equipment_id : data?.id,
      ...payload,
      limit: 10, 
      offset: 10 * (activePage - 1),
    }
    dispatch(getEquipmentPeopleList(params)).unwrap().then((res) => {
      if(res?.success)
          setState({...state, loading: false, totalItemsCount : res?.total})
    })
  }

  const handleEditUser = ({ data, state, filter }) => {
    let payload = {
      //  equipmentUserId: data?.itemUserId || '',
       user_type_id: data?.user_type_id || '',
       user_id: data?.user_id || '',
       equipment_id: data?.itemId || ''
    }
    dispatch(editEquipmentUser({id: data?.itemUserId, data: payload})).unwrap().then((res) => {
       if (res) {
          toast.success("User type updated successfully.")
          filter(); state();
       }
       else
          toast.error(res?.message)
    })
 }
 const handleFilter = ({ payload, callback }) => {
  getPeopleList( payload );
  callback();
}

const handleDeleteUser = ({ user_id, state, filter, lastItem}) => {
  dispatch(deleteEquipmentUser(user_id)).unwrap().then((res) => {
     if (res?.success) {
        filter(lastItem); state();
     }
     else
        state(true) /* sending true for keep open modal and stop loading */
  })
}
const handleAddPeople = async ({ selectedPeople, callBack, activePage }) => {
  let payload = {
     equipment_id: data?.id,
     users: selectedPeople
  }
  await dispatch(addUserToEquipment(payload)).unwrap().then((res) => {
     if (res?.success) {
      dispatch(getEquipmentPeopleList({
           equipment_id: data?.id,
           limit: 10,
           offset: 10 * (activePage - 1)
        }))
        callBack();
     }
  })
}
  return (
    <>
      <PeopleComponent
      parentData = { data }
      handleFilter = {(data) => handleFilter(data)}
      peopleListData = {loading || peopleListData}
      handleEditUser = {(people) => handleEditUser(people)}
      handleAddPeople = {(data) => handleAddPeople(data)}
      handleDeleteUser={(people) => handleDeleteUser(people)}
      loading={loading}
      totalItems={totalItemsCount}
      getPeopleList={(props) => getPeopleList(props)}/>
    </>
  )
}


const mapStateToProps = state => {
    return {
      peopleListData: state.equipment?.equipmentPeople
    }
}

const actionCreators = {
  // getMedicationPeople: (data) => (dispatch) => dispatch(getEquipmentPeopleList(data)),
  // editMedicationUser: (data) => (dispatch) => dispatch(editEquipmentUser(data)),
  // deleteMedicationUser: (data) => (dispatch) => dispatch(deleteEquipmentUser(data)),
  // addUserToMedication: (data) => (dispatch) => dispatch(addUserToEquipment(data))
}

export default connect(mapStateToProps, actionCreators) (People);