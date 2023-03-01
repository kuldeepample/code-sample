import React, { useState } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import avatar from '@images/default-avatar.png';
import _ from 'lodash'
import Pressable from '@/components/common/Pressable';
import UserTypeModal from '@/components/people/UserTypeModal';
import { getMobile } from '@/helpers';
import { useSelector } from 'react-redux';

const UserList = (props) => {

   const [userTypeModal, setUserTypeModal] = useState(false)
   let { listData, handleChange, state, display, onReview } = props
   const userTypes = useSelector((state) => state.people.userTypes)

   if (state && !_.isEmpty(state.users) ) {
      let part = _.partition(listData, (key) => {
         let array = _.filter(state.users, (i) => { return i.id === key.id });
         return _.size(array) === 1
      });
      listData = _.concat(part[0], part[1])
   }
   const handleCheck = (e, id) => {
      if (e.target.checked) {
         setUserTypeModal(id)
      }
      else {
         handleChange(e.target.name, _.remove(state.users, (key) => { return key.id !== id; }))
         handleChange("checkArray", _.pull(state.checkArray, id))
      }
   }

   const getTitle = (id) => {
      let user = state?.users?.find((item) => item.id === id);
      if (!_.isEmpty(state.users) &&  state?.users.find((item) => item.id === id) && user.user_type_id){
         let type = userTypes?.find((type) => type.id === user.user_type_id);
          return type?.name + ' User';
      } else return 'Primary User'
   }

   const handleClick = (typeId, userId) => {
      let user = state?.users;
      const index = user?.findIndex(item => item.id === userId);
      if (index >= 0) {
         user[index].user_type_id = typeId;
      }
      else{
        user = _.concat(user || [], [{ id: userId, user_type_id: typeId }])
      }
      handleChange("checkArray", _.concat(state.checkArray || [], [userId]))
      handleChange("users", user)
      setUserTypeModal(-1)
   }

   return (
      <div>
         {
            listData && listData.map((item, key) => {
               return (
                  <Row key={key}
                     className={`p-2 ps-4 pe-4 m-0 mt-2 Bg-fff d-flex flex-row justify-content-between align-items-center border-top ${onReview && key === 1 ? '' : 'border-none'}`}
                     style={{ minHeight: '70px' }}
                  >
                     <label>
                        <Row>
                           <Col xs={2} sm={1} lg={1} className='d-flex justify-content-around align-items-center'>
                              <input type='checkbox' className='regular-checkbox me-1'
                                 name='users'
                                 disabled={onReview}
                                 style={{ display: display }}
                                 onClick={(e) => handleCheck(e, item.id)}
                                 checked={_.includes(state.checkArray, item.id)}
                              />
                              <div className='avatar ms-1'>
                                 <Image src={item?.image || avatar} alt='avatar' className='avatar rounded-circle border' />
                              </div>
                           </Col>
                           <Col as={Row} lg={11} md={11} sm={11} xs={10} className='d-flex flex-row justify-content-between align-items-center pe-0 ms-1'>
                              <Col lg={3} md={12} sm={12} xs={'auto'} className='itemText C-primary bold text-truncate'>{item?.fname || ''} {item?.lname || ''}</Col>
                              <Col lg={2} md={7} sm={8} xs={'auto'} className='itemText C-818188 collapseble'>{item?.user_role?.name || 'NA'}</Col>
                              <Col lg={2} md={4} sm={4} xs={12} className='itemText C-818188'>{getMobile(item?.mobile) || 'NA'}</Col>
                              <Col lg={3} md={7} sm={8} xs={12} className='itemText C-818188 collapseble'>{item?.email || 'NA'}</Col>
                              <Col lg={2} md={4} sm={4} xs={12} className='itemText C-818188 ps-0'>
                                 <Pressable
                                    title={getTitle(item.id)}
                                    classes='C-link Bg-fff shadow-none'
                                    onPress={() => setUserTypeModal(item.id)}
                                    disabled={!_.includes(state.checkArray, item.id) || onReview}
                                 />

                              </Col>
                           </Col>
                        </Row>
                     </label>
                     <UserTypeModal
                        show={userTypeModal === item.id}
                        closeModal={() => setUserTypeModal(-1)}
                        handleSelection={(typeId) => handleClick(typeId, item.id)}
                        userData={item}
                        userTypes={userTypes}
                        selectedPeople={state.users}
                        checkedPeople={state.checkArray}
                     />
                  </Row>
               )
            })

         }

      </div>
   )
}
export default UserList;