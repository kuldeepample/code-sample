import React, { useEffect, useState, useRef } from 'react';
import { Col, Image, Row, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { getOrganizationList, logout } from '@/services';

import logo from '@images/logo.png';
import avatar from '@images/default-avatar.png';
import logoSH from '@images/logoSH.png';

import './../../theme/Colors.css';
import { getQueryParams, isNotUser, isSuperAdmin, isDistributor, changeDataKeys, isManager } from '@/helpers';
import _ from 'lodash'
import Notification from '../Notification';
import Select from 'react-select'
import { BiSearch } from 'react-icons/bi'
import { clearDashboardReducer } from '@/reducers/dashboard';

const Topbar = (props) => {
  const dispatch = useDispatch()
  const [state, setState] = useState({
    width: 0,
    height: 0,
    search: null,
  });

  const { isLoggedIn, profile, organizationList, isSearch, toggleSideNav } = props;
  const { search } = state;
  const location = useLocation();
  const navigate = useNavigate();
  const windowUrl = location.search;
  const params = new URLSearchParams(windowUrl);
  const inputRef = useRef(null);

  const sizes = {
    searchBox: (isSuperAdmin() || isDistributor() || isManager())
      ? { xs: 2, sm: 3, md: 3, lg: 3, xl: 3, xxl: { offset: 1, span: 4 } }
      : { xs: 5, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 },
    orgBox: (isSuperAdmin() || isDistributor() || isManager())
      ? { xs: { span: 12, order: 'last' }, sm: 3, md: 2, lg: 3, xl: 2, xxl: { offset: 1, span: 2 } }
      : {},
    profileBox: (isSuperAdmin() || isDistributor() || isManager())
      ? { xs: 3, sm: { span: 1, order: 'last' }, md: 2, lg: 2, xl: 2, xxl: 2 }
      : { xs: 2, sm: 1, md: 3, lg: 2, xl: 2, xxl: 2 }
  }

  const orgSelectStyles = {
    option: (pre, state) => ({
      ...pre,
      backgroundColor: state.isSelected ? '#c6097011' : state.isFocused ? '#e9ecef' : '',
      color: state.isSelected ? '#c60970' : state.isFocused ? '#545454' : '#232323',
      padding: '8px 0 8px 20px',
    }),
    control: () => ({ display: 'flex', width: '100%' }),
    groupHeading: (pre) => ({ ...pre, color: '#818188', fontSize: '12px' }),
    singleValue: (pre) => ({ ...pre, color: '#C60970' }),
  }

  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions());

    if ((isSuperAdmin() || isDistributor() || isManager()) && _.isEmpty(organizationList))
      dispatch(getOrganizationList())
    return () => {
      window.removeEventListener('resize', updateWindowDimensions());
    }
  }, [])

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
    window.location.reload();
  }

  const formatGroupLabel = (data) => (
    <div className='center justify-content-start'>
      <span title={data?.label} className='text-truncate'>{data.label}</span>
      {/* <span style={groupBadgeStyles}>{data.options.length}</span> */}
    </div>
  );

  const getAccountsList = (list) => {
    let data
    if (list) {
      let labels = []
      data = list?.flatMap((item, index, array) => {
        if (!labels.includes(item?.distributor_id)) {
          labels.push(item?.distributor_id)
          return {
            label: item?.distributor?.name,
            options: changeDataKeys(array.filter((i) => i?.distributor_id === item?.distributor_id), { name: 'label', id: 'value' }),
          }
        }
        else return []
      })
    }
    return data;
  }

  const getAccountName = () => {
    let data = JSON.parse(localStorage.getItem('token'))
    let item
    if (data?.account?.name) item = data?.account
    else item = organizationList && organizationList[0]
    if (item) item = { ...item, label: item?.name }
    // if (item) item.label = item?.name ?? '';
    return item || null
  }

  const updateWindowDimensions = () => setState({ ...state, width: window.innerWidth, height: window.innerHeight });

  const getValue = () => {
    if (location.search.includes('search'))
      return params.get('search');
    else return ""
  }

  const handleAccountSelection = (account) => {
    let acc = { ...account, id: account.value, name: account.label }
    let token = JSON.parse(localStorage.getItem('token'));
    token.account = acc;
    localStorage.setItem('token', JSON.stringify(token))
    clearDashboardReducer();
    navigate('/');
    window.location.reload()
  }

  const getParams = () => {
    let objectParams = { search: search };
    if (location?.search) {
      objectParams = JSON.parse('{"' + decodeURI(location?.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
      objectParams.search = search;
    }
    return ('?' + getQueryParams(objectParams))
  }

  const LogoContainer = () => {
    return (
      <div className="center h-100 logo-container">
        <div className='h-100 d-flex flex-row align-items-center justify-content-between ps-4 ps-md-0'>
          <input type="checkbox" id={"menu_checkbox"} onClick={(e) => toggleSideNav(e)} />
          <label for={"menu_checkbox"} className={`hamBurger ${isSearch ? '' : 'display-menu-icon'}`} >
            <div></div>
            <div></div>
            <div></div>
          </label>


          <Link to='/dashboard' className='h-100 center'>
            <Image alt="logo" src={logoSH} className="displayNone logoSH" />
          </Link>
        </div>
        <Link to='/dashboard' className='center p-0 ms-2'>
          <Image alt="logo" src={logo} className="dashLogo m-0" />
        </Link>
      </div>
    )
  }

  const Menu = () => {
    return (
      <div className='d-flex flex-row justify-content-end align-items-center'>
        <Dropdown >
          <Dropdown.Toggle
            style={{ background: 'transparent' }}
            className='border-0 p-0 C-818188 d-flex align-items-center profileDropIcon'
            variant='light'
          >
            <div className='d-flex flex-column align-items-end'>
              <p className='space'>{(isLoggedIn && profile) ? `${profile.fname} ${profile.lname}` : ''} &nbsp;</p>
              <span className='space' style={{ fontSize: '10px' }}>
                {(isLoggedIn && profile)
                  ? (isSuperAdmin() || isDistributor() || isManager())
                    ? ''
                    : <p>
                      <p className='userRole'> {profile?.account?.name} </p>
                      <span> -&nbsp;{profile.user_role?.name}</span>
                    </p>
                  : ''}
              </span>
            </div>
            <Image alt='avatar' src={(isLoggedIn && profile && profile.image) ? profile.image : avatar} className='profileIcon' roundedCircle />
          </Dropdown.Toggle>
          <Dropdown.Menu className='w-100'>
            <Dropdown.Item eventKey="2" onClick={() => { navigate('/profile') }}>Profile</Dropdown.Item>
            {isNotUser() && <Dropdown.Item eventKey="3" onClick={() => { navigate('/dashboard/license-info') }}>License Info</Dropdown.Item>}
            {/* <Dropdown.Item eventKey="4" onClick={() => { navigate('/change-password') }}>Change Passward</Dropdown.Item> */}
            <Dropdown.Divider />
            <Dropdown.Item onClick={(e) => handleLogout(e)} eventKey="4">Sign Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }

  return (
    <>
      <Row
        style={{ height: '64px', position: 'sticky', top: 0, zIndex: 1000 }}
        className='d-flex flex-row justify-content-between topBar pe-3 Bg-fff m-0'
      >
        <Col xs={4} sm={4} md={3} lg={2} xl={2} xxl={2} className="h-100">
          <LogoContainer />
        </Col>

        <Col {...sizes.searchBox} className="d-flex align-items-center justify-content-center h-100">
          <div className='rounded ps-2 center' style={{ height: '43px', width: '100%' }}>
            <div className='h-100 center ps-2'
              style={{
                color: '#cdcdcd',
                background: '#f5f5f5',
                borderRadius: '6px 0px 0px 6px'
              }}
            >
              <BiSearch size={25} onClick={() => inputRef.current.focus()}
              />

            </div>
            <input type="text" placeholder="Search"
              ref={inputRef}
              value={search !== null ? search : getValue()}
              className='border-0 m-0 p-0 ps-2 h-100 searchInput'
              style={{ fontSize: '20px' }}
              onChange={(e) => setState({ ...state, search: e.target.value })}
              onKeyUp={event => {
                if (event.keyCode === 13 && search) {
                  setState({ ...state, search: null })
                  navigate({ pathname: '/search', search: getParams() })
                }
              }}
            />
          </div>
        </Col>
        {(isSuperAdmin() || isDistributor() || isManager()) &&
          <Col {...sizes?.orgBox} className='center h-100 p-sm-0 p-3' id='orgDropdown'>
            <Select
              className='d-flex w-100 F-14 rounded border C-primary bg-fff'
              styles={orgSelectStyles}
              value={getAccountName()}
              onChange={(e) => handleAccountSelection(e)}
              options={getAccountsList(organizationList)}
              formatGroupLabel={formatGroupLabel}
            />
          </Col>}

        <Col {...sizes?.profileBox} className='d-flex align-items-center justify-content-end h-100 p-md-0'>
          <Notification />
          <Menu />
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = state => {
  return {
    profile: state.auth && state.auth.user,
    isLoggedIn: state.auth && state.auth.isLoggedIn,
    organizationList: state.auth && state.auth.organizationList,
  };
}

const actionCreators = {
  // logout,
  getOrganizationList,
  // clearDashboardReducer,
};

export default connect(mapStateToProps, actionCreators)(Topbar);
