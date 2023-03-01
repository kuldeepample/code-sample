
import { Modal, Button, Image, Spinner } from 'react-bootstrap';
import deleteIcon from '@images/delete.png'
import CloseButton from '@common/CloseButton'
const DeleteModal = (props) => {
  let { cancel, name, show, closeModal, messageComponent, onClickDelete, isSubmitting, Icon } = props;
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
        <Modal.Title className='C-primary modalHeader bold text-truncate text-capitalize'>{ name ? `Remove ${name}` : cancel ? `${cancel}` : ''}</Modal.Title>
        <CloseButton onClose={closeModal} />
      </Modal.Header>
      <Modal.Body className='pt-2'>
        <div className='d-flex justify-content-center align-items-center'>
          <div className='d-flex justify-content-center align-items-center rounded-circle Shadow p-3'>
            {Icon ||  <Image src={deleteIcon} alt='delete' className='deleteIcon center' /> }
          </div>
        </div>
        <div className='d-flex mt-3 flex-column'>
          {messageComponent}
          <div className='d-flex mt-2'>
            <Button onClick={closeModal} className='Bg-fff C-dark border-0 bold w-50 me-3 border-dark Shadow d-flex center align-items-center field'>Close</Button>
            <Button onClick={onClickDelete} className='Bg-primary C-fff border-0 bold w-50 Shadow d-flex center align-items-center field'>{ cancel ? 'Yes' : 'Remove'}</Button>
          </div>
        </div>
      </Modal.Body>
      {isSubmitting && <div style={{ zIndex: 1, position: 'absolute', opacity: 0.8 }} className='h-100 w-100 center Bg-fff'>
        <Spinner animation='border' />
      </div>}
    </Modal>
  )
}

export default DeleteModal;