import React, { useEffect, useState } from 'react';
import { Nav, Tab, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

import AddressBar from '@components/Layout/AddressBar';
import Map from '@components/Map';
import People from './people'
import Equipment from './equipment';
import Activity from './activity';
import LocationItemHeader from './LocationItemHeader';

import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import { EmptyComponent } from '@/components/common';
import { useLocation, useParams } from 'react-router-dom';
import { getLocationDetail } from '@/services';
import LocationDoc from './document';

const LocationDetail = (props) => {
  const dispatch = useDispatch()
  const params = useParams();
  const locations = useLocation();
  const locationData = useSelector((state) => {
    return {
      currentUser: state.auth.user,
      parentCategories: state?.equipment?.parentCategories
    }
  })
  const { currentUser, parentCategories } = locationData
  const searchParams = new URLSearchParams(locations.search)
  const DEFAULT_TAB = +searchParams.get('tab') || 1;

  const [state, setState] = useState({
    location: {},
    activeTabClasses: 'Bg-primary C-fff bold center tab-border',
    inActiveTabClasses: 'Bg-fff C-primary bold tab-border',
    active: { [DEFAULT_TAB]: 'Bg-primary C-fff bold tab-border' },
    onEdit: false,
  })

  const { location, active, inActiveTabClasses, activeTabClasses, onEdit, loading } = state;
  useEffect(() => {
    if (params?.locationId) {
      setState({ ...state, loading: location?.id ? loading : true })
      dispatch(getLocationDetail(params?.locationId)).unwrap().then((res) => {
        if (!res?.success)
          toast.error(res?.message);
        setState({ ...state, location: res?.data, loading: false });
      })
    } else {
      toast.error('Missing Location Id');
    }
  }, [onEdit, params.locationId])

  return (
    <div className='flex-grow-1 d-flex flex-column'>
      <AddressBar page={[{ name: 'Location', link: '/locations' }, { name: location?.name }]} />
      {loading ?
        <div className='flex-grow-1 center'>
          <Spinner animation="border" className='d-flex center align-self-center' />
        </div>
        :
        location?.id ?
          <div className='flex-grow-1 d-flex flex-column'>
            <Row className='flex-row d-flex mb-3'>
              <Col xl={5} xxl={4} className='pe-lg-0 mb-2 mt-2 mb-lg-0' >
                <LocationItemHeader data={location} onEditLocation={() => setState({ ...state, onEdit: !onEdit })} currentUser={currentUser} />
              </Col>
              <Col xl={7} xxl={8} className='mb-lg-2' style={{ minHeight: '150px' }}>
                <Map location={location} />
              </Col>
            </Row>
            <Tab.Container defaultActiveKey={DEFAULT_TAB} unmountOnExit mountOnEnter={true} onSelect={(e) => setState({ ...state, active: { [e]: activeTabClasses } })}>
              <Nav variant="tabs" id="detailTabs" className="flex-row mt-2" justify>
                {parentCategories?.includes('equipment') ?
                  <Nav.Item className='center flex-column'>
                    <Nav.Link eventKey={1} className={active[1] || inActiveTabClasses} >Equipment</Nav.Link>
                    {active[1] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                  </Nav.Item>
                  : ''
                }
                {parentCategories?.includes('medication') ?
                  <Nav.Item className='center flex-column'>
                    <Nav.Link eventKey={2} className={active[2] || inActiveTabClasses}>Medications</Nav.Link>
                    {active[2] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                  </Nav.Item>
                  : ''
                }
                <Nav.Item className='center flex-column'>
                  <Nav.Link eventKey={3} className={active[3] || inActiveTabClasses}>People</Nav.Link>
                  {active[3] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                </Nav.Item>
                <Nav.Item className='center flex-column'>
                  <Nav.Link eventKey={4} className={active[4] || inActiveTabClasses}>Activity</Nav.Link>
                  {active[4] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                </Nav.Item>
              {/* </Nav> */}
                <Nav.Item className='center flex-column'>
                  <Nav.Link eventKey={5} className={active[5] || inActiveTabClasses}>Documents</Nav.Link>
                  {active[5] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                </Nav.Item>
              </Nav>
              <Tab.Content className='d-flex flex-column flex-grow-1'>
                {parentCategories?.includes('equipment') ?
                  <Tab.Pane eventKey={1} className={`${active[1] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                    <Equipment location={location} onAddEquipment={() => setState({ ...state, onEdit: !onEdit })} />
                  </Tab.Pane>
                  : ''
                }
                {parentCategories?.includes('medication') ?
                  <Tab.Pane eventKey={2} className={`${active[2] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                    <Equipment medication location={location} onAddEquipment={() => setState({ ...state, onEdit: !onEdit })} />
                  </Tab.Pane>
                  : ''
                }
                <Tab.Pane eventKey={3} className={`${active[3] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                  <People locationData={location} />
                </Tab.Pane>
                <Tab.Pane eventKey={4} className={`${active[4] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                  <Activity location={location} isActivityTab={active[3] ? true : false} />
                </Tab.Pane>
                <Tab.Pane eventKey={5} className={`${active[5] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                  <LocationDoc location={location} />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
          :
          <EmptyComponent title='Location' />
      }
    </div>
  )
}
export default LocationDetail;