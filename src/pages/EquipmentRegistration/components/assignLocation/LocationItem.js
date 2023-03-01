import { Row, Col, Form } from 'react-bootstrap';
import { getMobile } from '@/helpers';
import { MdOutlineLocationOn } from 'react-icons/md';
import '../../index.css'

const LocationItem = (props) => {
   let { item, state, setSelected, classes } = props;
   const { id, name, address, address2, city, zip, mobile } = item
   return (
      <Form>
         <Form.Group>
            <Row for={`radio-${id}`} as={Form.Label} className={`p-2 m-0 d-flex align-items-center flex-row border-top ${classes} `} style={{ minHeight: '68px' }}>
               <Col xs={'auto'} sm={1} lg={1} style={{ maxWidth: '45px' }} className='center' >
                  <Form.Check
                     name="location"
                     type='radio'
                     checked={state.location ? id === state.location.id : false}
                     id={`radio-${id}`}
                     onClick={setSelected}
                  />
               </Col>
               <Row as={Col} xs={'auto'} sm={11} lg={11} className='m-0'>
                  <Col xs={12} sm={11} lg={4} className='d-flex flex-row align-items-center'>
                     <MdOutlineLocationOn size={28} color='#c60970' className='me-2' />
                     <p className='itemText C-primary bold mb-1 text-truncate'>{name}</p>
                  </Col>
                  <Col xs={12} sm={9} lg={4} >
                     <p className='itemText C-818188 mb-1 activity-note'>{address} {address2} {city} {item?.state} {zip} </p>
                  </Col>
                  <Col xs={12} sm={3} lg={3} >
                     <p className='itemText C-818188'>{getMobile(mobile)}</p>
                  </Col>
               </Row>
            </Row>
         </Form.Group>
      </Form>
   )
}
export default LocationItem;