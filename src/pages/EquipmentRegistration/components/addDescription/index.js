import { useEffect, useState } from 'react';

import Footer from '../../Footer'
import TextInput from "@common/TextInput";

import { connect } from 'react-redux';
import { toast } from 'react-toastify';

const AddDescription = (props) => {
   const { active, state, handleChange, goBack, goForward, id} = props;
   const [char, setChar] = useState(300)

   useEffect(() => {
      if (state.description) {
         setChar(300 - state.description.length)
      }
   }, [])
   const handleOnChange = (value) => {
      let a = value.length;
      if (300 - a >= 0) {
         setChar(300 - a);
         handleChange('description', value)
      }
   }
   const handleForward = () => {
      if (state?.description) {
         goForward(id)
      }
      else
         toast.warn('Please write description !')
   }
   return (
      <div className='h-100 d-flex flex-column justify-content-between pb-3'
         style={{ minHeight: window.innerHeight - 230 }}
      >
         <div className='d-flex flex-column'>
            <div className='Bg-light C-primary ps-4 d-flex align-items-center'>Add Description</div>
            <div className='p-4 flex-column'>
               <TextInput
                  isTextArea='textarea'
                  name='description'
                  value={state.description}
                  placeholder='Add location description...'
                  style={{ height: '140px' }}
                  onChange={(e) => handleOnChange(e.target.value)}
                  validationText={`Characters allowed: ${char}`}
                  validationTextClass='d-flex justify-content-end C-dark'
               />
            </div>
         </div>
         <Footer active={active} goBack={() => goBack()} goForward={() => handleForward()} />
      </div>
   )
}
export default connect(null, null)(AddDescription);