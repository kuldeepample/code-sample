import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar from '@images/avatar1.png'

import { ToolTip } from '@components/common';
import { getMobile, isNotUser } from 'helpers';
import { FaRegUser } from 'react-icons/fa';
import { MdOutlineMail } from 'react-icons/md';
import IconComponent from '../IconComponent';

const PeopleItem = (props) => {
   let { item, showMenu, user_type, onClickEdit, onClickDelete, isMainList } = props;

   return (
      <div className={`m-0 Bg-fff rounded d-flex flex-row mt-2 Shadow overflow-hidden`} >
         <div className={`Bg-${item?.danger ? 'danger' : item?.warning ? 'warning' : 'success'} p-0`} style={{ minWidth: '12px' }} ></div>
         <Row as={Col} className='p-2 m-0'>
            <Col xs={isNotUser() ? 11 : 12} as={isNotUser() ? Link : 'row'} to={'/people/' + item.id} className="linkText p-0">
               <Row className='m-0 p-0 d-flex flex-row justify-content-between'>
                  <Col xs={'auto'} md={'auto'} className='ps-0 center'>
                     <Image src={item.image || avatar} alt='avatar' roundedCircle className='avatar B-primary me-1' />
                  </Col>
                  <Row as={Col} xs={11} md={11} lg={11} className='center justify-content-between p-0'>
                     <Col as={Row} xs={12} md={11} lg={4} className='center justify-content-start m-0'>
                        <Col xs={12} md={12} lg={6} className='p-0'>
                           <p className='itemText C-primary bold text-truncate'>{item.fname} {item?.lname}</p>
                        </Col>
                        <Col className='d-flex p-0' xs={12} md={12} lg={6}>
                           <FaRegUser className='C-primary me-1' size={18} />
                           <p className='itemText C-818188'>
                              {user_type
                                 ? user_type?.name
                                 : item?.user_role?.name
                              }
                           </p>
                        </Col>
                     </Col>
                     <Col as={Row} xs={12} md={11} lg={8} className='center justify-content-start m-0'>
                        <Col className='d-flex align-items-center p-0' xs={12} md={12} lg={4}>
                           <MdOutlineMail className='C-primary me-1' size={20} />
                           <p className='itemText C-818188 text-truncate'> {item?.email}</p>
                        </Col>
                        <Col xs={5} md={6} lg={3}>
                           {isMainList
                              ? <div className={`${item?.status}Status`}>{item.status}</div>
                              : <div className='itemText C-818188 text-truncate'>{getMobile(item?.mobile)}</div>
                           }
                        </Col>
                        <Col xs={7} md={6} lg={5}>
                           <IconComponent data={item} />
                        </Col>
                     </Col>
                  </Row>
               </Row>
            </Col>
            {isNotUser() ?
               <Col className='center justify-content-end' xs={1} sm={1} lg={1}>
                  <ToolTip
                     show={showMenu}
                     options={[
                        { name: 'Edit', onClick: onClickEdit },
                        { name: 'Remove', onClick: onClickDelete }
                     ]}
                  />
               </Col>
               : null
            }
         </Row>
      </div>
   )
}
export default PeopleItem;