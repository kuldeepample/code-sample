import React from 'react'
import { Col } from 'react-bootstrap';
import DropDown from './DropDown';

const SortField = (props) => {
    const {sort, handleChange, sortData} = props;
    return (
        <>
            <div className='d-flex flex-row center' style={{paddingRight: '20px', zIndex: '10'}}>
                <p className='sort'>Sort</p>
                <DropDown
                    mainViewClass='d-flex'
                    emptySelect={false}
                    value={sort?.name} name='sort' placeholder='Sort'
                    onChange={(e) => {
                        let sortKey = JSON.parse(e.target.id)
                        handleChange(e, sortKey)
                    }}
                    data={sortData}
                />
            </div>
        </>
    )
}

export default SortField