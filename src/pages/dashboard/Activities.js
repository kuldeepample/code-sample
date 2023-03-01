import { Row, Image, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Indicator from './Indicator';
import { AiOutlineUser } from 'react-icons/ai';
import { isSuperAdmin, isDistributor, isManager } from '@/helpers';
import activity from '@images/activity.png'
const Activites = (props) => {

  const ItemRow = ({ data, index }) => {
    let { equipment, location, note, user } = data;
    return (
      <div style={{ height: '85px', width: '100%' }} className='d-flex flex-column justify-content-around' >
        {index ? <div className='w-100 d-flex ' style={{ height: '2px', backgroundColor: 'rgba(80, 168, 255, 0.16)' }} /> : null}
        <Link className='d-flex flex-row linkText' to={{ pathname: '/people/' + user?.id, search: 'tab=3' }}>
          <Image src={equipment?.equipment_model?.image} alt='Model' className='avatar2 border' title={`SN: ${equipment?.serial_number}`} />
          <div className='d-flex flex-column justify-content-around ms-3 '>
            <p className='F-14 C-primary'>{location?.name}</p>
            {(isSuperAdmin() || isDistributor() || isManager()) && <p className='F-12 C-818188'><AiOutlineUser className='C-primary' /><span className='ms-1'>{user?.fname + " " + user?.lname}</span></p>}
            <p className='F-10 C-818188 activity-note text-break' >{note}</p>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <Row className='d-flex flex-column Shadow rounded Bg-fff pt-3 ps-2 h-100 ms-lg-0'>
      <p className='title'>RECENT ACTIVITIES</p>
      <Indicator />
      {props?.data && props?.data.length ?
        <div className='mt-4 Content' style={{ height: '80%' }}>
          {(props?.data || []).map((item, key) => {
            return (
              <ItemRow key={key} data={item} index={key} />
            )
          })}
        </div>
        : props?.data ?
          <div style={{ height: '80%' }} className='center flex-column align-items-center'>
            <img src={activity} alt='Image' style={{ height : '30%'}} />
            <p className='C-818188 F-20 mt-2'>No activity added yet!</p>
          </div>
          :
          <div className='center h-75 C-dark'>
            <Spinner animation='border' />
          </div>
      }
    </Row >
  )
}

export default Activites;