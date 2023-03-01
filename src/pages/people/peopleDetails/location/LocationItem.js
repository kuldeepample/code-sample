import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Container, ToolTip } from '@components/common'
import { getMobile } from '@/helpers';
import { isNotUser } from '@/helpers';
import { MdOutlineLocationOn } from 'react-icons/md';

const LocationItem = (props) => {
   let { item, show, toggleModal, toggleDeleteModal, onAddModal } = props;
   return (
      <Container classes='p-2 center'>
         <Col xs={'auto'} lg={'auto'} className='p-0 center' style={{ maxWidth: '30px' }}>
            <MdOutlineLocationOn size={28} color='#c60970' />
         </Col>
         <Row as={Col} xs={11} sm={11} md={11} lg={11} className='center justify-content-between p-0 m-0'>
            <Col as={!onAddModal ? Link : Col} to={'/locations/' + item.id} xs={12} sm={12} md={12} lg={4} className='linkText'>
               <p className='itemText C-primary bold mb-1 text-truncate'>{item.name}</p>
            </Col>
            <Col className='d-fle flex-ro mt-1 mb-2' xs={12} sm={6} md={7} lg={3}>
               <p className='itemText C-818188 mb-1'>{item.address}</p>
            </Col>
            <Col xs={11} sm={6} md={5} lg={4} className=''>
               <div className='d-flex flex-row mb-1'>
                  <p className='itemText bold C-dark'><span className='text-nowrap'>Phone Number:</span> <span className='text-nowrap C-818188'>&nbsp;{getMobile(item.mobile)}</span> </p>
               </div>
            </Col>
         </Row>
         {isNotUser() && !onAddModal ?
            <Col className='d-flex justify-content-center' xs={1} lg={1}>
               <ToolTip
                  show={show}
                  options={[
                     { name: 'Edit', onClick: toggleModal },
                     { name: 'Remove', onClick: toggleDeleteModal }
                  ]}
               />
            </Col>
            :
            null}
      </Container>
   )
}
export default LocationItem;