import { useEffect, useState } from "react";
import AddEditModal from "./AddEditModal";
import LocationForm from "./LocationForm";
import _ from 'lodash'
import { isValidMobile } from "helpers";
import { addLocation, editLocation, getLicensePermissions } from "@/services";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";


const AddEditLocaion = (props) => {
    const dispatch = useDispatch()
    const [state, setState] = useState({});
    const { validationMessage, formData = {}, isSubmitting, isFormEdited } = state
    const { show, type, name, closeModal, location, onSuccess } = props

    useEffect(() => {
        if (location && !_.isEmpty(location))
            setState({ ...state, formData: location })
        else
            setState({ ...state, formData: {} })
    }, [])

    const handleFormChange = (e) => setState({ ...state, isFormEdited: true, formData: { ...formData, [e.target.name]: e.target.value } });

    const handlePlaceSelect = (address) => {
        let newState = {
            ...formData,

            address: address.address,
            city: address.city,
            state: address.state,
            state_code: address.state_code,
            country: address.country,
            zip: address.zipcode,
            lat: address.lat,
            lng: address.lng,
            isFormEdited: true,
        }
        setState({ ...state, formData: newState });
    }

    const checkDisable = () => {
        let { name, address, state, city, mobile, country, zip } = formData
        if (name && address && state && city && mobile && country && zip) {
            return false
        } else return true
    }

    const handleFormSubmit = () => {
        let { name, address, state, city, mobile, country, zip } = formData
        let isMobileValid = isValidMobile(mobile)
        let validate = {};
        if (!name) validate['name'] = `Location Name is required`;
        if (!address) validate['address'] = 'required';
        if (!state) validate['state'] = 'required';
        if (!isMobileValid) validate['mobile'] = 'inValid';
        if (!mobile) validate['mobile'] = 'required';
        if (!city) validate['city'] = 'required';
        if (!country) validate['country'] = 'required';
        if (!zip) validate['zip'] = 'required';
        if( name.length > 130) validate['name'] = 'Location name is too large'

        setState(prev => ({ ...prev, validationMessage: validate }))
        if (_.isEmpty(validate)) {
            if (location?.id) {
                setState(prev => ({ ...prev, isSubmitting: true }))
                dispatch(editLocation({ data: formData, id: location.id })).unwrap().then((res) => {
                    if (res?.success) {
                        toast.success(res?.message)
                        onSuccess();
                    }
                    else
                        setState(prev => ({ ...prev, isSubmitting: false }))
                });
            } else {
                setState(prev => ({ ...prev, isSubmitting: true }))
                dispatch(addLocation(formData)).unwrap().then((res) => {
                    if (res?.success) {
                        toast.success(res?.message)
                        onSuccess(res?.data);
                        dispatch(getLicensePermissions());
                    }
                    else
                        setState(prev => ({ ...prev, isSubmitting: false }))
                });
            }
        }
    }

    return (
        <AddEditModal
            show={show}
            type={type} name={name}
            isDisableSave={checkDisable()}
            isSubmitting={isSubmitting}
            closeModal={closeModal}
            onSubmit={() => handleFormSubmit()}
        >
            <LocationForm
                isEdit={type === 'Edit'}
                location={formData}
                _handleFormChange={handleFormChange}
                _handlePlaceSelect={handlePlaceSelect}
                validationMessage={validationMessage || {}}
            />
        </AddEditModal>
    )
}

export default AddEditLocaion;