
import { Modal, Image } from 'react-bootstrap';
import _ from 'lodash'
import userIcon from '@images/user_type.png';
import { CloseButton, Pressable } from '../common';
import { useSelector } from 'react-redux';

const UserTypeModal = (props) => {
    let { show, closeModal, userData, selectedPeople, checkedPeople, handleSelection, forEquipment } = props;
    const userTypes = useSelector((state) => state?.people?.userTypes);
    return (
        <Modal
            show={show}
            onHide={closeModal}
            size={"sm"}
            backdropClassName='bg-dark'
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header style={{ height: '50px' }}>
                <Modal.Title className='C-primary modalHeader bold text-truncate'>Make this User{forEquipment && ` for ${forEquipment}`}</Modal.Title>
                <CloseButton onClose={closeModal} />
            </Modal.Header>
            <Modal.Body className='pt-2'>
                <div className='d-flex center align-items-center'>
                    <div className='d-flex center align-items-center rounded-circle Shadow p-1' style={{ height: '66px', width: '66px' }}>
                        <Image src={userData?.image || userIcon} alt='User Image' className='rounded-circle center w-100 h-100' />
                    </div>
                </div>
                <div className='d-flex mt-3 flex-column'>
                    <div className='d-flex mt-2 justify-content-around'>
                        {
                            userTypes?.map((item) => {
                                return <Pressable title={item?.name} onPress={() => handleSelection(item.id)}
                                    classes={(!_.isEmpty(selectedPeople) && selectedPeople[_.indexOf(checkedPeople, userData.id)]?.user_type_id) === item.id ? "userTypeBtn" : "userTypeBtn Bg-fff C-dark"} />
                            })
                        }
                        {/* <Pressable title="Primary" onPress={() => handleSelection(1)}
                            classes={(!_.isEmpty(selectedPeople) && selectedPeople[_.indexOf(checkedPeople, userData.id)]?.user_type_id === 1) ? "userTypeBtn" : "userTypeBtn Bg-fff C-dark"} />
                        <Pressable title="Secondary" onPress={() => handleSelection(2)}
                            classes={(!_.isEmpty(selectedPeople) && selectedPeople[_.indexOf(checkedPeople, userData.id)]?.user_type_id === 2) ? "userTypeBtn" : "userTypeBtn Bg-fff C-dark"} /> */}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default UserTypeModal;