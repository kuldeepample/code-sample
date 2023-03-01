
import { Modal, Button, Image, Spinner } from 'react-bootstrap';
import CloseButton from '@common/CloseButton'
import { MdOutlineInfo } from 'react-icons/md';
const ConfirmationModal = (props) => {
  let { header, show, closeModal, messageComponent, onAgree, isSubmitting } = props;
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
        <Modal.Title className='C-primary modalHeader bold text-truncate'>{header}</Modal.Title>
        <CloseButton onClose={closeModal} />
      </Modal.Header>
      <Modal.Body className='pt-2'>
        <div className='d-flex justify-content-center align-items-center'>
          <div className='d-flex justify-content-center align-items-center rounded-circle Shadow p-3'>
            {/* <Image src={} alt='delete' className='deleteIcon center' /> */}
            <MdOutlineInfo size={40} color='#cfc956'/>
          </div>
        </div>
        <div className='d-flex mt-3 flex-column justify-content-center'>
          <span className='text-center F-20'>{'Are you sure?'}</span>
          <span className='text-center F-14 mt-2'>{messageComponent}</span>
          <div className='d-flex mt-3 C-d6d6d6'>
            <Button onClick={closeModal} className='Bg-fff C-dark border-0 bold w-50 me-3 border-dark Shadow d-flex center align-items-center field'>Cancel</Button>
            <Button onClick={onAgree} className='Bg-primary C-fff border-0 bold w-50 Shadow d-flex center align-items-center field'>Yes, update</Button>
          </div>
        </div>
      </Modal.Body>
      {isSubmitting && <div style={{ zIndex: 1, position: 'absolute', opacity: 0.8 }} className='h-100 w-100 center Bg-fff'>
        <Spinner animation='border' />
      </div>}
    </Modal>
  )
}

export default ConfirmationModal;