import React from 'react';
import { Row, Col, Form, } from 'react-bootstrap';
import { AutoCompleteInput,TextInput } from './common';
import { formatMobile } from '@/helpers';

const LocationForm = ({ location, _handleFormChange, _handlePlaceSelect, validationMessage, isEdit }) => {
  return (
    <Form >
      <TextInput lable='Location Name*' placeholder='Location Name' value={location?.name} name='name' onChange={_handleFormChange}
        validationText={validationMessage['name'] ? validationMessage['name'] : ''} />
      <AutoCompleteInput lable='Address 1*' placeholder={'Address'} value={location?.address} name='address' onChange={_handleFormChange}
        handleSelect={_handlePlaceSelect} validationMessage={validationMessage} disabled={isEdit} />
      <Row>
        <TextInput as={Col} lable='Address 2' placeholder={'Address 2'} value={location?.address2 || ''} name='address2' onChange={_handleFormChange} />
        <TextInput as={Col} lable='City*' placeholder={'City'} value={location?.city} name='city' onChange={_handleFormChange}
          validationText={validationMessage['city'] ? `City is required` : ''} disabled={isEdit} />
      </Row>
      <Row>
        <TextInput as={Col} lable='State*' placeholder={'State'} value={location?.state} name='state' onChange={_handleFormChange}
          validationText={validationMessage['state'] ? `State is required` : ''} disabled={isEdit} />
        <TextInput as={Col} lable='Country*' placeholder={'Country'} value={location?.country} name='country' onChange={_handleFormChange}
          validationText={validationMessage['country'] ? `Country is required` : ''} disabled={isEdit} />
      </Row>
      <Row>
        <TextInput as={Col} lable='Zip*' placeholder={'Zip'} value={location?.zip} name='zip' onChange={_handleFormChange}
          validationText={validationMessage['zip'] ? `Zip is required` : ''} disabled={isEdit} />
        <TextInput as={Col} lable='Phone Number*' placeholder={'Phone Number'} value={formatMobile(location?.mobile)} name='mobile' onChange={_handleFormChange}
          validationText={validationMessage['mobile'] === 'required' ? `Phone Number is required` : validationMessage['mobile'] === 'inValid' ? 'Invalid phone number.' : ''} />
      </Row>
    </Form>
  );
}

export default LocationForm;
