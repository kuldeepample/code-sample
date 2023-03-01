import React from "react";
import peopleIcon from '@images/peopleIcon.png';
import circle from '@images/circle.png';
import './../../theme/Colors.css';
import './index.css';

const UserCard = ({ people }) => {
  let cardBg = people?.total === 0 ? 
                  `linear-gradient(90deg, rgba(166,166,166,1) 14%, rgba(129,129,136,1) 70%, rgba(93,94,102,1) 100%)`
                  : `linear-gradient(to right,#F83EA3,#E62B90,#CA0D74)`;
  return (
    <div className='cards d-flex flex-row justify-content-between mt-2 Shadow'
      style={{ background: cardBg }}
    >
      <div className='d-flex flex-column justify-content-evenly C-fff p-4 h-100'
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <img src={peopleIcon} alt='icon' style={{ height: '27px', width: '27px' }} />
        <div>
          <p className=' bold' style={{ fontSize: '12px' }}>All People</p>
          <p className='bold' style={{ fontSize: '18px' }}>{people?.total}</p>
        </div>
      </div>
      <div className='d-flex flex-column w-50' style={{ zIndex: 0 }}>
        <img src={circle} alt='Icon'
          style={{ height: '68%', position: 'absolute', right: 0 }}
        />
        <img src={circle} alt='Icon'
          style={{ height: '68%', position: 'absolute', right: 10, bottom: 0 }}
        />
      </div>
    </div>
  )
}
export default UserCard;
