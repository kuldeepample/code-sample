import React from 'react';
import { Col, Row } from "react-bootstrap";
import { Pressable, Container } from './common';
import { MdOutlineFilterList } from 'react-icons/md';

const FilterForm = (props) => {
  let { name, onFilterClick, onAddClick, onClearFilter, isClearable, isDisableAdd, dropdownButton } = props;
  return (
    <Container classes='align-items-between justify-content-between' lg={3} xs={1} >
      {onAddClick &&
        <Col lg={{ span: 'auto', order: 'first' }} xs={{ order: 'last', span: 'auto' }}>
          <Pressable
            title={`Add ${name} +`}
            classes='add-btn mt-2 text-nowrap'
            onPress={onAddClick}
            disabled={isDisableAdd}
          />
        </Col>
      }
      {dropdownButton &&
        <Col lg={{ span: 'auto', order: 'first' }} xs={{ order: 'last', span: 'auto' }} className='mt-2'>
          {dropdownButton}
        </Col>
      }
      <Col as={Row} xs={{ span: 12 }} className='m-0 p-0 filter-container'>
        {props.children}
      </Col>

      <Col xs={{ order: 'last', span: 'auto' }} lg={'auto'} className='d-flex flex-row justify-content-end mt-2'>
        <div className='d-flex flex-column align-items-end'>
          <Pressable
            classes='searchBtn d-flex'
            disabled={!onFilterClick}
            style={{ height: '30px', minWidth: '85px', fontSize: '14px' }}
            onPress={onFilterClick}
          ><p className='C-fff bold'>Filter &nbsp; </p> <MdOutlineFilterList size={18}/>
          </Pressable>
          {isClearable && <button
            disabled={!onClearFilter}
            className='C-primary edit-btn'
            style={{ height: '15px', fontSize: '11px' }}
            onClick={onClearFilter}
          ><u>Clear Filter</u>
          </button>}
        </div>
      </Col>
    </Container>
  )
}
export default FilterForm;