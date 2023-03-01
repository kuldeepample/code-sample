import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Container from '@common/Container';
import { getMobile, isNotUser } from '@/helpers';
import AddEditLocation from '@/components/AddEditLocation';
import { MdOutlineLocationOn } from 'react-icons/md';
import { TbPencil } from 'react-icons/tb';
import edit from '@images/edit.png'
import { HiOutlinePhone } from 'react-icons/hi';
import TimingModal from '@/components/TimingModal';
import moment from 'moment';

const LocationItemHeader = (props) => {
  const [state, setState] = useState({})
  const { location, showModal, showTimeModal } = state
  const { onEditLocation, data, currentUser } = props;

  const toggleEditModal = (data) => {
    if (data) setState({ ...state, location: data, showModal: true })
    else setState({ ...state, location: {}, showModal: false })
  }

  const currentDay = moment().format("dddd").slice(0, 2)
  const todayTiming = data?.times?.find((item) => item?.day === currentDay)
  const openingTime = todayTiming?.start
    ? moment(todayTiming?.start, 'HH:mm:ss').format('hh:mm A') :
    'Not available'
  const closingTime = todayTiming?.end
    ? ' - ' + moment(todayTiming?.end, 'HH:mm:ss').format('hh:mm A') :
    ''

  return (
    <Container classes='Shadow h-100 justify-content-center py-4'>
      <Col xs={'auto'} lg={'auto'} className='d-flex justify-content-center p-0'>
        <MdOutlineLocationOn size={28} color='#c60970' />
      </Col>
      <Col className='pe-0 ps-1 text-truncate'>
        <Row className='d-flex flex-row justify-content-between align-items-start p-0'>
          <Col className='d-flex flex-row' xs={'auto'} lg={'auto'}>
            <p className='itmText text-truncate C-primary bold mb-1'>{data?.name || ''}</p>
          </Col>
          <p className='itemText text-wrap C-818188 mt-1'>{data.address || ''}  {data.address2 || ''}, {data?.city || ''}, {data?.state || ''}, {data?.zip || ''}</p>
          <p className='itemText bold text-wrap C-818188 mt-1'><HiOutlinePhone color='#545454' /> {getMobile(data.mobile) || ""}</p>
        </Row>
        <div className='mt-3'>
          <p className='itemText bold text-nowrap C-dark mt-1'>
            Timing: <span className='C-818188'>Today- {todayTiming?.is_close ? 'Closed' : `${openingTime + closingTime}`}</span>
            {
              isNotUser() &&
              <button className='edit-btn'
                onClick={() => setState({ ...state, showTimeModal: true })} >
                <img src={edit} alt='Icon' className='zoom' />
              </button>
            }
          </p>
          <p className='itemText bold text-nowrap C-dark mt-1'>Number of Compliant: <span className='C-818188'>{data.totalCompliant || 0}</span></p>
          <p className='itemText bold text-nowrap C-dark mt-1'><span className='text-wrap '>Number of Non-Compliant: </span><span className='C-818188'>{data.totalNonCompliant || 0}</span></p>
        </div>
      </Col>
      {isNotUser() || currentUser?.id === data?.user?.id ?
        <Col className='d-flex justify-content-center px-0' xs={'auto'} lg={'auto'}>
          <button
            className='Bg-primary p-1 ms-1 border-0 rounded-circle center toolTip'
            onClick={() => toggleEditModal(data)}
          ><TbPencil size={20} color="#fff" />
          </button>
        </Col>
        : null
      }
      {showModal && <AddEditLocation
        show={showModal}
        location={location}
        type='Edit' name='Location'
        closeModal={() => toggleEditModal()}
        onSuccess={() => { onEditLocation(); toggleEditModal(); }}
      />}
      {
        showTimeModal &&
        <TimingModal show={showTimeModal} handleModal={() => {
          onEditLocation()
          setState({ ...state, showTimeModal: false })
        }}
          locationId={data?.id} times={data?.times} />
      }

    </Container>
  )
}

export default LocationItemHeader;