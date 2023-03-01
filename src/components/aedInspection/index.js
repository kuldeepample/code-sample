import { Col, Row, Image } from 'react-bootstrap'
import YesOrNo from './YesOrNo'
import _ from 'lodash'
import { getAccessoryColor, getExpirationDate, isSuperAdmin } from '@/helpers'
import { ShowDescription } from '@/components';
import { TextInput } from '../common'
import { MdOutlineLocationOn } from 'react-icons/md';
import DatePicker from 'react-datepicker';

const AedInspection = (props) => {
   const { state, data, handleChange, equipmentModelImages, isService, handleChangeRaw = () => { }, slug } = props
   const { isValidDate = true } = state
   const { name, address, city, zip, address2 } = data
   const handleAccessoriesSelection = (bool, id) => {
      let temp = state.accessories;
      temp[id].installed = bool
      handleChange("accessories", temp)
   }
   const getCheck = (id) => {
      let obj = state.accessories[id];
      if (obj?.installed) return true
      else if (obj?.installed === false) return false
      else return ''
   }

   const getImage = () => {
      let readinessImg = _.find(equipmentModelImages, function (o) { return o.type === "readiness"; });
      return readinessImg?.image
   }

   return (
      <div className='ps-3 pe-3'>
         <div className='border rounded mt-2'>
            <div className='border-bottom ps-3 align-items-center d-flex' style={{ minHeight: '45px' }}>
               <p className='lable C-818188 bold text-capitalize'>Is equipment in correct location ?</p>
            </div>
            <Row className='p-2 pt-3 m-0 d-flex align-items-start justify-content-between flex-row' style={{ minHeight: '100px' }}>
               <Col as={Row} lg={8} sm={8} xs={9} className='m-0'>
                  <Col className='d-flex p-0' style={{ maxWidth: '30px' }}>
                     <MdOutlineLocationOn size={28} color='#c60970' />
                  </Col>
                  <Row as={Col} className=''>
                     <p className='itemText C-primary bold mb-1 p-0'>{name}</p>
                     <p className='lable C-818188 mb-1'>{address} {address2} {city} {data?.state} {zip}</p>
                     <ShowDescription text={state?.description} classes='C-818188 F-14 p-0' />
                  </Row>
               </Col>
               <YesOrNo name='location' handleChange={(bool) => handleChange("correct_location", bool)} checked={(state.correct_location)} />
            </Row>
         </div>
         {!isService ?
         <div className='border rounded  mt-2 p-2'>
            <Row className='m-0 p-0'>
               <Col className='d-flex flex-column align-items'>
                  <span className='lable C-6e6e6e'>Readiness indicator OK ?</span>
               </Col>
               <YesOrNo name='Readiness' handleChange={(bool) => handleChange("readiness_indicator", bool)} checked={(state.readiness_indicator)} />
            </Row>
               <Image style={{ width: '80px !important' }} src={getImage()} alt='readiness image not available' className='readiness-image-big F-10 C-818188' />
         </div>

            : null
         }
         {isService || isSuperAdmin() ?
            <Row className='border rounded d-flex align-items-center justify-content-center m-0 mt-2'>
               <div className='border-bottom ps-3 align-items-center d-flex' style={{ minHeight: '45px' }}>
                  <p className='lable C-818188 bold'>{isService ? 'Service' : 'Inspection'} date</p>
               </div>
               <div className='p-3'>
                  <Col xs={12}>
                     <DatePicker
                        selected={state?.created_at || state?.inspection_at}
                        onChangeRaw={(event) => handleChange('isValidDate', handleChangeRaw(event.target.value))}
                        onChange={(date) => { handleChange(slug ? 'inspection_at' : 'created_at', date) }}
                        onCalendarClose={() => handleChange('isValidDate', true)}
                        placeholderText={`Choose Date`}
                        dateFormat="MM/d/yyyy HH:mm"
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={10}
                        className='p-2 border rounded Shadow'
                        minDate={new Date(1970, 1, 1)}
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
               <p className='text-capitalize lable C-818188 bold'>Are the equipment accessories present ?</p>
            </div>
            {state?.accessories && state?.accessories.map((item, id) => {
               const icon = item?.icon || item?.equipment_model_accessory?.accessory_type?.icon || item?.accessory?.equipment_model_accessory?.accessory_type?.icon
               const isPng = icon?.includes('.png') || icon?.includes('.svg')
               return (
                  <Row key={id} className='p-2  m-0 d-flex align-items-start justify-content-between flex-row '>
                     <Col as={Row} lg={8} sm={8} xs={8} className='m-0 d-flex flex-row'>
                        <Col lg={3} sm={5} xs={6} className='d-flex p-0 align-items-center'>
                           <Image src={icon} alt='' className={`Icon accessory-${isPng ? getAccessoryColor(item?.expiration) : ""}`} />
                           <p className='lable C-818188 bold'>&nbsp; {item?.name}</p>
                        </Col>
                        <Col lg={2} sm={6} xs={5} className='d-flex align-items-center ps-0 ps-lg-4' >
                           <p className={`lable bold text-capitalize ${item?.status === 'active' ? 'C-success' : 'C-link'}`}>{item.status}</p>
                        </Col>
                        <Col lg={7} sm={10} className='d-flex align-items-center ps-0 ps-lg-4' >
                           <p className='lable C-818188 bold'>Expires: {getExpirationDate(item.expiration)}</p>
                        </Col>
                     </Col>
                     <YesOrNo name={id} handleChange={(bool) => handleAccessoriesSelection(bool, id)} checked={getCheck(id)} />
                  </Row>
               )
            })}
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
   )
}
export default AedInspection;