import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Col, Row, Spinner } from 'react-bootstrap';
import _ from 'lodash'
import { TextInput, DropDown, EmptyComponent } from '../common';
import FilterForm from '../FilterForm';
import AddEditModal from '../AddEditModal';
import PeopleModalListItem from './PeopleModalListItem';
import UserTypeModal from './UserTypeModal';
import AddEditPeople from './AddEditPeople';
import { getAvailablePeople, getAvailableStudentList, getUserRoleList, getUsersList, getAvailableInstructorList } from '@/services';

const AddPeopleModal = (props) => {
  const dispatch = useDispatch()
  const reducerData = useSelector((state) => {
    return {
      availablePeopleList: state.people.availablePeopleList,
      permissions: state.auth.licensePermissions,
      userRoleList: state.people.userRoleList,
      usersList: state.people.usersList
    }
  })
  const { availablePeopleList, permissions, userRoleList, usersList } = reducerData
  const [state, setState] = useState({
    name: '',
    user_role: {},
    peopleList: [],
    selectedPeople: [],
    loading: false,
    isFetching: false
  })
  const { credential, handleAddPeople, closeModal, parentData, modalName, handleAddUser, course, singleSelect, limit} = props
  const { peopleList, name, user_role, isClearable, selectedPeople, modalOpen, loading, isFetching, isOpenUserTypeModal, selectedUsers } = state
  let isEquipment = parentData?.location_id !== undefined;
  const isDisable = selectedPeople?.length >= limit

  useEffect(() => {
    if(!userRoleList)
        dispatch(getUserRoleList())
    if (credential) {
      getUsers()
    } else if( modalName === 'Attendee' ) {
      getAvailableStudent()
    } else if ( modalName === 'Instructor' ) {
      getAvailableInstructor()
    }
     else if (!modalOpen)
      getRemainingPeople();
  }, [modalOpen])

  const getRemainingPeople = () => {
    let url = isEquipment ? `equipment-users/available-users?equipment_id=${parentData.id}` : `location-users/available-users?location_id=${parentData.id}`
    setState({ ...state, isFetching: true })
    dispatch(getAvailablePeople(url)).unwrap().then(res => {
      if (res?.success) {
        setState({ ...state, peopleList: res?.data, isFetching: false })
      }
    }
    )
  }

  const getUsers = () => {
    setState({ ...state, isFetching: true })
    dispatch(getUsersList()).unwrap().then((res) => {
      if (res?.success) {
        setState({ ...state, peopleList: res?.data, isFetching: false })
      }
    })
  }

  const getAvailableStudent = () => {
    setState({ ...state, isFetching: true })
    dispatch(getAvailableStudentList({course_id: course})).unwrap().then((res) => {
      if(res?.success) {
        setState({...state, peopleList: res?.data, isFetching: false})
      }else {
        setState({...state, isFetching: false})
      }
    })
  }

  const getAvailableInstructor = () => {
    setState({ ...state, isFetching: true});
    dispatch(getAvailableInstructorList({ course_id: course})).unwrap().then((res) => {
      if(res?.success){
        setState({...state, peopleList: res?.data, isFetching: false})
      } else setState({...state, isFetching: false})
    })
  }

  const handleFilterChange = (e, value) => {
    setState({ ...state, [e.target.name]: value })
  }

  const handleFilter = () => {
    let people = (credential ) ? usersList : availablePeopleList;
    if (name || user_role?.id) {
      if (name)
        people = _.filter(people, key => { return `${key.fname} ${key.lname}`.toLowerCase().trim().includes(name.toLowerCase().trim()) })
      if (user_role?.id)
        people = _.filter(people, key => { return key.user_role?.id === user_role?.id })
      setState({ ...state, isClearable: true, peopleList: people })
    }
  }

  const handlePeopleCheck = (e, id) => {
    if (e.target.checked)
      setState({
        ...state,
        isOpenUserTypeModal: isEquipment && id,
        selectedUsers: isEquipment && _.concat(selectedUsers || [], [{ user_id: id, user_type_id: 1 }]),
        selectedPeople: [...selectedPeople, id],
      })
    else
      setState({
        ...state,
        selectedPeople: _.pull(selectedPeople, id),
        selectedUsers: _.remove(selectedUsers, (key) => { return key.user_id !== id; })
      })
  }
  const handleSelectedUser = (user) => {
    setState({ ...state, selectedPeople: user })
  }
  const handleClick = (typeId, userId) => {
    const users = (selectedUsers || []).slice();
    const index = users.findIndex(item => item.user_id === userId);
    if (index >= 0) users[index].user_type_id = typeId;
    setState({ ...state, isOpenUserTypeModal: -1, selectedUsers: users })
  }

  const toggleAddNewModal = () =>{
    setState({ ...state, modalOpen: !modalOpen });
  } 

  const clearFilter = () => setState({ ...state, isClearable: false, peopleList: (credential) ? usersList : availablePeopleList, name: '', user_role: {} })

  const callHandleAddPeople = async () => {
    if (credential) {
      closeModal(selectedPeople)
    }
    else if( modalName ) {
      setState({...state, isFetching: true})
      handleAddUser( selectedPeople)
    } else {
      setState({ ...state, loading: true })
      await handleAddPeople({
        selectedPeople: isEquipment ? selectedUsers : selectedPeople,
        callBack: () => {
          closeModal()
        }
      })
    }
  }

  return (
    <>
      <AddEditModal
        show={!modalOpen}
        size='xl'
        type="Add" name={`${ modalName ? modalName :  `People to ${parentData?.name || parentData?.lot_number || parentData?.serial_number || (credential ? 'credential' : '')}`}`}
        isSubmitting={loading}
        isDisableSave={_.isEmpty(selectedPeople)}
        isDisableAddNew={!(permissions?.user?.canCreate) || isFetching}
        onSubmit={() => callHandleAddPeople()}
        onAddNew={credential ? '' : () => toggleAddNewModal()}
        closeModal={closeModal}
      >
        <FilterForm
          name='People'
          onFilterClick={() => handleFilter()}
          isClearable={isClearable}
          onClearFilter={() => clearFilter()}
        >
          <Col xs={12} lg={6} className='mt-2'>
            <TextInput placeholder='Name' name='name' value={name} onChange={(e) => handleFilterChange(e, e.target.value)} />
          </Col>
          <Col xs={12} lg={6} className='mt-2'>
            <DropDown value={user_role?.name} placeholder='User Role' name='user_role' data={userRoleList}
              onChange={(e) => handleFilterChange(e, JSON.parse(e.target.id))} />
          </Col>
        </FilterForm>
        <div className='Content' style={{ height: window.innerHeight / 2.2 }}>

          {
            !_.isEmpty(peopleList) && !isFetching ? peopleList.map((people, idx) =>
              <Row key={idx} className='d-flex flex-row border-bottom m-0 hide-scroll-bar'>
                <Col xs={1} style={{ maxWidth: '20px' }} className=' d-flex align-items-center justify-content-center p-0'>
                  {credential || singleSelect ?
                    <input
                      type='radio'
                      className='radio'
                      onClick={(e) => handleSelectedUser(people)}
                      name='people'
                    />
                    :
                    <input
                      type='checkbox'
                      disabled={ isDisable && !_.includes(selectedPeople, people.id)}
                      className={isDisable && !_.includes(selectedPeople, people.id) ? 'disable-checkbox' : "regular-checkbox" }
                      onClick={(e) => handlePeopleCheck(e, people.id)}
                      checked={_.includes(selectedPeople, people.id)}
                    />
                  }

                </Col>
                {/* <Col as={Row}> */}
                <PeopleModalListItem item={people} />
                {/* </Col> */}
                <UserTypeModal
                  show={isOpenUserTypeModal === people.id}
                  closeModal={() => setState({ ...state, isOpenUserTypeModal: -1 })}
                  handleSelection={(typeId) => handleClick(typeId, people.id)}
                  userData={people}
                  selectedPeople={selectedUsers}
                  checkedPeople={selectedPeople}
                />
              </Row>
            )
              : isFetching ?
                <div className='d-flex center' style={{ height: window.innerHeight / 2.5 }}>
                  <Spinner animation="border" />
                </div>
                :
                <EmptyComponent title='People' onAddNew={() => toggleAddNewModal()} isDisableAddNew={!(permissions?.location?.canCreate)} />
          }
        </div>
      </AddEditModal>
      {modalOpen && <AddEditPeople
        show={modalOpen}
        type='Add' name='New People'
        closeModal={() => toggleAddNewModal()}
        onSuccess={() => toggleAddNewModal()}
      />}
    </>
  )
}

function mapStateToProps(state) {

}
const actionCreators = {
  // getAvailablePeople: (url) => getAvailablePeople(url),
  // getUsersList: () => getUsersList()
}

export default connect(mapStateToProps, actionCreators)(AddPeopleModal);
