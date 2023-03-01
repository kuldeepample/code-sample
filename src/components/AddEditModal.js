import { Modal, Spinner } from 'react-bootstrap';
import { Pressable, CloseButton } from './common';

const AddEditModal = (props) => {
   let { closeModal, show, onSubmit, onAddNew, name, type, size, isStatic, isDisableSave, isDisableAddNew, isSubmitting, scrollable, fullscreen } = props;
   return (
      <Modal
         show={show}
         size={size}
         onHide={closeModal}
         backdrop={isStatic && 'static'}
         backdropClassName='bg-dark'
         aria-labelledby="contained-modal-title-vcenter"
         centered
         scrollable={scrollable}
         fullscreen={fullscreen}
      >
         <Modal.Header style={{ height: '50px' }}>
            <Modal.Title className='C-primary modalHeader text-truncate bold'>{type} {name}</Modal.Title>
            <CloseButton onClose={closeModal} />
         </Modal.Header>
         <Modal.Body className='pt-2'>
            {props.children}
         </Modal.Body>
         <Modal.Footer style={{ height: '50px' }} className='p-0'>
            <Pressable title='Close' onPress={closeModal} classes='Bg-fff C-dark me-3 modal-btn' />

            {onAddNew && <Pressable
               title='Add New'
               onPress={onAddNew}
               disabled={isDisableAddNew}
               classes='me-3 modal-btn' />}

            {type && <Pressable
               title={type === 'Add' ? 'Add' : type === 'Log' ? 'Log' : 'Save'}
               disabled={isDisableSave}
               onPress={onSubmit}
               classes='me-4 modal-btn'
               type={'submit'}
               form={'incidentForm'} />}

         </Modal.Footer>
         {isSubmitting && <div style={{ zIndex: 1, position: 'absolute', opacity: 0.8 }} className='h-100 w-100 center Bg-fff'>
            <Spinner animation='border' />
         </div>}
      </Modal>
   )
}
export default AddEditModal;