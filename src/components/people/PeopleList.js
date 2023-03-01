import React, { useState } from 'react';
import { Image, Modal, Spinner } from 'react-bootstrap';
import _ from 'lodash';
import { DeleteModal } from '@components';
import { toast } from 'react-toastify';
import userIcon from '@images/user_type.png';
import PeopleItem from '@/components/people/PeopleItem';
import { CloseButton, Pressable, EmptyComponent } from '../common';
import AddEditPeople from './AddEditPeople';

const PeopleList = (props) => {
  const [state, setState] = useState({});

  const { activeItemData, editModal, show, deleteModal, loading } = state
  let { handleEditUser, handleDeleteUser, parentData, peopleList, empty, onAddNew } = props;

  const openEditModal = data => setState({ ...state, activeItemData: data, editModal: parentData?.location_id ? 1 : 2, show: false, loading: false })

  const openDeleteModal = data => setState({ ...state, activeItemData: data, deleteModal: true, loading: false, show: false });

  const handleClick = async (typeId, userId) => { /* ON EQUIPMENT MODULE */
    if (typeId === activeItemData?.equipment_users[0]?.user_type?.id)
      toast.warn(`Already ${activeItemData?.equipment_users[0]?.user_type?.name}`)
    else {
      let data = {
        itemUserId: activeItemData?.equipment_users[0]?.id,
        user_type_id: typeId,
        user_id: userId,
        itemId: activeItemData?.equipment_users[0]?.equipment_id
      }
      setState({ ...state, loading: true })
      handleEditUser({
        data: data,
        state: () => setState({ ...state, editModal: false, show: undefined, loading: false })
      })
    }
  }

  const onSuccessEdit = () => {   /* ON LOCATION MODULE */
    handleEditUser({
      state: () => setState({ ...state, editModal: false, show: undefined })
    })
  }

  const deleteUser = () => {
    let lastItem;
    if (peopleList.length === 1) {
      lastItem = true
    }
    setState({ ...state, loading: true })
    handleDeleteUser({
      user_id: (parentData?.location_id) ?
        activeItemData?.equipment_users[0]?.id
        : activeItemData?.id,
      state: (isOpenModal) => setState({ ...state, deleteModal: isOpenModal || false, show: undefined, loading: false }),
      lastItem
    })
  }

  return (
    <>
      {!_.isEmpty(peopleList) ? peopleList.map((item, key) => {
        return (
          <PeopleItem key={key}
            item={item}
            user_type={item?.equipment_users && item?.equipment_users[0]?.user_type}
            showMenu={show}
            onClickEdit={() => { openEditModal(item); }}
            onClickDelete={() => { openDeleteModal(item); }}
          />
        )
      })
        : peopleList === true ?
          <div className='flex-grow-1 center align-items-center'>
            <Spinner animation='border' />
          </div>
          :
          <EmptyComponent title='People' empty={empty}
            onAddNew={empty && onAddNew} />
      }
      {editModal === 2 &&
        <AddEditPeople
          user={activeItemData?.user || activeItemData}
          show={editModal}
          type='Edit' name="People"
          closeModal={() => setState({ ...state, editModal: false, show: undefined })}
          onSuccess={() => onSuccessEdit()}
        />}
      {
        editModal === 1 &&
        <Modal
          show={editModal}
          onHide={() => setState({ ...state, editModal: false, show: undefined })}
          size={"sm"}
          backdropClassName='bg-dark'
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header style={{ height: '50px' }}>
            <Modal.Title className='C-primary modalHeader bold text-truncate'>Edit user type</Modal.Title>
            <CloseButton onClose={() => setState({ ...state, editModal: false, show: undefined })} />
          </Modal.Header>
          <Modal.Body className='pt-2'>
            <div className='d-flex center align-items-center'>
              <div className='d-flex center align-items-center rounded-circle Shadow p-1' style={{ height: '66px', width: '66px' }}>
                <Image src={activeItemData?.image || userIcon} alt='User icon' className='rounded-circle  h-100 w-100' />
              </div>
            </div>
            <div className='d-flex mt-3 flex-column'>
              <div className='d-flex mt-2 justify-content-around'>
                <Pressable title="Primary" onPress={() => handleClick(1, activeItemData.id)}
                  classes={activeItemData?.equipment_users[0]?.user_type?.id === 1 ? "userTypeBtn" : "userTypeBtn Bg-fff C-dark"} />
                <Pressable title="Secondary" onPress={() => handleClick(2, activeItemData.id)}
                  classes={activeItemData?.equipment_users[0]?.user_type?.id === 2 ? "userTypeBtn" : "userTypeBtn Bg-fff C-dark"} />
              </div>
            </div>
          </Modal.Body>
          {loading && <div style={{ zIndex: 1, opacity: 0.8, position: 'absolute' }} className='w-100 h-100 center Bg-fff'>
            <Spinner animation='border' />
          </div>}
        </Modal>
      }
      {deleteModal &&
        <DeleteModal
          show={deleteModal}
          name={`${activeItemData?.user?.fname || activeItemData?.fname} from ${parentData?.name || parentData?.serial_number || parentData?.lot_number}`}
          isSubmitting={loading}
          closeModal={() => setState({ ...state, deleteModal: false, show: undefined })}
          messageComponent={<p className='lable mt-1 text-center'>Are you sure you want to remove <b>{activeItemData?.user?.fname || activeItemData?.fname}</b> from <b>{parentData?.name || parentData?.serial_number || parentData?.lot_number}</b>?</p>}
          onClickDelete={() => { deleteUser() }}
        />
      }
    </>
  )
}

export default PeopleList;


