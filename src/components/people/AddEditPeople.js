import { useEffect, useState } from "react";
import AddEditModal from "../AddEditModal";
import PeopleForm from "./PeopleForm";
import _ from 'lodash'
import { isValidMobile } from "helpers";
import { connect, useDispatch, useSelector } from "react-redux";
import isEmail from "validator/lib/isEmail";
import { addPeople, getLicensePermissions, getUserProfile, updatePeopleDetail } from "@/services";
import { toast } from "react-toastify";

const AddEditPeople = (props) => {
    const dispatch = useDispatch();
    const reducerData = useSelector((state) => {
        return {
            currentUser: state.auth.user
        }
    })
    const { currentUser } = reducerData
    const [state, setState] = useState({});
    const { validationMessage, formData, isSubmitting, isFormEdited } = state
    const { show, type, name, closeModal, user, onSuccess } = props;

    useEffect(() => {
        if (user && !_.isEmpty(user))
            setState({ ...state, formData: user })
        else
            setState({ ...state, formData: { status: 'Active' } })
    }, [])

    const handleFormChange = (e, value) => setState({ ...state, isFormEdited: true, formData: { ...formData, [e.target.name]: value } });

    const handleFormSubmit = () => {
        let { fname, lname, mobile, email, user_role, image, status } = formData
        let isMobileValid = isValidMobile(mobile)
        let validate = {};
        if (!/^[A-Za-z\s]+$/.test(fname)) validate['fname'] = 'inValid';
        if (!fname) validate['fname'] = 'required';
        if (!/^[A-Za-z\s]+$/.test(lname)) validate['lname'] = 'inValid';
        if (!lname) validate['lname'] = 'required';
        if (!isEmail(email || '')) validate['email'] = 'inValid';
        if (!email) validate['email'] = 'required';
        if (!isMobileValid) validate['mobile'] = 'inValid';
        if (!mobile) validate['mobile'] = 'required';
        if (!user_role?.id) validate['user_role'] = 'required';

        setState(prev => ({ ...prev, validationMessage: validate }))
        if (_.isEmpty(validate)) {
            const userData = {
                fname: fname, lname: lname,
                email: email, image: image,
                mobile: mobile.replace(/\D/g, "").substring(0, 10),
                user_role_id: user_role?.id,
                status: status.toLowerCase(),
            }

            setState(prev => ({ ...prev, isSubmitting: true }));
            dispatch(user?.id
                ? updatePeopleDetail({id: user.id, data: userData})
                : addPeople(userData)
            ).unwrap().then((res) => {
                if (res?.success) {
                    toast.success(res?.message)
                    if (res?.data?.id === currentUser.id) dispatch(getUserProfile())
                    if (!user?.id) dispatch(getLicensePermissions())
                    onSuccess();
                }
                else{
                    toast.error(res.message)
                    setState(prev => ({ ...prev, isSubmitting: false }));
                }
            }).catch((err) => {
            })
            ;
        }
    }

    return (
        <AddEditModal
            show={show}
            type={type} name={name}
            isDisableSave={!isFormEdited}
            isSubmitting={isSubmitting}
            closeModal={closeModal}
            onSubmit={() => handleFormSubmit()}
        >
            <PeopleForm
                isEdit={type === 'Edit'}
                formData={formData}
                handleOnChange={(e, value) => handleFormChange(e, value)}
                validation={validationMessage || {}}
            />
        </AddEditModal>
    )
}
const mapStateToProps = (state) => {
    
}
const actionCreators = {
    // addPeople: (data) => addPeople(data),
    // getLicensePermissions: () => getLicensePermissions(),
    // getUserProfile: () => getUserProfile(),
    // updatePeopleDetail: (id, data) => updatePeopleDetail(id, data)
}

export default connect(mapStateToProps, actionCreators)(AddEditPeople);