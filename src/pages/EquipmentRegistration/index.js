import { useEffect, useState } from "react"
import AddressBar from "@components/Layout/AddressBar"
import './index.css'
import _ from 'lodash';
import { usePrompt } from "./Prompt";

import Header from "./Header";
import ChooseAEDType from './components/chooseAedType'
import EnterSerialNumber from './components/enterSerialNumber'
import AssignLocation from "./components/assignLocation";
import AddDescription from "./components/addDescription";
import AddUserToAED from "./components/addUserToAED";
import AssignAccessoryToAED from "./components/assignAccessoryToAED";
import AEDInspection from './components/aedInspection';
import Review from './components/review';
import { useLocation } from "react-router-dom";
import MedicationInspection from "./components/MedicationInspection";
import LotNumber from "./components/enterSerialNumber/LotNumber";

const EquipmentRegistration = () => {
   let location = useLocation()
   const params = new URLSearchParams(location.search);
   const medication = location.pathname.includes('/medication');
   const slug = params.get('slug');

   const [active, setActive] = useState(1)
   const [state, setState] = useState({});
   const [completeId, setCompleteId] = useState([0]);
   useEffect(() => {
      if (!state.leave)
         window.addEventListener('beforeunload', unload);

      // if (!slugTypes.includes(slug)) navigate('/dashboard')

      return () => window.removeEventListener('beforeunload', unload)
   });

   const handleChange = (stateName, value) => {
      if (active > 1)
         setState(prev => ({ ...prev, agree: false, [stateName]: value }))
      else
         setState(prev => ({ ...prev, accessories: [], correct_location: '', readiness_indicator: '', serial_number: '', c_serial_number: '', agree: false, leave: true, [stateName]: value }))
      setCompleteId(_.pullAllWith(completeId, [active - 1], _.gt));
   }

   const goBack = () => setActive(active - 1)

   const goForward = (id = 0) => {
      setActive(active + 1);
      if (!_.includes(completeId, id))
         setCompleteId([...completeId, id])
   }

   const componentProps = {
      active: active,
      state: state,
      handleChange: handleChange,
      goBack: goBack,
      goForward: goForward
   }
 let aed = [
   <ChooseAEDType id={1} {...componentProps} slug={slug} />,
   <EnterSerialNumber id={2} {...componentProps} />,
   <AssignLocation id={3} {...componentProps} />,
   <AddDescription id={4} {...componentProps} />,
   <AddUserToAED id={5} {...componentProps} />,
   <AssignAccessoryToAED id={6} {...componentProps}/>,
   <AEDInspection id={7} {...componentProps} slug={slug}/>,
   <Review id={8} setActive={setActive} emptyState={() => setState({})} {...componentProps} />,
];
let vision = [
   <ChooseAEDType id={1} {...componentProps} slug={slug} />,
   <EnterSerialNumber id={2} {...componentProps} />,
   <AssignLocation id={3} {...componentProps} />,
   <AddDescription id={4} {...componentProps} />,
   <AddUserToAED id={5} {...componentProps} />,
   <AssignAccessoryToAED id={6} {...componentProps} />,
   // <AEDInspection id={7} {...componentProps} service />,
   <Review id={7} setActive={setActive} emptyState={() => setState({})} {...componentProps} service={true} />,
];
let medications =  [
   <ChooseAEDType id={1} {...componentProps} slug={slug} />,
   <LotNumber id={2} {...componentProps} />,
   <AssignLocation id={3} {...componentProps} medication/>,
   <AddDescription id={4} {...componentProps} />,
   <AddUserToAED id={5} {...componentProps} medication/>,
   <MedicationInspection id={6} {...componentProps} />
];
   const equ = {
      [slug] : aed,
      aed,
      vision,
      hearing: vision
   }
   const med = {
      [slug] : medications,
      albuterol:medications, 
      epinephrine: medications, 
      narcan: medications,
   }

   const unload = (e) => {
      e.preventDefault();
      const message = "Are you sure you want to leave? All provided data will be lost.";
      e.returnValue = message;
      return message;
   };

   usePrompt('Are you sure, you want to leave Registration process ? ', state.leave || false);

   const Components = medication ? med[slug] : equ[slug]

   return (
      <div style={{ display: 'flex', flexDirection: 'column' }} >
         <AddressBar page={[{ name: medication ? 'Medication' : 'Equipment', link: medication ? '/medication' : '/equipment' }, { name: 'Registration' }]} />
         <div className='Bg-fff rounded d-flex flex-column' style={{ height: '100%' }}>
            <Header active={active} stepCount={Components?.length} setActive={(e) => setActive(e)} completeId={completeId} />
            {
               Components?.map((component, key) => {
                  if (key + 1 === active) return <div key={key}> {component} </div>
                  return null;
               })
            }
         </div>
      </div>
   )
}
export default EquipmentRegistration;