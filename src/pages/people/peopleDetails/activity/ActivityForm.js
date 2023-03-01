import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { TextInput, DropDown } from '@components/common';
import _ from 'lodash'

const ActivityForm = (props) => {
   const [equipment_model, setEquipmentModel] = useState('')
   let { handleOnChange, state, data, equipmentList, locationList } = props

   const setLocations = () => {
      let locations = locationList
      locations.forEach((key) => { key.location_id = `${key?.id}` });
      locations = _.intersectionBy(locations, equipmentList, 'location_id')
      return locations;
   }

   const setEquipmentModels = () => {
      let locationEquipments = equipmentList
      if (state?.location?.id)
         locationEquipments = _.filter(equipmentList, (key) => { return +key?.location_id === state?.location?.id });
      let assignedModels = _.uniqBy(locationEquipments.map(i => i.equipment_model), 'id')
      return assignedModels
   }

   const setEquipments = () => {
      let locationEquipments = equipmentList
      if (state?.location?.id)
         locationEquipments = _.filter(locationEquipments, (key) => { return +key?.location_id === state?.location?.id });
      if (equipment_model?.id)
         locationEquipments = _.filter(locationEquipments, (key) => { return key?.equipment_model?.id === equipment_model?.id });
      return locationEquipments
   }

   const handleLocationSelect = (location) => {
      handleOnChange({ ...state, location: location, equipment: {} });
      setEquipmentModel({});
   }

   const handleModelSelect = (model) => {
      handleOnChange({ ...state, equipment: {} });
      setEquipmentModel(model);
   }

   const handleEquipmentSelect = (equipment) => {
      handleOnChange({ ...state, equipment: equipment, location: equipment?.location });
      setEquipmentModel(equipment?.equipment_model);
   }

   return (
      <Form>
         <DropDown
            searchable
            lable='Location Name*'
            value={state?.location?.name || data?.location?.name}
            placeholder={'Select Location'}
            name='location'
            data={locationList}
            onChange={(e) => handleLocationSelect(JSON.parse(e.target.id))}
         />
         <DropDown
            searchable
            name='equipment_model'
            lable='Equipment Model'
            value={equipment_model?.name || data?.equipment?.equipment_model?.name}
            placeholder={'Select Equipment Model'}
            data={setEquipmentModels()}
            onChange={(e) => handleModelSelect(JSON.parse(e.target.id))}
         />
         <DropDown
            searchable
            lable='Equipment'
            emptySelect={false}
            value={state?.equipment?.name || data?.equipment?.serial_number}
            placeholder={'Select Equipment'}
            name='equipment'
            data={setEquipments()}
            onChange={(e) => handleEquipmentSelect(JSON.parse(e.target.id))}
         />

         <Form.Group>
            <Form.Label className='bold lable mt-1 C-dark' >
               File<span className='F-12 C-818188'>{" (optional)"}</span>
            </Form.Label>
            <Form.Control type="file"
               fileName={state?.file}
               size="md" className='dropDown border-0 h-100'
               onChange={(e) => handleOnChange({ ...state, file: e?.target?.files[0] })} />
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
                  handleOnChange({ ...state, note: e?.target?.value })
            }
            }
         />
         <p className='C-818188'>Characters allowed: {1000 - (state?.note || data?.note || '').length}</p>
      </Form>
   )
}
export default ActivityForm;