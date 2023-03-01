import { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import _ from 'lodash'
import { DropDown, TextInput, ReactDatePicker } from './common';
import { IoCloseCircleOutline } from 'react-icons/io5';

const AccessoriesForm = (props) => {
   let { handleFormChange, formState, modelAccessories } = props
   // const [AccessoryList, setAccessoryList] = useState([])

   const [accessoryAttribute, setAccessoryAttribute] = useState({ lot_number: { isShow: true }, expiration: { isShow: true }, installation: { isShow: true } })
   const status = [{ key: 'active', name: 'Active' }, { key: 'backup', name: 'Backup' }]
   const { lot_number, expiration, installation } = accessoryAttribute;


   const handleAttribute = (attributes) => {
      let attr = attributes.reduce((obj, item) => ({ ...obj, [item.name]: { isRequired: item.is_required, isShow: item.is_show } }), {})
      setAccessoryAttribute(attr)
   }
   return (
      <Form>
         <DropDown lable='Type*' placeholder='Type' name='model'
            emptySelect={false}
            value={formState?.model?.name}
            data={modelAccessories}
            onChange={(e) => {
               handleFormChange(e.target.name, JSON.parse(e.target.id));
               handleAttribute(JSON.parse(e.target.id)?.accessory_type?.accessory_type_attributes)

            }
            }
         />
         {/* <DropDown lable='State*' placeholder='State' name='status'
            emptySelect={false}
            value={formState?.status?.name}
            data={status}
            onChange={(e) => handleFormChange(e.target.name, JSON.parse(e.target.id))}
         /> */}
         {/* <TextInput lable='State*' placeholder='State' name='status'
            disabled value={'Active'} lableClass='mar-0'
         /> */}
         <Col className='mt-2 d-flex flex-column justify-content-between'>
            <Form.Label className='bold lable mt-1 C-dark'>Status*</Form.Label>
            <div className='w-50 d-flex justify-content-between F-14'>
               {status.map((item) => {
                  return (<Form.Check
                     inline
                     className='C-dark'
                     label={item.name}
                     name={'status'}
                     type='radio'
                     id={`radio-${item.key}`}
                     onClick={() => handleFormChange('status', item)}
                  />)
               })}
            </div>
         </Col>
         {
            lot_number.isShow ?
               <TextInput
                  name='lot_number'
                  lable={`Lot Number${lot_number.isRequired ? '*' : ''}`}
                  placeholder='Lot Number'
                  value={formState?.lot_number}
                  lableClass='mar-0'
                  onChange={(e) => handleFormChange('lot_number', e.target.value)}
               />
               : null
         }
         <Row className='mt-1'>
            {
               installation.isShow ?
                  <Col>
                     <Form.Label className='bold lable mt-1 C-dark'>Date of Installation{installation.isRequired ? '*' : ''}</Form.Label>
                     <ReactDatePicker
                        placeholderText='Date of Installation'
                        selected={formState?.installation}
                        maxDate={formState?.expiration}
                        classes='Shadow text-dark'
                        onChange={(date) => handleFormChange('installation', date)}
                     />
                  </Col>
                  : null
            }
            {
               expiration.isShow ?
                  <Col>
                     <Form.Label className='bold lable mt-1 C-dark' >Date of Expiration{expiration.isRequired ? '*' : ''}</Form.Label>
                     <ReactDatePicker
                        placeholderText='Date of Expiration'
                        selected={formState.expiration}
                        minDate={formState?.installation}
                        classes='Shadow text-dark'
                        onChange={(date) => handleFormChange('expiration', date)}
                     />
                  </Col>
                  : null
            }
            <Row className='mt-3 justify-content-between'>
               <Col xs={7} >
                  <Col className='bold lable C-dark'>Upload Image</Col>
                  <Col className='d-flex align-items-center'>
                     <input style={{ display: 'none' }} type={'file'} id='fileInput' accept="image/jpeg, image/png"
                        onChange={(e) => handleFormChange("img", e?.target?.files[0])} />
                     <label htmlFor='fileInput' className='py-2 text-truncate'>
                        <span className='fileSelector'>Browse...</span>
                        <span className='F-12 mx-3'>{formState?.img?.name || 'No file selected'}
                        </span>
                     </label>
                     {
                        formState?.img &&
                        <span className='Bg-fff' onClick={() => handleFormChange("img", '')} role='button'>
                           <IoCloseCircleOutline size={18} className='C-dark ms-3' />
                        </span>

                     }
                  </Col>
               </Col>
               <Col xs={5}>
                  {formState?.img &&
                     <div style={{ position: 'relative' }}>
                        <img src={URL.createObjectURL(formState?.img)} style={{ maxWidth: '200px', objectFit: 'contain', height: '200px' }} />
                     </div>
                  }
               </Col>
            </Row>

         </Row>
      </Form>
   )
}

export default AccessoriesForm;