import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ToolTip } from '@components/common';
import { isNotUser } from 'helpers';
import IconComponent from './IconComponent';
import { MdOutlineLocationOn } from 'react-icons/md';

const LocationItem = (props) => {
   let { item, show, toggleModal, toggleDeleteModal } = props;
   return (
      <div className={`m-0 Bg-fff rounded d-flex flex-row mt-2 Shadow overflow-hidden`} >
         <div className={`Bg-${item?.danger ? 'danger' : item?.warning ? 'warning' : 'success'} p-0`} style={{ minWidth: '10px' }} ></div>
         <Row as={Col} className='p-2 ps-0 m-0'>
            <Col xs={isNotUser() ? 11 : 12} as={Link} to={'/locations/' + item.id} className="linkText p-0">
               <Row className='m-0 p-0'>
                  <Col xs={1} md={1} className='p-0' style={{ maxWidth: '30px' }}>
                     <MdOutlineLocationOn size={28} color='#c60970'/>
                  </Col>
                  <Col as={Row} xs={11} md={11} className='center justify-content-start'>
                     <Col xs={12} md={4} className=''>
                        <p className='itemText C-primary bold text-truncate'>{item.name}</p>
                     </Col>
                     <Col className='d-flex' xs={12} md={5}>
                        <p className='itemText C-818188 location-address'>{item.address} {item.address2} {item.city} {item.state} {`${item.zip || '-'}`}</p>
                     </Col>
                     <Col xs={10} sm={6} md={3} className='center'>
                        <IconComponent data={item} />
                     </Col>
                  </Col>
               </Row>
            </Col>
            {isNotUser() ?
               <Col className='center justify-content-end px-0' xs={1} sm={1} lg={1}>
                  <ToolTip
                     show={show}
                     options={[
                        { name: 'Edit', onClick: toggleModal },
                        { name: 'Remove', onClick: toggleDeleteModal }
                     ]}
                  />
               </Col>
               : null
            }
         </Row>
      </div>
   )
}
export default LocationItem;