import { useEffect, useState } from "react";
import { Col } from "react-bootstrap"
import { connect, useDispatch } from 'react-redux'

import ProfilePicture from './ProfilePicture'
// import Map from '@components/Map'
import './index.css'
import ProfileTab from "./ProfileTab";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateProfile, uploadImage } from "@/services";

const Profile = (props) => {
   const dispatch = useDispatch()
   let { image } = props.profile || {};
   const [state, setState] = useState({image});
   const active = props.active
   const navigate = useNavigate()
   const { loading= false, } = state;
   useEffect(() => {
      if (props?.pofile?.id)
         dispatch(getUserProfile());
   }, []);

   const handleTab = (e) => {
      if (e.target.id === 'password')
         navigate('/profile/change-password')
      else if (e.target.id === 'general')
         navigate('/profile')
      else if (e.target.id === 'settings')
         navigate('/profile/setting')
   }

   const getUploadPercent = (n) => setState({...state, progress: n})

   const handleProfilePic = (e) => {
      if (e.target?.files && e.target.files?.length) {
         let filess = new FormData();
         filess.append('image', e.target?.files[0], e.target.files[0]?.name);
         setState({...state, loading: true})
         dispatch(uploadImage({filess, getPercent: (n) => getUploadPercent(n)})).unwrap().then((res) => {
            if (res?.data?.url) {
               let data = { image: res.data.url}
               dispatch(updateProfile(data))
               setState({ ...state, "image": res.data.url})
               dispatch(getUserProfile());
            }
            else if (res?.image && res?.image.length) {
               alert(res?.image[0])
            }
            else {
               alert("Slow internet detected.\nCan't upload image.")
            }
         })
      }
   }

   return (
      <Col md='auto' className='d-flex flex-column align-items-center'>
         <ProfilePicture image={state?.image || image} handleProfilePic={handleProfilePic} loading={loading} />
         <ProfileTab handleTab={handleTab} active={active} toggleTab={props.toggleTab}/>
      </Col>
   )
}

const mapStateToProps = state => {
   return {
      profile: state?.auth?.user,
   };
}

const actionCreators = {
   uploadImage: (data, callBack) => uploadImage(data, callBack),
   // getUserProfile: () => getUserProfile(),
   updateProfile: (data) => updateProfile(data),
};
export default connect(mapStateToProps, actionCreators)(Profile);