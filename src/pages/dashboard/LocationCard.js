import React from "react";
import circle from '@images/circle.png';
import { Link } from "react-router-dom";
import './../../theme/Colors.css';
import './index.css';
import { Spinner } from "react-bootstrap";
import { MdShareLocation } from 'react-icons/md'

const LocationCard = ({ location }) => {
  let statusText, totalCount, background, linkText, search;

  if (location?.totalNonCompliant) {
    statusText = `${location?.totalNonCompliant === 1 ? "Is" : "Are"} Not Compliant`;
    totalCount = `${location?.totalNonCompliant} ${(location?.totalNonCompliant > 1) ? 'Locations' : ' Location'}`;
    background = `linear-gradient(to right,#FA011E,#F7021E,#CC071E)`;
    linkText = 'Click Here to View';
    search = '?compliant=0';
  }
  else if (location?.totalPending) {
    statusText = `${location?.totalPending === 1 ? "Is" : "Are"} Pending`;
    totalCount = `${location?.totalPending} ${(location?.totalPending > 1) ? 'Locations' : ' Location'}`;
    background = `linear-gradient(to right,#FDBC23,#F6B316,#ECA703)`;
    linkText = 'Click Here to View';
    search = '?compliant=2';
  }
  else if (location?.totalCompliant) {
    statusText = 'Compliant';
    totalCount = 'All Locations';
    background = `linear-gradient(to right,#52BE63,#3DB44F,#089A1E)`;
    linkText = '';
    search = '?compliant=1';
  }
  else {
    statusText = '--';
    totalCount = 'No Location';
    background = `linear-gradient(90deg, rgba(166,166,166,1) 14%, rgba(129,129,136,1) 70%, rgba(93,94,102,1) 100%)`;
    linkText = '';
    search = '';
  }

  if (location?.totalCount || location?.totalCount === 0) {
    return (
      <div className='cards d-flex flex-row justify-content-between mt-2 Shadow'
        style={{ background: background }}
      >
        <div className='d-flex flex-column justify-content-evenly C-fff p-4 h-100 w-100'>
          <MdShareLocation size={33} />
          <div>
            <p className='bold' style={{ fontSize: '18px' }}>{totalCount}</p>
            <p className='bold' style={{ fontSize: '12px' }}>{statusText}</p>
          </div>
          <Link to={{ pathname: '/locations', search: search }} className='bold C-fff' style={{ fontSize: '10px' }}>{linkText}</Link>
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
export default LocationCard;
