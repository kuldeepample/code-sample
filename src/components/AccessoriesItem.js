import { Row, Col } from 'react-bootstrap';
import moment from 'moment'
import { getAccessoryColor, getExpirationDate } from 'helpers';
import { CloseButton, ToolTip } from './common';

const AccessoriesItem = (props) => {
   let { installation, expiration, status, icon, name } = props.data;
   const isPng = icon?.includes('.png') ||  icon?.includes('.svg');

   return (
      <Row className={`inspection-item d-flex flex-row Bg-fff border-top border-2 align-items-center justify-content-around C-818188 m-0 ${props.classes}`}>
         <Col lg={1} md={1} sm={1} xs={2} className='pe-0'>
            <img src={icon} alt='modal'
               className={`inspection-icons me-2 accessory-${isPng ? getAccessoryColor(expiration): ''}`}
            />
         </Col>
         <Row as={Col} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'} className='m-0 p-0'>
            <Col lg={3} md={6} sm={6} xs={12} className='d-flex flex-row F-14'><b className='text-truncate itemText'>{name}</b></Col>
            <Col lg={2} md={6} sm={6} xs={12} className='C-success F-14 text-capitalize text-nowrap'><b className='C-818188 itemText'>State: </b>{status}</Col>
            <Col lg={3} md={6} sm={6} xs={12} className='C-818188 F-14 text-truncate'><b className='itemText'>Installed: </b>{installation && moment(installation).format('MM/DD/YYYY')}</Col>
            <Col lg={4} md={6} sm={6} xs={12} className='C-818188 F-14'><b className='itemText'>Expires: </b>{getExpirationDate(expiration)}</Col>
         </Row>
         {!props?.onReview &&
            <Col lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
               <ToolTip
                  show={props?.show}
                  options={[{ name: 'Edit', onClick: props.onEdit }, { name: 'Detail', onClick: props.showDetail }]}
               />
            </Col>}
         {props.onRemove && <Col lg={1} md={1} sm={1} xs={'auto'} className='center'>
            <CloseButton onClose={props.onRemove} />
         </Col>}
      </Row>
   )
}
export default AccessoriesItem;