import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Row, Col, Image } from 'react-bootstrap'

import Footer from '../../Footer';
import Container from './Container'
import UserList from '../addUserToAED/UserList';
import LocationItem from '../assignLocation/LocationItem';
import AccessoriesItem from '@components/AccessoriesItem';

import { connect, useDispatch, useSelector } from 'react-redux';
import _ from 'lodash'
import moment from 'moment'
import { toast } from 'react-toastify';
import { getAccessoryColor, getEquipmentUsers, getExpirationDate } from '@/helpers';
import { getLicensePermissions, registerEquipment } from '@/services';

const Review = (props) => {
   const dispatch = useDispatch()
   const { active, state, handleChange, goBack, setActive, service } = props;
   const navigate = useNavigate();
   const [listData, setUsersList] = useState([])
   const [loading, setLoading] = useState(false)
   const reducerData = useSelector((state) => {
      return {
         usersList: state.location.usersList,
      }
   })
   const { usersList } = reducerData
   const termsRef = useRef(null);
   useEffect(() => {
      setListData()
   }, [])

   const setListData = () => {
      if (!_.isEmpty(state.users)) {
         let list = _.intersectionBy(props.usersList, state.users, 'id');
         setUsersList(list);
      }
   }

   const getImage = (type) => {
      let Img = _.find(state.aed?.equipment_model_image, (key) => { return key.type === type; });
      return Img?.image
   }

   const handleSubmit = () => {
      if (state?.agree) {
         setLoading(true);
         let data = {
            serial_number: state.serial_number,
            mfg_date: (state?.mfg_date) ? moment(state?.mfg_date).format("YYYY/MM/DD") : '',
            equipment_model_id: state?.aed?.id,
            location_id: state?.location?.id,
            installation: moment().format("YYYY/MM/DD hh:mm:ss"),
            expiration: moment().add(30, 'days').format("YYYY/MM/DD hh:mm:ss"),
            description: state.description,
            accessories: state.accessories,
            equipment_users: getEquipmentUsers(state.users),
            is_Published: state?.agree,
            asset_tag: state?.tags
         };
         if(!service)
            data.inspection = {
                  correct_location: state.correct_location,
                  location_id: state?.location?.id,
                  readiness_indicator: state.readiness_indicator || false,
                  accessories: state?.accessories,
                  inspection_at: moment(state.inspection_at) ? moment(state.inspection_at).format("YYYY/MM/DD hh:mm:ss") : state.inspection_at,
                  comment: state?.comment
               }
         dispatch(registerEquipment(data)).unwrap().then((res) => {
            if (res && res?.success) {
               toast.success(res?.message)
               handleChange('leave', false);
               dispatch(getLicensePermissions());
               setTimeout(() => navigate('/equipment/' + res?.data?.id), 100);
            }
            else
               setLoading(false)
         })
            .catch(err => toast.error(err))
      } else {
         termsRef.current.focus()
         toast.warn('Please agree the terms !')
      }
   }
   return (
      <div className='h-100 d-flex flex-column justify-content-between pb-3'
         style={{ minHeight: window.innerHeight - 230 }}
      >
         <div className='Bg-light C-primary ps-4 d-flex align-items-center'>Review</div>
         <div className={`Content p-4 pt-0 d-flex flex-column `}
            style={{ height: window.innerHeight - 320, minHeight: '300px', maxHeight: window.innerHeight }}
         >
            <Row className='m-0' lg={2} md={12} >
               <Container as={Col} classes='ps-0 pe-lg-2 pe-md-0 pe-sm-0 p-0' heading='Equipment Type' setActive={() => setActive(1)}>
                  <Row className='m-0 d-flex flex-row justify-content-between'>
                     <Col className='pt-2'>
                        <p className='C-6e6e6e lable'>Brand</p>
                        <p className='C-818188 pt-1 lable'>{state?.aed?.equipment_brand?.name}</p>
                     </Col>
                     <Col className='pt-2'>
                        <p className='C-6e6e6e lable'>Model</p>
                        <p className='C-818188 pt-1 lable'>{state?.aed?.name}</p>
                     </Col>
                     <Col>
                        <Image src={state.aed.image} alt='AED' className='reviewImage' />
                     </Col>
                  </Row>
               </Container>
               <Container as={Col} classes='pe-0 ps-lg-2 ps-md-0 ps-sm-0 p-0' heading='Serial Number' setActive={() => setActive(2)}>
                  <Row className='m-0 d-flex flex-row justify-content-between'>
                     <Col className='pt-2'>
                        <p className='C-818188 lable'>{state.serial_number}</p>
                        {state.mfg_date && <div className=' mt-2 lable C-818188'><span className='text-truncate C-6e6e6e'>Manufacture Date :</span> {moment(state?.mfg_date).format("MM/DD/YYYY")}  </div>}
                        {state.tags && <div style={{width: '300px'}} className='C-818188 lable text-truncate' title={state?.tags}>Asset Tag: {state?.tags}</div>}
                     </Col>
                     <Col className='d-flex flex-row justify-content-center'>
                        <Image src={getImage("back") || state.aed.image} alt='AED' className='reviewImage' />
                        {/* <Image src={getImage("serial")} alt='AED' className='QrImage mt-2' /> */}
                     </Col>
                  </Row>
               </Container>
            </Row>
            <Container heading='Assigned Location to Equipment' setActive={() => setActive(3)}>
               <LocationItem item={state.location} state={state} classes='border-none' />
            </Container>
            <Container heading='Location Description' setActive={() => setActive(4)}>
               <p className='lable C-818188 p-3 Content' style={{ whiteSpace: 'break-spaces', maxHeight: '150px' }}>{state.description}</p>
            </Container>
            <Container heading='Assigned User to Equipment' setActive={() => setActive(5)}>
               <UserList display="none" listData={listData} handleChange={handleChange} state={state} onReview={true} />
            </Container>
            <Container heading='Assigned Accessories to Equipment' setActive={() => setActive(6)}>
               {
                  (state?.accessories || []).map((item, key) => {
                     return (
                        <AccessoriesItem key={key} data={item} onReview={true} classes={key === 1 ? '' : 'border-none'} />
                     )
                  })
               }
            </Container>
            {
               !service &&
               <Container heading='Equipment Inspection' setActive={() => setActive(7)}>
                  <div className='border-bottom ps-3 pe-5 align-items-center d-flex flex-row justify-content-between' style={{ minHeight: '40px' }}>
                     <p className='lable C-6e6e6e ps-1'>Is Equipment in correct location ?</p>
                     <p className='C-6e6e6e'>{state.correct_location ? "Yes" : "No"}</p>
                  </div>
                  <div className='border-bottom ps-3 pe-5 align-items-center d-flex flex-row justify-content-between' style={{ minHeight: '40px' }}>
                     <p className='lable  C-6e6e6e ps-1'>Readiness indicator OK ?</p>
                     <p className='C-6e6e6e'>{state.readiness_indicator ? "Yes" : "No"}</p>
                  </div>

                  {state?.accessories.map((item, id) => {
                     const isPng = item?.icon?.includes('.svg') || item?.icon?.includes('.png')
                     return (
                        <Row key={id} className='p-2 m-0 d-flex align-items-start justify-content-between flex-row pe-5'>
                           <Col as={Row} lg={7} sm={8} xs={8} className='m-0 d-flex flex-row'>
                              <Col lg={3} sm={4} className='d-flex p-0 align-items-center'>
                                 <Image src={item?.icon} alt='Modal' className={`Icon accessory-${isPng ? getAccessoryColor(item?.expiration) : ''}`} />
                                 <p className='lable C-818188 bold'>&nbsp; {item?.name}</p>
                              </Col>
                              <Col lg={8} sm={8} className='d-flex align-items-center' >
                                 <p className='lable C-818188 bold'>Expires: {getExpirationDate(item?.expiration)}</p>
                              </Col>
                           </Col>
                           <Col as={Row} className='d-flex justify-content-end C-6e6e6e'>{state?.accessories[id]?.installed ? "Yes" : "No"}</Col>
                        </Row>
                     )
                  })}
                  {state?.comment &&
                     <div className='border-top ps-3 pe-2 pt-1 align-items-cener d-flex' style={{ minHeight: '40px', maxHeight: '150px' }}>
                        <span className='lable C-6e6e6e ps-1'>Comment: </span>
                        <span style={{ whiteSpace: 'break-spaces' }} className='F-12 C-818188 ps-1 Content w-100'>{state?.comment}</span>
                     </div>}
               </Container>
            }
            <div className='d-flex flex-column justify-content-between p-2 ps-4 pe-4'>
               <p className='lable C-6e6e6e'>Please take a few minutes to read and understand them.</p>
               <div className=' d-flex flex-row mt-1 align-items-center'>
                  <input type='checkbox' className='regular-checkbox me-1 terms-checkBox'
                     name='agree'
                     ref={termsRef}
                     onClick={(e) => handleChange("agree", !state?.agree)}
                     checked={state?.agree}
                  />
                  <p className='lable C-6e6e6e '>&nbsp;Yes I agree</p>
               </div>
            </div>
         </div>
         <Footer active={active} isForwarding={loading} goBack={() => goBack()} goForward={() => handleSubmit()} isFinish={true} />
      </div >
   )
}
function mapStateToProps(state) {

}
const actionCreators = {
   // registerEquipment: (data) => (dispatch) => dispatch(registerEquipment(data)),
   // getLicensePermissions: () => (dispatch) =>  dispatch(getLicensePermissions()),
}
export default connect(mapStateToProps, actionCreators)(Review);