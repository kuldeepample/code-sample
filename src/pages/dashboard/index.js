import React, { useEffect, useState } from 'react';
import { Col, Row, Spinner } from "react-bootstrap";
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import AddressBar from '@components/Layout/AddressBar';
import LocationChart from './LocationChart';
import AedChart from './AedChart';
import AedCard from './AedCard';
import UserCard from './UserCard';
import LocationCard from './LocationCard';
import Activites from './Activities';
import './index.css';
import { getAllAed, getAllLocation, getAllMedications, getAllUser, getRecentActivities } from '@/services';

const Dashboard = (props) => {

  const dispatch = useDispatch()
  const [state, setState] = useState({});
  const { onRes, loading } = state;
  
  const dashboardData = useSelector((state) => {
    return {
      parentCategories: state.equipment.parentCategories,
      people: state.dashboard.people,
      aed: state.dashboard.aed,
      location: state.dashboard.location,
      medication: state.dashboard.medication,
      recentActivities: state.dashboard.recentActivities,
    }
  })
  const { recentActivities, aed, location, people, parentCategories, medication } = dashboardData

  useEffect(() => {
    setState({ ...state, loading: true })
    dispatch(getAllMedications()).then(() => setState({ ...state, onRes: !onRes }));
    dispatch(getAllUser()).then(() => setState({ ...state, onRes: !onRes }));
    dispatch(getAllAed()).then(() => setState({ ...state, onRes: !onRes }));
    dispatch(getAllLocation()).then(() => setState({ ...state, onRes: !onRes }));
    dispatch(getRecentActivities(5)).then(() => { })
  }, [])

  useEffect(() => {
    if (!_.isEmpty(aed) && !_.isEmpty(location) && !_.isEmpty(people))
      setState({ ...state, loading: false });
  }, [onRes])


  return (
    <div className="App p-0 m-0 flex-grow-1 d-flex flex-column">
      <AddressBar page={[{ name: 'Dashboard' }]} />
      {!loading ?
        <>
          <Row className='m-0 mb-2 center'>
            <Col xl={4} lg={6} md={6} sm={6} xs={12} >
              <AedCard aed={aed} />
            </Col>
            <Col xl={4} lg={6} md={6} sm={6} xs={12} >
              <LocationCard location={location} />
            </Col>
            {
              parentCategories?.includes('medication') ?
                <Col xl={4} lg={6} md={6} sm={6} xs={12} >
                  <AedCard aed={medication} medication/>
                </Col>
                :
                <Col xl={4} lg={6} md={6} sm={6} xs={12} >
                  <UserCard people={people} />
                </Col>
            }
          </Row>
          <Row className='m-0 mt-2 pb-3'>
            <Col xl={4} lg={6} md={12} className='pe-4 pt-2' style={{ height: '380px' }}>
              <AedChart aed={aed} />
            </Col>
            <Col xl={4} lg={6} md={12} className='pe-4 pt-2' style={{ height: '380px' }}>
              <LocationChart location={location} />
            </Col>
            {
              parentCategories?.includes('medication') ?
                <Col xl={4} lg={12} md={12} className='pe-4 pt-2' style={{ height: '380px' }}>
                  <AedChart aed={medication} medication />
                </Col>
                :
                <Col xl={4} lg={12} md={12} className='pe-4 pt-2' style={{ height: '380px' }}>
                  <Activites data={recentActivities} />
                </Col>
            }
          </Row>
        </>
        :
        <div className='center flex-grow-1'>
          <Spinner animation='border' style={{ height: '45px', width: '45px' }} />
        </div>
      }
    </div>
  );
}

export default Dashboard;