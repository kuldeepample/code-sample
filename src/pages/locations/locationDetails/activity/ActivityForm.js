import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { TextInput, DropDown } from '@components/common'
import _ from 'lodash';

const ActivityForm = (props) => {
   let { handleOnChange, user, state, data, equipmentList, equipmentModelList } = props
   const [values, setValues] = useState({})

   const setEquipmentModels = (models) => {
      let modelList = [];
      (models || []).forEach((key) => { modelList.push({ ...key, equipment_model_id: `${key.id}` }) });
      let assignedModels = _.intersectionBy(modelList, equipmentList, 'equipment_model_id')
      return assignedModels
   }

   const handleEquipmentSelect = (e, equipment) => {
      handleOnChange(e, equipment);
      setValues({ ...values, equipment_model: equipment?.equipment_model?.name });
   }

   const handleModelSelect = (name, model) => {
      let eqList = _.filter(equipmentList, key => { return key?.equipment_model?.name.toLowerCase().trim() === model?.toLowerCase().trim() })
      handleOnChange({ target: { name: 'equipment' } }, {});
      setValues({ ...values, [name]: model, equipmentDropdownList: _.isEmpty(eqList) ? equipmentList : eqList });
   }

   return (
      <Form>
         <TextInput lable='Location Name*' defaultValue={data?.name || data?.location?.name} disabled />
         <TextInput lable='User' defaultValue={`${user?.fname} ${user?.lname}`} disabled />
         <DropDown
            searchable
            name='equipment_model'
            lable='Equipment Model'
            value={values?.equipment_model || data?.equipment?.equipment_model?.name}
            placeholder={'Select Equipment Model'}
            data={setEquipmentModels(equipmentModelList)}
            onChange={(e) => handleModelSelect(e.target.name, e.target.text)}
         />
         <DropDown
            searchable
            name='equipment'
            lable='Equipment'
            value={state?.equipment?.name || data?.equipment?.serial_number}
            placeholder={'Select Equipment'}
            data={values?.equipmentDropdownList || equipmentList}
            onChange={(e) => handleEquipmentSelect(e, JSON.parse(e.target.id))}
         />
         <Form.Group>
            <Form.Label className='bold lable mt-1 C-dark' >
               File<span className='F-12 C-818188'>{" (optional)"}</span>
            </Form.Label>
            <Form.Control type="file"
               fileName={state?.file}
               size="md" className='dropDown border-0 h-100 Shadow'
               onChange={(e) => handleOnChange({ target: { name: "file" } }, e?.target?.files[0])} />
         </Form.Group>
         <TextInput
            lable='Note'
            isTextArea='textarea'
            style={{ height: '100px', resize: 'none' }}
            value={state?.note}
            defaultValue={state?.note || data?.note}
            placeholder='Note'
            name='note'
            onChange={(e) => {
               if (1000 - (e.target.value || '').length >= 0)
                  handleOnChange(e, e.target.value)
            }
            }
         />

         <p className='C-818188'>Characters allowed: {1000 - (state?.note || data?.note || '').length}</p>
      </Form>
   )
}
export default ActivityForm;