import React, { useEffect, useState } from 'react';
import { Nav, Tab, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import _ from 'lodash'

import AddressBar from '@components/Layout/AddressBar';
import Equipment from './equipment';
import Activity from './activity';
import Credential from './Credential'
import PeopleHeader from './PeopleHeader';

import { connect, useDispatch, useSelector } from 'react-redux';
import '../index.css'
import Location from './location';
import { useLocation, useParams } from 'react-router-dom';
import { EmptyComponent } from '@/components/common';
import { getPeopleDetail, getUserRoleList } from '@/services';
import Course from './course';

const PeopleDetail = (props) => {
  let location = useLocation()
  const params = useParams()
  const dispatch = useDispatch()
  const searchParams = new URLSearchParams(location.search)
  const DEFAULT_TAB = +searchParams.get('tab') || 1
  const [state, setState] = useState({
    peopleData: {},
    activeTabClasses: 'Bg-primary C-fff bold centertab-border',
    inActiveTabClasses: 'Bg-fff C-primary bold tab-border',
    active: { [DEFAULT_TAB]: 'Bg-primary C-fff bold tab-border' },
    onEdit: false,
  })

  const peopleDetail = useSelector((state) => {
    return {
      complianceStatusList: state.location.complianceStatusList,
      userRoleList: state.people.userRoleList,
      parentCategories: state.equipment.parentCategories
    }
  })

  const { userRoleList, parentCategories, complianceStatusList } = peopleDetail;
  const { peopleData, active, inActiveTabClasses, activeTabClasses, onEdit, loading = true } = state;
  let { id, fname, lname } = peopleData;

  useEffect(() => {
    if (params?.peopleId) {
      setState({ ...state, loading: true })
      dispatch(getPeopleDetail({ id: params?.peopleId })).unwrap().then((res) => {
        if (res?.success) setState({ ...state, peopleData: _.extend(state.peopleData, res?.data), loading: false })
        else{
          setState({ ...state, loading: false })
        }
      }) 
    } else {
      toast.error('Missing People Id');
    }
    if (_.isEmpty(userRoleList))
      dispatch(getUserRoleList());
  }, [onEdit, params.peopleId])

  return (
    <div className='flex-grow-1 d-flex flex-column'>
      <AddressBar page={[{ name: 'People', link: '/people' }, { name: (fname && lname) && fname + " " + lname }]} />
      {loading
        ? <div className='center flex-grow-1'>
          <Spinner animation="border" />
        </div>
        : (!loading && id) ?
          <>
            <PeopleHeader data={peopleData} onEditPeople={() => setState({ ...state, onEdit: !onEdit })} />
            <Tab.Container defaultActiveKey={DEFAULT_TAB} unmountOnExit mountOnEnter={true}
              onSelect={(e) => setState({ ...state, active: { [e]: activeTabClasses } })}
            >
              <Nav variant="tabs" id="detailTabs" className="flex-row mt-2" justify>
                <Nav.Item className='center flex-column'>
                  <Nav.Link eventKey={1} className={active[1] || inActiveTabClasses} >Location</Nav.Link>
                  {active[1] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                </Nav.Item>
                <Nav.Item className='center flex-column'>
                  <Nav.Link eventKey={2} className={active[2] || inActiveTabClasses}>Equipment</Nav.Link>
                  {active[2] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                </Nav.Item>
                {parentCategories?.includes('medication') ?
                  <Nav.Item className='center flex-column'>
                    <Nav.Link eventKey={3} className={active[3] || inActiveTabClasses}>Medication</Nav.Link>
                    {active[3] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                  </Nav.Item>
                  : ''
                }
                {parentCategories?.includes('course') ?
                  <Nav.Item className='center flex-column'>
                    <Nav.Link eventKey={4} className={active[4] || inActiveTabClasses}>Course</Nav.Link>
                    {active[4] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                  </Nav.Item>
                  : ''
                }
                {parentCategories?.includes('credential') ?
                  <Nav.Item className='center flex-column'>
                    <Nav.Link eventKey={5} className={active[5] || inActiveTabClasses}>Credentials</Nav.Link>
                    {active[5] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                  </Nav.Item>
                  : ''
                }
                <Nav.Item className='center flex-column'>
                  <Nav.Link eventKey={6} className={active[6] || inActiveTabClasses}>Activity</Nav.Link>
                  {active[6] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                </Nav.Item>
              </Nav>
              <Tab.Content className='d-flex flex-column flex-grow-1'>
                <Tab.Pane eventKey={1} className={`${active[1] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                  <Location data={peopleData} />
                </Tab.Pane>
                <Tab.Pane eventKey={2} className={`${active[2] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                  <Equipment data={peopleData} />
                </Tab.Pane>
                <Tab.Pane eventKey={3} className={`${active[3] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                  <Equipment data={peopleData} medication />
                </Tab.Pane>
                <Tab.Pane eventKey={4} className={`${active[4] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                  <Course data={peopleData} />
                </Tab.Pane>
                <Tab.Pane eventKey={5} className={`${active[5] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                  <Credential data={peopleData} /* isActivityTab={active[5] ? true : false}  *//>
                </Tab.Pane>
                <Tab.Pane eventKey={6} className={`${active[6] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                  <Activity data={peopleData} isActivityTab={active[6] ? true : false} />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </>
          :
          <EmptyComponent title="People" />
      }
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    complianceStatusList: state.location.complianceStatusList,
    userRoleList: state.people.userRoleList,
    parentCategories: state.equipment.parentCategories
  }
}

const actionCreators = {
  // getPeopleDetail: (id) => (dispatch) => dispatch(getPeopleDetail(id)),
  // getUserRoleList: () => (dispatch) => dispatch(getUserRoleList())
};

export default connect(mapStateToProps, actionCreators)(PeopleDetail);