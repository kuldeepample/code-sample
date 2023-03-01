import React, { useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import avatar from '@images/avatar1.png';
import Container from '@common/Container';
import { connect, useSelector } from 'react-redux';
import { getMobile, isNotUser } from '@/helpers';
import AddEditPeople from '@/components/people/AddEditPeople';
import { TbPencil } from 'react-icons/tb';

const PeopleHeader = (props) => {
  const [state, setState] = useState({})
  const { showModal } = state
  const reducerData = useSelector((state) => {
    return {
      currentUser: state.auth.user,
    }
  })
  const { currentUser } = reducerData
  const { onEditPeople, data } = props;
  let { image, fname, lname, email, mobile, user_role } = data;

  const toggleEditModal = () => setState({ ...state, showModal: !showModal })

  return (
    <Container style={{ minHeight: '120px' }} classes='Shadow justify-content-center'>
      <Col xs={4} sm={2} md={2} lg={2} className='d-flex justify-content-center ps-0'>
        <div className='B-primary peopleDetailProfile'>
          <Image src={image || avatar} alt='Avatar' className='h-100 w-100' />
        </div>
      </Col>
      <Col as={Row} xs={8} sm={10} md={10} lg={10} className='p-0 m-0 center align-items-around justify-content-start'>
        <Row as={Col} className='m-0 d-flex align-items-center h-100 ps-1 pe-0'>
          <Col xs={12} sm={12} md={5} lg={5} className='p-0 d-flex flex-column h-50 justify-content-around '>
            <p className='tabs C-primary'>{fname || ''} {lname || ''}</p>
            <p className='itemText C-dark'>User Role: <span className='C-818188'>{user_role?.name}</span></p>
          </Col>
          <Col xs={12} md={6} lg={5} className='p-0 d-flex flex-column h-50 justify-content-around itemText C-dark'>
            <p className='itemText C-dark'>Phone Number: <span className='C-818188'>{getMobile(mobile)}</span></p>
            <p className='itemText C-dark'>Email: <span className='C-818188'>{email}</span></p>
          </Col>
        </Row>
        {(currentUser?.id === data?.id || isNotUser()) &&
          <Col xs={1} md={1} lg={2} style={{ maxWidth: '10px' }} className='p-0 p-md-1 p-xs-0 d-flex justify-content-end align-items-start h-100'>
            <button
              className='Bg-primary p-1 ms-1 border-0 rounded-circle center toolTip'
              onClick={() => toggleEditModal(data)}
            ><TbPencil size={20} color="#fff" />
            </button>
          </Col>
        }
      </Col>

      {showModal &&
        <AddEditPeople
          show={showModal}
          user={data}
          type='Edit' name="People"
          closeModal={() => toggleEditModal()}
          onSuccess={() => { onEditPeople(); toggleEditModal(); }}
        />}
    </Container>
  )
}

function mapStateToProps(state) {

}

export default connect(mapStateToProps, null)(PeopleHeader);