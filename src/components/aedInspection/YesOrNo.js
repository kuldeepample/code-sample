import { Col, Form, Row } from 'react-bootstrap'
const YesOrNo = (props) => {
   let { name, handleChange, checked, onDocForm } = props
   return (
      <Col as={Row} lg={onDocForm ? 8 : 4} md={4} sm={4} xs={onDocForm ? 4 : 3} className='d-flex align-items-center h-100 justify-content-end p-0 mt-1'>
         <Col lg={'auto'} sm={6} xs={onDocForm ? 6 : 12}>
            <Form.Check
               inline
               label='Yes'
               name={name}
               type='radio'
               checked={checked}
               id={`radio-${name}0`}
               onClick={(e) => handleChange(true)}
            />
         </Col>
         <Col lg={'auto'} sm={6} xs={onDocForm ? 6 : 12}>
            <Form.Check
               inline
               label='No'
               name={name}
               type='radio'
               checked={checked === false ? true : ''}
               id={`radio-${name}1`}
               onClick={(e) => handleChange(false)}
            />
         </Col>
      </Col>
   )
}
export default YesOrNo;