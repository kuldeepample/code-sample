import { useState } from 'react';
import { Col, Row } from 'react-bootstrap'
import { Magnifier, MOUSE_ACTIVATION, TOUCH_ACTIVATION } from "react-image-magnifiers";
import { toast } from 'react-toastify';

import Footer from '../../Footer'
import { TextInput, ReactDatePicker } from '@components/common'
import _ from "lodash"
import { connect, useDispatch } from 'react-redux'
import { checkSN } from '@/services/equipment.services';

const EnterSerialNumber = (props) => {
   const dispatch = useDispatch()
   const { active, state, handleChange, goBack, goForward, id } = props;
   let { serial_number, c_serial_number, mfg_date, aed, tags } = state
   const [loading, setLoading] = useState(false)

   const handleOnChange = (e) => {
      handleChange(e.target.name, e.target.value)
   }

   const getImage = () => {
      let serialImg = _.find(aed?.equipment_model_image, function (o) { return o.type === "serial"; });
      let backImg = _.find(aed?.equipment_model_image, function (o) { return o.type === "back"; });
      return (serialImg?.image || backImg?.image) || aed?.image
   }

   const handleForward = () => {
      if (serial_number && c_serial_number)
         if (!_.includes(serial_number, ' '))
            if (serial_number === c_serial_number) {
               setLoading(true)
               dispatch(checkSN(serial_number)).unwrap().then((res) => {
                  if (!res?.data) goForward(id)
                  else {
                     setLoading(false)
                     toast.warn("Serial Number already registered!")
                  }
               })
            }
            else { }
         else
            toast.warn("Serial Number can't contain space!")
      else
         toast.warn(`Please ${!serial_number ? 'enter' : 'confirm'} Serial Number!`)
   }

   return (
      <div className='h-100 d-flex flex-column justify-content-between pb-3'
         style={{ minHeight: window.innerHeight - 230 }}
      >
         <div>
            <div className='Bg-light C-primary bold ps-4 d-flex align-items-center'>Enter Serial Number</div>
            <Row className='d-flex flex-row justify-content-center p-3'>
               <Col lg={3} md={4}>
                  <TextInput
                     name='serial_number'
                     classes={'C-primary bold mb-2'}
                     onChange={(e) => handleOnChange(e)}
                     value={serial_number}
                     placeholder='S. N.'
                  />
               </Col>
               <Col lg={3} md={4}>
                  <TextInput
                     name='c_serial_number'
                     placeholder='Confirm S.N.'
                     value={c_serial_number}
                     classes={'C-primary bold mb-2'}
                     onChange={(e) => handleOnChange(e)}
                     validationText={(c_serial_number && c_serial_number !== serial_number) && "Serial Number doesn't match"}
                  />
               </Col>
               <Col lg={3} md={4}>
                  <ReactDatePicker
                     selected={mfg_date}
                     placeholderText='Manufacture Date (optional)'
                     classes='Shadow C-primary'
                     onChange={(date) => handleChange('mfg_date', date)}
                  />
               </Col>
               <Col  lg={3} md={4}>
                  <TextInput
                     name='tags'
                     value={tags}
                     placeholder='Asset tag'
                     classes={'bold mb-2'}
                     onChange={(e) => handleOnChange(e)}
                  />
               </Col>
            </Row>
            <div className='center align-items-start h-100 mb-3'>
               <div className='border p-1 rounded' style={{ height: '310px', width: '320px' }}>
                  {getImage() ?
                     <Magnifier
                        className='magni'
                        imageSrc={getImage()}
                        imageAlt="AED"
                        dragToMove={true}
                        mouseActivation={MOUSE_ACTIVATION.CLICK}
                        touchActivation={TOUCH_ACTIVATION.TAP}
                     />
                     :
                     <div className='center bg-light h-100 w-100'>
                        <p>Equipment image not available</p>
                     </div>
                  }
               </div>
            </div>
         </div>
         <Footer active={active} isForwarding={loading} goBack={() => goBack()} goForward={() => handleForward()} />
      </div>
   )
}

const actionCreators = {
   // checkSN: (sn) => (dispatch) => dispatch(checkSN(sn)),
}
export default connect(null, actionCreators)(EnterSerialNumber);