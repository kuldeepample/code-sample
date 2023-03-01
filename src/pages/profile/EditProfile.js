import { useState } from "react"
import { Col, Spinner } from "react-bootstrap"

import _ from 'lodash'
import moment from 'moment'
import AddressBar from "@components/Layout/AddressBar"
import { Container, Pressable } from '@components/common';

import { useNavigate } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'

import './index.css'
import { toast } from 'react-toastify';
import { isValidMobile, setUserToken } from "@/helpers"
import Profile from ".";
import Ellipsis from "./Ellipsis"
import { getUserProfile, updateProfile, uploadImage } from "@/services"

const EditProfile = (props) => {
   const dispatch = useDispatch()
   let { fname, lname, email, mobile, updated_at, image, login_info, account, address, timezone, settings } = props.profile;
   let email_delivery_time = settings?.find(item => item?.name === "email_delivery_time")?.value;
   const [hours, minutes] = email_delivery_time ? email_delivery_time?.split(':') : ['08', '00'];
   email_delivery_time = new Date(_, _, _, +hours, +minutes);

   const [state, setState] = useState({
      fname, lname, email, mobile, account: account?.name, settings
   })
   const [values, setValues] = useState({})
   const {
      loading = false,
   } = values
   const navigate = useNavigate();

   const handleChange = (name, value) => {
      setState({ ...state, [name]: value })
      if (name === 'mobile' && !isValidMobile(value))
         setState(prev => ({ ...prev, mobileWarning: 'Invalid phone number!' }))
      else
         setState(prev => ({ ...prev, mobileWarning: '' }))
   }
   const getUploadPercent = (n) => setState({ ...state, progress: n })

   const handleFileChange = (e) => {
      if (e?.target?.files && e.target.files.length) {
         let filess = new FormData();
         filess.append('image', e?.target?.files[0], e?.target?.files[0]?.name);
         setValues({ ...values, loading: true })
         dispatch(uploadImage({filess, getPercent: (n) => getUploadPercent(n)})).unwrap().then((res) => {
            if (res?.url) {
               setState({ ...state, "image": res.url })
               setValues({ ...values, loading: false })
            }
            else if (res?.image && res?.image.length) {
               setValues({ ...values, loading: false })
               alert(res?.image[0])
            }
            else {
               setValues({ ...values, loading: false })
               alert("Slow internet detected.\nCan't upload image.")
            }
         })
      }
   }

   const handleSubmit = () => {
      if (!_.isEmpty(state)) {
         let userData = _.mapValues(state, function (v, key) {
            if (key === 'mobile')
               return v.replace(/\D/g, "")
            if (key === 'email_delivery_time')
               return moment(v).format("HH:mm")
            return v
         });
         userData.timezone_id = userData.timeZone?.id
         setState(prev => ({ ...prev, isUpdating: false }))
         dispatch(updateProfile(userData))
            .then((res) => {
               if (res) {
                  dispatch(getUserProfile());
                  let token = JSON.parse(localStorage.getItem('token'));
                  token.user = res;
                  setUserToken(token);
                  setState(prev => ({ ...prev, isUpdating: false }))
                  toast.success(res?.message)
                  navigate('/profile');
               }
               else {
                  setState(prev => ({ ...prev, isUpdating: false }))
                  toast.error(res?.message)
               }
            })
      }
      else
         navigate('/profile');
   }

   return (
      <>
         <AddressBar page={[{ name: "Profile" }]} right={<Ellipsis active={'general'}/>} />
         <div className="d-flex flex-column flex-lg-row">
            <Profile active={'general'}/>
            <Col>
               <Container classes='mt-2 profile-field pb-3'>
                  <Col lg={6} xs={12}>
                     <ProfileField label={'First Name'} />
                     <input type={'text'} name='fname' className="profile-input" value={state?.fname}
                     onChange={(e)=> handleChange(e.target.name, e.target.value)}/> 
                  </Col>
                  <Col lg={6} xs={12}>
                     <ProfileField label={'Last Name'} />
                     <input type={'text'} name={'lname'} className="profile-input" value={state?.lname}
                     onChange={(e)=> handleChange(e.target.name, e.target.value)}/>
                  </Col>
               </Container>
               <Container classes='mt-2 profile-field pb-3'>
                  <Col lg={6} xs={12}>
                     <ProfileField label={'Phone'} />
                     <input type={'text'} name={'mobile'} className="profile-input" value={state?.mobile} 
                     onChange={(e)=> handleChange(e.target.name, e.target.value)}/>
                  </Col>
                  <Col lg={6} xs={12}>
                     <ProfileField label={'Email'} />
                     <input type={'text'} name={'email'} className="profile-input" value={state?.email} 
                     onChange={(e)=> handleChange(e.target.name, e.target.value)} disabled/>

                  </Col>
               </Container>
               <Container classes='mt-2 profile-field pb-3'>
                  <Col>
                     <ProfileField label={'Address'} />
                     <input type={'text'} name='address' className="profile-input" placeholder="address"
                     onChange={(e)=> handleChange(e.target.name, e.target.value)}/>
                  </Col>

               </Container>
               <Container classes='mt-2 profile-field  pb-3'>
                  <Col>
                     <ProfileField label={'Organization'} />
                     <input type={'text'} name={"account"} className="profile-input" value={state?.account}
                     onChange={(e)=> handleChange(e.target.name, e.target.value)} disabled/>
                  </Col>
               </Container>

               <div className='d-flex flex-row justify-content-end mt-4'>
                  <Pressable
                     title='Back'
                     classes='me-2 mt-3 d-flex align-self-center Bg-fff C-dark center p-1'
                     style={{ minWidth: '100px' }}
                     onPress={() => { navigate(-1) }}
                  />
                  <Pressable
                     title='Update'
                     disabled={state?.mobileWarning || loading}
                     classes='ms-2 mt-3 d-flex align-self-center center p-1'
                     style={{ minWidth: '100px' }}
                     onPress={() => handleSubmit()}
                  />
               </div>
            </Col>
            {state?.isUpdating &&
               <div style={{ opacity: 0.8, position: 'absolute', zIndex: 1 }} className="h-100 w-100 Bg-fff center" >
                  <Spinner animation="border" />
               </div>
            }
         </div>
      </>
   )
}
const mapStateToProps = state => {
   return {
      profile: state.auth && state.auth.user,
      timeZoneList: state.auth.timeZoneList
   };
}

const actionCreators = {
   // updateProfile: (data) => updateProfile(data),
   // uploadImage: (data, callBack) => uploadImage(data, callBack),
   // getUserProfile: () => getUserProfile(),
};

export const ProfileField = (props) => {
   const { label } = props;

   return (
      <div className="profile-text">{label}</div>
   )
}
export default connect(mapStateToProps, actionCreators)(EditProfile);

