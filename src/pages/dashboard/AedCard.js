import React from "react";
import devicesIcon from '@images/heartIcon.png';
import circle from '@images/circle.png';
import './../../theme/Colors.css';
import './index.css';
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const AedCard = ({ aed = {}, medication }) => {
  let { totalWarning, totalDanger, totalInfo, totalCount } = aed;
  const cardType = medication ? 'Medication' : 'Equipment'
  let data = {
    aedStatus: '',
    aedCount: '',
    background: ``,
    linkText: '',
    level: '',
  }
  let { aedStatus, aedCount, background, linkText, level } = data

  if (totalDanger) {
    aedStatus = 'Have Warnings';
    aedCount = `${totalDanger} ${cardType}`;
    background = `linear-gradient(to right,#FA011E,#F7021E,#CC071E)`;
    linkText = 'Click Here to View';
    level = 'danger';
  } else if (totalWarning) {
    aedStatus = 'Need your Attention';
    aedCount = `${totalWarning} ${cardType}`;
    background = `linear-gradient(to right,#FDBC23,#F6B316,#ECA703)`;
    linkText = 'Click Here to View';
    level = 'warning';
  } else if (totalInfo) {
    aedStatus = 'Ready for Use';
    aedCount = `All ${cardType}`;
    background = `linear-gradient(to right,#52BE63,#3DB44F,#089A1E)`;
    linkText = '';
    level = 'info';
  } else if (totalCount === 0) {
    aedStatus = '--';
    aedCount = `No ${cardType} registered`;
    background = `linear-gradient(90deg, rgba(166,166,166,1) 14%, rgba(129,129,136,1) 70%, rgba(93,94,102,1) 100%)`;
    linkText = '';
  }

  if (aedCount) {
    return (
      <div className='cards d-flex flex-row justify-content-between mt-2 Shadow'
        style={{ background: background }}
      >
        <div className='d-flex flex-column justify-content-evenly C-fff p-4 h-100  w-100'>
          <img src={devicesIcon} alt='icon' style={{ height: '27px', width: '27px' }} />
          <div style={{ width: '200px'}}>
            <p className=' bold' style={{ fontSize: '18px' }}>{aedCount}</p>
            <p className='bold' style={{ fontSize: '12px' }}>{aedStatus}</p>
          </div>
          <Link to={{ pathname: `/${cardType.toLowerCase()}`, search: `?level=${level}` }} className='bold C-fff' style={{ fontSize: '10px' }}>{linkText}</Link>
        </div>
        <div className='d-flex flex-column w-50' style={{ zIndex: 0 }}>
          <img src={circle} alt='Circle'
            style={{ height: '68%', position: 'absolute', right: 0 }}
          />
          <img src={circle} alt='Circle'
            style={{ height: '68%', position: 'absolute', right: 10, bottom: 0 }}
          />
        </div>
      </div>
    )
  }
  else
    return (
      <div className="cards center mt-2 C-dark border">
        <Spinner animation="grow" />
      </div>
    )
}
export default AedCard;
