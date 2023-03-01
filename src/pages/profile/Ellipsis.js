import React from 'react'
import { useState } from 'react'
import { IoEllipsisVerticalSharp } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom';
import ProfileTab from './ProfileTab';

const Ellipsis = ({active}) => {
    const [state, setState] = useState({});
    const { toggleTab = false } = state
    const navigate = useNavigate()

    const handleTab = (e) => {
        if (e.target.id === 'password'){
            navigate('/profile/change-password')
        }
        else if (e.target.id === 'general'){
            navigate('/profile')
        }
        else if (e.target.id === 'settings'){
            navigate('/profile/setting')
        }
     }
    return (
        <div className='d-lg-none pe-4' role={'button'} onClick={() => setState({ ...state, toggleTab: !toggleTab })}>
            <IoEllipsisVerticalSharp />
            {toggleTab ?
                <div className='profile-menu'>
                    <ProfileTab showTab handleTab = {handleTab} active={active}/>
                </div>
                : null
            }
        </div>
    )
}

export default Ellipsis