import { useState, useEffect } from 'react';
import { Col, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify';

import _ from 'lodash'
import { connect, useDispatch, useSelector } from 'react-redux';

import Footer from '../../Footer'
import UserList from './UserList';
import FilterForm from '@components/FilterForm'
import { TextInput, DropDown, EmptyComponent } from '@/components/common'
import AddEditPeople from '@/components/people/AddEditPeople';
import { isNotUser } from '@/helpers';
import { getUserRoleList, getUsersList, getUserTypes } from '@/services';

const AddUserToAED = (props) => {
   const dispatch = useDispatch()
   const { active, state, handleChange, goBack, goForward, id, medication } = props;
   const reducerData = useSelector((state) => {
      return {
         permissions: state.auth.licensePermissions,
         usersList: state.people.usersList,
         userRoleList: state.people.userRoleList,
         userTypes: state.people.userTypes
      }
   })
   const { permissions, usersList, userRoleList, userTypes } = reducerData
   const [filter, setFilter] = useState({})
   const [listData, setUsersList] = useState(usersList)
   const [showModal, setShowModal] = useState(false)
   const [isLoading, setLoading] = useState(false)

   let { uName, email, user_role } = filter
   useEffect(() => {
      if (state && !state.users) {
         setLoading(true)
         dispatch(getUsersList()).unwrap().then((res) => {
            if (res?.success) {
               setUsersList(res?.data)
            }
            setLoading(false);
         });
      }
      if (_.isEmpty(userRoleList))
         dispatch(getUserRoleList())
      if (_.isEmpty(userTypes))
         dispatch(getUserTypes())
   }, [])


   const handleFilter = () => {
      if (uName || email || user_role) {
         setFilter({ ...filter, "isClear": true })
         let filteredUsers = usersList;

         if (uName)
            filteredUsers = _.filter(filteredUsers, key => { return `${key.fname} ${key.lname}`.toLowerCase().trim().includes(uName.toLowerCase().trim()) })
         if (email)
            filteredUsers = _.filter(filteredUsers, key => { return key.email.toLowerCase().trim().includes(email.toLowerCase().trim()) })
         if (user_role)
            filteredUsers = _.filter(filteredUsers, key => { return key.user_role.name.toLowerCase().trim() === user_role.toLowerCase().trim() })

         setUsersList(filteredUsers)
      }
   }

   const handleFilterChange = (e, value) => setFilter({ ...filter, [e.target.name]: value })

   const clearFilter = () => {
      setFilter({ uName: '', email: '', user_role: '', isClear: false })
      setUsersList(usersList)
   }
   const toggleModal = () => setShowModal(!showModal)

   const handleForward = () => {
      if (!_.isEmpty(state.users)) goForward(id)
      else toast.warn('Please select users !')
   }

   const permission = permissions?.user?.canCreate

   return (
      <div className='h-100 d-flex flex-column justify-content-between pb-3'
         style={{ minHeight: window.innerHeight - 230 }}
      >
         <div>

            <div className='Bg-light C-primary ps-4 bold d-flex align-items-center'>Add User to {medication ? "Medication" : "Equipment"}</div>
            <FilterForm
               name='New User'
               onAddClick={isNotUser() && permission && toggleModal}
               onFilterClick={() => handleFilter()}
               isClearable={filter?.isClear}
               onClearFilter={() => clearFilter()}
            >
               <Col xs={12} lg={4} className='mt-2'>
                  <TextInput placeholder='User Name' name='uName' value={uName} onChange={(e) => handleFilterChange(e, e.target.value)} classes={uName && 'C-primary bold'} />
               </Col>
               <Col xs={12} lg={4} className='mt-2'>
                  <TextInput placeholder='Email' name='email' value={email} onChange={(e) => handleFilterChange(e, e.target.value)} classes={email && 'C-primary bold'} />
               </Col>
               <Col xs={12} lg={4} className='mt-2'>
                  <DropDown value={user_role} name='user_role' placeholder='User Role' data={userRoleList} onChange={(e) => handleFilterChange(e, e.target.text)} classes={user_role && 'C-primary bold'} />
               </Col>
            </FilterForm>
            <div className={`Content flex-column ${isLoading && 'center'}`}
               style={{ height: window.innerHeight - 400, minHeight: '300px', maxHeight: window.innerHeight }}>
               {isLoading ?
                  <Spinner animation="border" className='d-flex align-self-center' />
                  :
                  _.isEmpty(listData) ?
                     <div className='h-100 center'>
                        <EmptyComponent title='People' />
                     </div>
                     :
                     <UserList listData={listData} handleChange={handleChange} state={state} />
               }
            </div>
         </div>
         <Footer active={active} goBack={() => goBack()} goForward={() => handleForward()} />

         {showModal &&
            <AddEditPeople
               type='Add' name="New User"
               show={showModal}
               closeModal={() => toggleModal()}
               onSuccess={() => {
                  dispatch(getUsersList()).unwrap().then(res => {
                     if (res?.success) {
                        setUsersList(res?.data)
                        toggleModal();
                     }
                  })
               }}
            />}
      </div>
   )
}
function mapStateToProps(state) {

}
const actionCreators = {
   // getUsersList: () => (dispatch) => dispatch(getUsersList()),
   // getUserRoleList: () => (dispatch) => dispatch(getUserRoleList()),
   // getUserTypes: () => (dispatch) => dispatch(getUserTypes())
};
export default connect(mapStateToProps, actionCreators)(AddUserToAED);