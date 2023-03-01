import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap';

const Switch = (props) => {
    const { text, handleSwitch = () => '' , isActive, disable} = props

    const switchBtnColor = isActive ? 'Bg-success' : 'Bg-danger'

    return (
        <>
            <Col lg={'auto'} className='ps-3 d-flex align-items-center' style={{opacity: `${disable ? '0.5' : '1'} `}}>
                <input
                    className="switch-checkbox"
                    id={`switch`}
                    checked={isActive}
                    type="checkbox"
                />
                <button
                    onClick={(e) =>{ handleSwitch(!isActive)}}
                    className={`switch-label`}
                    htmlFor={`switch`}
                    style={{cursor: disable ? 'default' : 'pointer'}}
                >
                    <span className={`switch-button ${switchBtnColor}`} />
                </button>
                {text && <span className='ps-3 d-xl-block d-none'>{isActive ? 'Enabled' : 'Disabled'}</span>}
                {/* <span className='C-818188 ps-2' style={{ minWidth: '70px' }}>
                </span> */}
            </Col>
        </>
    )
}

export default Switch