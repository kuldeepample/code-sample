import { useState } from "react"
import { Row, Col, Form } from 'react-bootstrap';
import { TextInput, DropDown, ImagePicker } from "../common";
import _ from 'lodash'
import { connect, useDispatch, useSelector } from 'react-redux';
import { formatMobile, isNotUser } from "helpers";
import { uploadImage } from "@/services";


const PeopleForm = (props) => {
   const dispatch = useDispatch()
   const reducerData = useSelector((state) => {
      return {
         currentUser: state.auth.user,
         userRoleList: state.people.userRoleList
      }
   })
   const { currentUser, userRoleList } = reducerData
   let { handleOnChange, formData, validation, isEdit } = props
   const [state, setState] = useState({
      loading: false,
      progress: 0,
   })

   const getUploadPercent = (n) => setState({ loading: true, progress: n })

   const handleFileChange = (e) => {
      if (e.target?.files[0]) {
         let filess = new FormData();
         filess.append('image', e.target?.files[0], e.target?.files[0]?.name);
         setState({ loading: true, progress: 0 })
         dispatch(uploadImage({filess, getPercent: (n) => getUploadPercent(n)})).unwrap().then((res) => {
            if (res?.success) {
               handleOnChange({ target: { name: 'image' } }, res?.data?.url);
               setState({ ...state, loading: false })
            }
         })
      }
   }

   return (
      <Form >
         <Row>
            <Col className='d-flex flex-column justify-content-evenly bg-inf align-items-cnter'>
               <TextInput lable='First Name*' placeholder='First Name'
                  value={formData?.fname} name='fname'
                  classes='text-capitalize'
                  onChange={(e) => handleOnChange(e, e.target.value)}
                  validationText={validation['fname'] === 'required' ? `First Name is required` : validation['fname'] === 'inValid' ? 'Invalid First Name.' : ''} />

               <TextInput lable='Last Name*' placeholder='Last Name'
                  value={formData?.lname} name='lname'
                  onChange={(e) => handleOnChange(e, e.target.value)}
                  classes='text-capitalize'
                  validationText={validation['lname'] === 'required' ? `Last Name is required` : validation['lname'] === 'inValid' ? 'Invalid Last Name.' : ''} />
            </Col>
            <Col>
               <ImagePicker image={formData?.image || formData?.image} onChangeFile={(e) => handleFileChange(e)} states={state} />
            </Col>
         </Row>
         <Row>
            <Col>
               <DropDown as={Col} lable='User Role' placeholder='User Role' name='user_role'
                  emptySelect={false}
                  value={formData?.user_role?.name}
                  data={userRoleList}
                  onChange={(e) => handleOnChange(e, JSON.parse(e.target.id))}
                  validationText={validation['user_role'] ? `User Role is required` : ''}
               />
            </Col>
            {isNotUser()
               ? <Col>
                  <DropDown as={Col} lable='Status' placeholder='Status' name='status'
                     emptySelect={false}
                     value={formData?.status}
                     data={['Active', 'Inactive']}
                     classes='text-capitalize'
                     onChange={(e) => handleOnChange(e, e.target.text)}
                  />
               </Col>
               : null}
         </Row>
         <Row>
            <TextInput as={Col} lable='Email*' placeholder='Email'
               value={formData && formData.email}
               name='email'
               onChange={(e) => handleOnChange(e, e.target.value)}
               disabled={isEdit}
               validationText={validation['email'] === 'required' ? `Email is required` : validation['email'] === 'inValid' ? `Invalid Email` : ''}
            />
            <TextInput as={Col} lable='Phone Number*' placeholder='Phone Number' value={formatMobile(formData?.mobile)} name='mobile' onChange={(e) => handleOnChange(e, e.target.value)}
               validationText={validation['mobile'] === 'required' ? `Phone Number is required` : validation['mobile'] === 'inValid' ? 'Invalid phone number.' : ''} />
         </Row>
      </Form>
   )
}
function mapStateToProps(state) {

}
const actionCreators = {
   // uploadImage: (data, callBack) => uploadImage(data, callBack),
};
export default connect(mapStateToProps, actionCreators)(PeopleForm);