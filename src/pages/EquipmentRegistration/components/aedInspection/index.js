import moment from 'moment';
import _ from 'lodash'
import Footer from '../../Footer'
import AedInspection from "@components/aedInspection";
import { toast } from 'react-toastify';

const AEDInspection = (props) => {
   const { active, state, handleChange, goBack, goForward, id, service, slug} = props;
   const { name } = state.location

   const getUserName = () => {
      let user = JSON.parse(localStorage.getItem('token')).user
      return user.fname + " " + user.lname
   }

   const checkDisable = () => {
      if (state && _.isBoolean(state.correct_location) && (_.isBoolean(state.readiness_indicator) || service) && !_.isEmpty(state.accessories) &&
         _.size(_.dropWhile(state.accessories, (key) => _.isBoolean(key.installed))) === 0)
         return true
      return false
   }

   if (state && _.isBoolean(state.correct_location) && (_.isBoolean(state.readiness_indicator) || service) && !_.isEmpty(state.accessories) &&
      _.size(_.dropWhile(state.accessories, (key) => _.isBoolean(key.installed))) === 0 && !state?.inspection_at)
      handleChange('inspection_at', new Date())

   const handleForward = () => {
      if (checkDisable()) {
         goForward(id)
      }
      else
         toast.warn('Please select all fields !')
   }

   return (
      <div className='h-100 d-flex flex-column justify-content-between pb-3'
         style={{ minHeight: window.innerHeight - 230 }}
      >
         <div>
            <div className='Bg-light bold C-primary ps-4 pe-4 d-flex align-items-center justify-content-between'>
               <p className='text-capitalize'>Equipment Inspection</p>
               <p>SN:{state.serial_number}</p>
            </div>
            <div className={`Content d-flex flex-column pt-2 `}
               style={{ height: window.innerHeight - 330, minHeight: '300px', maxHeight: window.innerHeight }}
            >
               <AedInspection state={state} equipmentModelImages={state.aed.equipment_model_image} data={state.location} handleChange={handleChange} service={service} slug={slug} />
               <div className='C-d6d6d6 bold p-3 ms-3'>
                  <p>SN:{state.serial_number}</p>
                  <p>Location: {name}</p>
                  <p>Username: {getUserName()}</p>
                  <p>Timestamp: {moment(state?.inspection_at).format('MM/DD/YYYY hh:mm:ss')}</p>
               </div>
            </div>
         </div>
         <Footer active={active} goBack={() => goBack()} goForward={() => handleForward()} />
      </div>
   )
}

export default AEDInspection;