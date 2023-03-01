import React from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import avatar from '@images/default-avatar.png';
import { getMobile } from '@/helpers';

const PeopleModalListItem = (props) => {
  let { item } = props;
  return (
    <Row as={Col} xs={'auto'}
      className={`ms-sm-2 B-fff w-100 d-flex flex-row align-items-center`}
      style={{ minHeight: '78px' }}
    >
      <Col lg={1} md={2} xs={2} className='p-0 d-flex flex-row align-items-center justify-content-between'>
        <Image src={item?.image || avatar} alt='avatar' className='avatar me-1 mb-1 rounded-circle border' />
      </Col>
      <Col as={Row} lg={11} md={10} xs={10} className='d-flex align-items-center m-0 p-0'>
        <Col lg={3} md={6} className='itemText C-primary bold collapseble '>{item.fname || ''} {item.lname || ''}</Col>
        <Col lg={3} md={6} className='itemText C-818188 '>{getMobile(item.mobile) || 'NA'}</Col>
        <Col lg={4} md={7} className='itemText C-818188 text-truncate'>{item.email || 'NA'}</Col>
        <Col lg={2} md={5} className='itemText C-818188 '>{item?.user_role?.name || 'NA'}</Col>
      </Col>
    </Row>
  )
}

export default PeopleModalListItem;