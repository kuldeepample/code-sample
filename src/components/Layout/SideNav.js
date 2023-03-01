import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, } from "react-bootstrap";
import _ from 'lodash'
import equipment from '@images/equipment.png';
import equipment1 from '@images/equipment1.png';
// import training1 from '@images/training1.png';
import { MdOutlineLocationOn, MdOutlineMedicalServices, MdOutlineSupportAgent } from 'react-icons/md';
import { RiBarChart2Line, RiDashboardLine } from 'react-icons/ri';
import { HiOutlineUsers } from 'react-icons/hi';
import { BiBookAlt } from 'react-icons/bi';
import playStoreIcon from '@images/playStoreIcon.png'
import iosStoreIcon from '@images/iosStoreIcon.png'
import credential from '@images/credentialLogo.png'
import credential1 from '@images/credential1.png'
import { useSelector } from 'react-redux';
import { isNotUser } from '@/helpers';
import { GiBookCover} from 'react-icons/gi'

const SideNav = (props) => {
  const parentCategories = useSelector((state) => state?.equipment?.parentCategories);

  const [activeTab, setActiveTab] = useState("");
  let navList = [
    {
      key: 1,
      path: '/dashboard',
      name: 'Dashboard',
      icon: <RiDashboardLine size={40} className='px-2' />

    },
    {
      key: 2,
      path: '/locations',
      name: 'Locations',
      icon: <MdOutlineLocationOn size={40} className='px-2' />,
    },
    {
      key: 3,
      path: '/people',
      name: 'People',
      icon: <HiOutlineUsers size={40} className='px-2' />,
    },
    {
      key: 4,
      path: '/equipment',
      name: 'Equipment',
      img: equipment,
      imgSelected: equipment1,
      slug: 'equipment'
    },
    {
      key: 9,
      path: '/credentials',
      name: 'Credentials',
      img: credential,
      slug: 'credential',
      imgSelected: credential1,
    },
    {
      key: 10,
      path: '/courses',
      name: 'Courses',
      slug: 'course',
      icon: <GiBookCover fill='none' stroke='#fff' strokeWidth={ +activeTab === 10 ? 17 : 12} size={40} className='px-2'/>
    },
    {
      key: 5,
      path: '/medication',
      name: 'Medications',
      slug: 'medication',
      icon: <MdOutlineMedicalServices size={40} className='px-2' />
    },
    /* {
      path: '/training',
      name: 'Training',
      img: training1,
      imgSelected: training1,
    }, */
    {
      key: 6,
      path: '/reports',
      name: 'Reports',
      icon: <RiBarChart2Line size={40} className='px-2' />,
    },
    {
      key: 7,
      path: '/law-center',
      name: 'Law Center',
      icon: <BiBookAlt size={40} className='px-2' />,
    },
    {
      key: 8,
      path: '/pages/support',
      name: 'Support',
      icon: <MdOutlineSupportAgent size={40} className='px-2' />,
    },
  ]
  const white = { color: '#fff' }
  const gray = { color: '#ffaad8' }
  const { isSearch, show } = props
  const location = useLocation()

  useEffect(() => {
    let navItem = _.find(navList, (item) => (location.pathname + location.search).startsWith(item?.path))

    if (navItem?.key) {
      props.toggleSideNav()
      setActiveTab(navItem.key)
    }
    else setActiveTab(0)

  }, [location]);

  if(!isNotUser()) navList = navList?.filter((item) => item?.name !== "People");

  return (
    <React.Fragment>
      <Nav className={`sideNavFixed sideNav Bg-primary flex-column ${isSearch ? 'isSearchNav' : ''}`} id='sideNav'>
        <div className='navItem'>
          {navList.map((item, key) => {
            return  (item?.slug && !parentCategories?.includes(item?.slug)) || <Nav.Item key={key}>
              <Nav.Link as={Link} to={item.path} bsPrefix="linkText" eventKey={item.key} >
                <div className='d-flex flex-row justify-content-start align-items-center' style={{ height: '50px' }}>
                  <div className={+item.key === +activeTab ? 'side-menu-indicator me-1' : 'm-1'} />
                  <div
                    className={`ms-2 text-nowrap ${+item.key === +activeTab ? ' tabs' : ' InActiveTab'}`}
                    style={+item.key === +activeTab ? white : gray}
                  >
                    {
                      item?.img ?
                        <img src={+item.key === +activeTab ? item.img : item.imgSelected} alt='Nav_item' className="tabIcon " />
                        : item.icon
                    }
                    {item.name}
                  </div>
                </div>
              </Nav.Link>
            </Nav.Item>
          }
          )}
        </div>

        <div className='mb-3 d-flex align-items-center flex-column ps-3'>
          <a className='ms-3 mt-1 ' target='_blank' href='http://play.google.com/store/apps/details?id=com.schoolhealth'><img src={playStoreIcon} alt='Play store' className='appStoreIcon' role="button" /></a>
          <a className='ms-3 mt-1 ' target='_blank' href='https://apple.co/3Q8SAII'><img src={iosStoreIcon} alt='Ios icon' className='appStoreIcon' role="button" /> </a>
        </div>
      </Nav>
    </React.Fragment>
  );
}

export default SideNav;