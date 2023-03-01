import moment from 'moment';
import _ from 'lodash'
import Footer from '../../Footer';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { getEquipmentUsers } from '@/helpers';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import MedInspection from './MedInspection';
import { getLicensePermissions, registerMedication } from '@/services'

const MedicationInspection = (props) => {
   const dispatch = useDispatch()
   const { active, state, handleChange, goBack, id, addInspection } = props;
   const { name } = state?.location

   const [loading, setLoading] = useState(false)
   const navigate = useNavigate()

   const getUserName = () => {
      let user = JSON.parse(localStorage.getItem('token')).user
      return user.fname + " " + user.lname
   }

   const checkDisable = () => {
      if (state && _.isBoolean(state.correct_location) && _.isBoolean(state.correct_detail))
         return true
      return false
   }

   const handleForward = () => {
      if (checkDisable()) {
         handleSubmit()
      }
      else
         toast.warn('Please select all fields !')
   }

   const handleSubmit = () => {
      setLoading(true);
      let data = {
         lot_number: state.lot_number,
         expiration: (state?.expiration) ? moment(state?.expiration).format("YYYY/MM/DD") : '',
         equipment_model_id: state?.aed?.id,
         location_id: state?.location?.id,
         description: state.description,
         equipment_users: getEquipmentUsers(state.users),
         is_Published: true,
         asset_tag: state?.tags,
         inspection: {
            correct_location: state.correct_location,
            location_id: state?.location?.id,
            inspection_at: moment().format('YYYY/MM/DD'),
            comment: state?.comment,
            correct_detail: state.correct_detail
         }
      };

      dispatch(registerMedication(data)).unwrap().then((res) => {
         if (res && res?.success) {
            toast.success(res?.message)
            handleChange('leave', false);
            dispatch(getLicensePermissions());
            setTimeout(() => navigate('/medication/' + res?.data?.id), 100);
         }
         else
            setLoading(false)
      })
         .catch(err => toast.error(err))
   }

   return (
      <div className='h-100 d-flex flex-column justify-content-between pb-3'
         style={{ minHeight: window.innerHeight - 230 }}
      >
         <div>
            <div className='Bg-light bold C-primary ps-4 pe-4 d-flex align-items-center justify-content-between'>
               <p>Medication Inspection</p>
               <p>LN: {state.lot_number}</p>
            </div>

            <div className={`Content d-flex flex-column pt-2 `}
               style={{ height: window.innerHeight - 330, minHeight: '300px', maxHeight: window.innerHeight }}
            >
               <MedInspection state={state} handleChange={handleChange} id={id} data={state} />

               {addInspection ? "" :
                  <>
                     <div className='C-d6d6d6 bold p-3 ms-3'>
                        <p>LN:{state.lot_number}</p>
                        <p>Location: {name}</p>
                        <p>Username: {getUserName()}</p>
                        <p>Timestamp: {moment(state?.created_at).format('YYYY/MM/DD hh:mm:ss')}</p>
                     </div>
                     <Footer active={active} isForwarding={loading} goBack={() => goBack()} goForward={() => handleForward()} isFinish={true} />
                  </>
               }
            </div>
         </div>
      </div>
   )
}

const actionCreators = {
   // getLicensePermissions: () => (dispatch) => dispatch(getLicensePermissions()),
   // registerMedication: (data) =>(dispatch) => dispatch(registerMedication(data)),
}
export default connect(null, actionCreators)(MedicationInspection);