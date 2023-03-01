import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import Indicator from './Indicator'
import Statistics from './Statistics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { CustomTooltip } from './AedChart';
import _ from 'lodash';

const DoughnutChart = ({ location = {} }) => {
  const navigate = useNavigate()
  let { totalCompliant, totalPending, totalNonCompliant, totalCount } = location

  let data = [
    { name: "", value: totalCount ? 0 : 1 },
    { name: "Non Compliant", value: totalNonCompliant, level: 0 },
    { name: "Pending", value: totalPending, level: 2 },
    { name: "Compliant", value: totalCompliant, level: 1 },
  ]

  const COLORS = ['#f5f5f5', '#ff011f', '#f4b41a', '#5ac26a']

  return (
    <Row className='Shadow rounded Bg-fff pt-3 ps-2 ms-lg-0 d-flex h-100 '>
      <p className='title'>LOCATION STATUS</p>
      <Indicator />
      {!_.isEmpty(location) ?
        <Row className='me-0 pe-0'>
          <Col xs={8} className='ps-0'>
            <ResponsiveContainer width="100%">
              <PieChart>
                {totalCount && <Tooltip content={<CustomTooltip />} />}
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  cursor='pointer'
                  animationDuration={1000}
                  animationEasing='ease'
                  startAngle={90}
                  endAngle={450}
                  innerRadius={"78%"}
                  outerRadius={"95%"}
                  dataKey="value"
                  onClick={(e) => {
                    totalCount &&
                    navigate({ pathname: '/locations', search: `?compliant=${e.level}` })
                  }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Col>
          <Col xs={4} className='p-0 d-flex justify-content-center'>
            <div className='list'>
              <Statistics name='Compliant' value={location?.totalCompliant} color='#5ac26a' to={{ pathname: '/locations', search: `?compliant=1` }} />
              <Statistics name='Pending' value={location?.totalPending} color='#f4b41a' to={{ pathname: '/locations', search: `?compliant=2` }} />
              <Statistics name='Non Compliant' value={location?.totalNonCompliant} color='#ff011f' to={{ pathname: '/locations', search: `?compliant=0` }} />
            </div>
          </Col>
        </Row>
        :
        <div className="center mt-2 C-dark h-75">
          <Spinner animation="grow" />
        </div>
      }
    </Row>
  )
}

export default DoughnutChart;