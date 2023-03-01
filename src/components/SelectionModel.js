import { CloseButton, Pressable } from '@/components/common'
import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux';

const SelectionModel = (props) => {
    const { selectionModel, onHide, categoryList, moduleName, onClick} = props;
    const permissions = useSelector((state) => state.auth.licensePermissions)
  return (
    <>
        <Modal
        show={selectionModel}
        onHide={() => onHide()}
        backdrop={'static'}
        centered
      >
        <Modal.Header style={{ height: '50px' }}>
          <Modal.Title className='C-primary modalHeader text-truncate bold'>Select {moduleName} Type</Modal.Title>
          <CloseButton onClose={() => onHide()} />
        </Modal.Header>
        <Modal.Body className='pt-2 d-flex  align-items-center' style={{ minHeight: window.innerHeight / 4.8 }}>
          <Row className="w-100">
            {
              categoryList?.map((item, id) => {
                const isDisable = !(permissions && permissions[item?.slug]?.canCreate)
                return (
                  <Col xs={6} sm={categoryList?.length > 3 ? 4 : 12/categoryList?.length} className="center my-2">
                    <Pressable disabled={isDisable} key={id} title={item.name} onPress={() => onClick(item)} classes='text-truncate d-block' style={{ width: '100px' }} />
                  </Col>
                )
              })
            }
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default SelectionModel