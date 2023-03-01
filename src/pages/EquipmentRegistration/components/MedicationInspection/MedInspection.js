import { ShowDescription } from '@/components'
import YesOrNo from '@/components/aedInspection/YesOrNo'
import { TextInput } from '@/components/common'
import { isSuperAdmin } from '@/helpers'
import moment from 'moment'
import React from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import { MdOutlineLocationOn } from 'react-icons/md'
import DatePicker from 'react-datepicker';

const MedInspection = (props) => {
   const { state, handleChange, id, modelImage, data, handleChangeRaw=() => {} } = props;
   const { isValidDate = true } = state
   const { address, address2, city, zip, name } = data?.location;

   return (
      <>
         <div className='ps-3 pe-3'>
            <div className='border rounded mt-2'>
               <div className='border-bottom ps-3 align-items-center d-flex' style={{ minHeight: '45px' }}>
                  <p className='lable C-818188 bold'>Is Medication in correct location ?</p>
               </div>
               <Row className='p-2 pt-3 m-0 d-flex align-items-start justify-content-between flex-row' style={{ minHeight: '100px' }}>
                  <Col as={Row} lg={8} sm={8} xs={9} className='m-0'>
                     <Col className='d-flex p-0' style={{ maxWidth: '30px' }}>
                        <MdOutlineLocationOn size={28} color='#c60970' />
                     </Col>
                     <Row as={Col} className=''>
                        <p className='itemText C-primary bold mb-1 p-0'>{name}</p>
                        <p className='lable C-818188 mb-1'>{address} {address2} {city} {state?.location?.state} {zip}</p>
                        <ShowDescription text={state?.description} classes='C-818188 F-14 p-0' />
                     </Row>
                  </Col>
                  <YesOrNo name='location' handleChange={(bool) => handleChange("correct_location", bool)} checked={state.correct_location} />
               </Row>
            </div>
            {isSuperAdmin() ?
               <Row className='border rounded d-flex align-items-center justify-content-center m-0 mt-2'>
                  <div className='border-bottom ps-3 align-items-center d-flex' style={{ minHeight: '45px' }}>
                     <p className='lable C-818188 bold'>Inspection date</p>
                  </div>
                  <div className='p-3'>
                     <Col xs={12}>
                        <DatePicker
                           selected={state?.created_at}
                           onChangeRaw={(event) => handleChange('isValidDate', handleChangeRaw(event.target.value))}
                           onChange={(date) => handleChange('created_at', date)}
                           onCalendarClose={() => handleChange('isValidDate', true)}
                           placeholderText={`Choose Date`}
                           dateFormat="MM/d/yyyy HH:mm"
                           showTimeSelect
                           timeFormat="HH:mm"
                           timeIntervals={10}
                           className='p-2 border rounded Shadow'
                           maxDate={new Date()}
                        />
                     </Col>
                     {isValidDate ? ''
                        : <div className='C-primary edit-btn ps-2 pt-2'
                           style={{ height: '15px', fontSize: '11px' }}>Invalid date</div>
                     }
                  </div>
               </Row>
               : null
            }
            <div className='border rounded mt-2'>
               <div className='border-bottom ps-3 align-items-center d-flex' style={{ minHeight: '45px' }}>
                  <p className='lable C-818188 bold'>Are the Medication details correct ?</p>
               </div>

               <Row key={id} className='p-2  m-0 d-flex align-items-start justify-content-between flex-row '>
                  <Col as={Row} lg={8} sm={8} xs={8} className='m-0 d-flex flex-row'>
                     <Col lg={3} sm={5} xs={6} className='d-flex p-0 align-items-center'>
                        <Image src={state?.aed?.image || modelImage} alt='AED' className={`Icon`} />
                     </Col>
                     <Col lg={7} sm={10} className='d-flex align-items-center ps-0 ps-lg-4' >
                        <p className='lable C-818188 bold'>Expires: {moment(data?.expiration).format("MM/DD/YYYY")}</p>
                     </Col>
                  </Col>
                  <YesOrNo name={id} handleChange={(bool) => handleChange('correct_detail', bool)} checked={state.correct_detail} />
               </Row>
            </div>
            <Row className='border rounded d-flex align-items-center justify-content-center m-0 mt-2'>
               <div className='border-bottom ps-3 align-items-center d-flex' style={{ minHeight: '45px' }}>
                  <p className='lable C-818188 bold'>Comment:</p>
               </div>
               <div>
                  <TextInput
                     placeholder='Enter your comment here..'
                     isTextArea='textarea'
                     name='comment'
                     value={state?.comment}
                     onChange={(e) => handleChange(e.target.name, e.target.value)}
                     style={{ height: '100px', resize: 'none', margin: '5px' }}
                     classes='shadow-none border-none'
                  />
               </div>
            </Row>
         </div>
      </>
   )
}

export default MedInspection