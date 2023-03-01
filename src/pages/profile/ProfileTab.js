import React from 'react'
import { IoInformationCircleOutline,  } from 'react-icons/io5'
import { IoIosLock, IoIosSettings  } from 'react-icons/io'

const ProfileTab = ( props) => {

    const {handleTab, active, showTab} = props

  return (
    <>
        <div className={`profile-tab C-dark ${showTab ? 'd-block' : 'd-none'} d-lg-block`} onClick={(e) => handleTab(e)}>
            <div className={`pb-2 ${active === 'general' ? 'active-tab' : 'inactive-tab'}`} id='general' role={'button'}> <IoInformationCircleOutline size={20} className='me-1'/> General</div>
            <div className={`pb-2 ${active === 'password' ? 'active-tab' : 'inactive'}`} id='password' role={'button'}> <IoIosLock size={20} className='me-1'/> Change Password</div>
            <div className={`${active === 'settings' ? 'active-tab' : 'inactive-tab'}`} id='settings' role={'button'}> <IoIosSettings size={20} className='me-2'/>Preferences</div>
        </div>
    </>
  );
}

export default ProfileTab;