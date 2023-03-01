import React from 'react';
import { Col, Row } from 'react-bootstrap';
import avatar from './../assets/images/default-avatar.png';
import systemAvtar from './../assets/images/sh-avtar.png'
import { Link } from 'react-router-dom';
import moment from 'moment'
// import DownloadButton from './DownloadButton';
import { ToolTip } from './common';
import { isSuperAdmin, isDistributor, isNotUser, isManager } from '@/helpers';


const ActivityItem = (props) => {
   let { item, equipment, location, people, openEditModal, openViewModal, toggleDeleteModal, 
      currentUserId, setShow, show, format='MM/DD/YYYY hh:mm' } = props;

   const getOptions = () => {
      if (item?.type === 'manual' && item?.file) {
         return download;
      }
      if (item?.type === 'incident') {
         if ((isSuperAdmin() || isDistributor() || isManager())) {
            return admin;
         }
         else if (isNotUser())
            return editView;
         else {
            return +item?.user_id === currentUserId ? editView : view;
         }
      }
      return null
   }

   let download = [{
      name: 'Download',
      fileUrl: item?.file,
      onClick: () => { setShow(false); setTimeout(() => setShow(undefined), 10) }
   }]

   let view = [{ name: 'View', onClick: () => openViewModal() }]

   let editView = [
      { name: 'Edit', onClick: () => openEditModal() },
      ...view
   ]

   let admin = [
      ...editView,
      { name: 'Remove', onClick: toggleDeleteModal }
   ]

   return (
      <Row className='d-flex flex-row justify-content-around Bg-fff border-top border-2 p-2 m-0' style={{ minHeight: '70px' }}>
         <Row as={Col} lg={11} md={11} xs={11} className='p-0'>
            <Col as={Col} lg={8} md={12} sm={12} xs={12} className='mb-2 d-flex'>
               <Col lg={4} xs={4} className='d-flex flex-column justify-content-around align-items-ceter '>
                  <p className='itemText C-818188 mb-1'>{moment(item.created_at).format(format)}</p>
                  <span className='C-primary text-capitalize'>{item?.type}</span>
               </Col>

               {equipment &&
                  <Col lg={8} md={8} sm={7} xs={12} className='d-flex pe-0 flex-row justify-content-start align-items-around text-truncate'>
                     <div className='d-flex align-items-center'>
                        <img src={item?.user ? (item?.user?.image || avatar) : systemAvtar} alt='avatar' className='avatar2 rounded-circle border' />
                     </div>
                     <div className='d-flex flex-column justify-content-evenly ms-3'>
                        <Link to={'/people/' + item?.user?.id} className='linkText'>
                           <b className='C-primary itemText '>{item?.user ? (item?.user?.fname + " " + item?.user?.lname) : "System Message"} </b>
                        </Link>
                        <b className='itemText C-818188'>{item?.user?.user_role?.name}</b>
                     </div>
                  </Col>}

               {location &&
                  <Col lg={8} md={8} sm={7} xs={12} className='d-flex pe-0 flex-row justify-content-start align-items-around text-truncate'>
                     <div className='d-flex align-items-center'>
                        <img src={item?.user ? (item?.user?.image || avatar) : systemAvtar} alt='avater' className='avatar2 rounded-circle border' />
                     </div>
                     <div className='d-flex flex-column justify-content-evenly ms-3'>
                        <Link to={'/people/' + item?.user?.id} className='linkText'>
                           <b className='C-primary itemText '>{item?.user ? (item?.user?.fname + " " + item?.user?.lname) : "System Message"}</b>
                        </Link>
                        <b className='itemText C-818188'>{item?.user?.user_role?.name}</b>
                        <Link to={`${item?.equipment?.lot_number ? '/medication' : '/equipment'}/${item?.equipment?.id}`} className='linkText'>
                           <b className='itemText C-link'>{item?.equipment?.serial_number || item?.equipment?.lot_number}</b>
                        </Link>
                     </div>
                  </Col>}

               {people &&
                  <Col lg={8} xs={8} className='d-flex pe-0 flex-row justify-content-start align-items-around text-truncate'>
                     {
                        item?.course_id ?
                        <div>
                           <div className='itemText C-primary mb-2'>Course: <span className='C-818188'>{item?.course_id}</span></div>
                           <Link  to={'/locations/' + item?.location?.id} className='linkText itemText C-primary mt-md-2'>Location: <span className='C-818188'>{item?.location?.name}</span></Link>
                        </div>
                        :
                        <>
                        <div className='d-flex align-items-center'>
                        <img src={item?.equipment?.equipment_model?.image} alt='modal' className='avatar2 border' />
                     </div>
                     <div className='d-flex flex-column justify-content-evenly ms-3 text-truncate'>
                        <Link to={'/locations/' + item?.location?.id} className='linkText'>
                           <b className='C-primary itemText '>{item?.location?.name}</b>
                        </Link>

                        {item?.equipment?.lot_number ?
                           <Link to={'/medication/' + item?.equipment?.id} className='linkText'>
                              <b className='C-primary itemText '>LN:<span className='itemText C-818188'> {item?.equipment?.lot_number}</span></b>
                           </Link>
                           :
                           <Link to={'/equipment/' + item?.equipment?.id} className='linkText'>
                              <b className='C-primary itemText '>SN:<span className='itemText C-818188'> {item?.equipment?.serial_number}</span></b>
                           </Link>
                        }
                        <b className='itemText C-link'>{item?.equipment?.equipment_model?.name}</b>
                     </div>
                        </>
                     }
                     
                  </Col>
                  }

            </Col>
            <Col lg={4} xs={12} className='d-flex justify-content-center align-items-center pe-0 '>
               <p className='d-flex C-818188 p-2 Shadow rounded w-100 noteView' style={{ maxHeight: '100px', overflowY: 'auto' }}>{item.note}</p>
               <Col lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'} className='center ps-0 '>
                  {getOptions() ?
                     <ToolTip
                        show={show}
                        options={getOptions()}
                     />
                     :
                     <div style={{ width: '30px' }}> </div>
                  }
               </Col>
            </Col>
         </Row>
      </Row>
   )
}


export default ActivityItem;