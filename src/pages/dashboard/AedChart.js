import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import Indicator from './Indicator'
import Statistics from './Statistics';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import _ from 'lodash';


const AedChart = ({ aed = {}, medication }) => {
  const navigate = useNavigate()
  let { totalDanger, totalInfo, totalWarning, totalCount } = aed;

  let data = [
    { name: "", value: totalCount ? 0 : 1 },
    { name: "Warning", value: totalDanger, level: "danger" },
    { name: "Attention needed", value: totalWarning, level: "warning" },
    { name: "Ready For Use", value: totalInfo, level: "info" },
  ]

  const COLORS = ['#f5f5f5', '#ff011f', '#f4b41a', '#5ac26a']

  return (
    <Row className='Shadow rounded Bg-fff pt-3 ps-2 ms-lg-0 h-100'>
      <p className='title'>{medication ? 'MEDICATION' : 'EQUIPMENT'} STATUS</p>
      <Indicator />
      {!_.isEmpty(aed) ?
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
                  animationEasing='linear'
                  startAngle={90}
                  endAngle={450}
                  innerRadius={"78%"}
                  outerRadius={"95%"}
                  dataKey="value"
                  onClick={(e) => {
                    totalCount &&
                      navigate({ pathname: medication ? '/medication' : '/equipment', search: `?level=${e.level}` })
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
            {medication ?
              <div className='list'>
                <Statistics name='Ready for Use' value={aed?.totalInfo} color='#5ac26a' to={{ pathname: '/medication', search: `?level=info` }} />
                <Statistics name='Attention Needed' value={aed?.totalWarning} color='#f4b41a' to={{ pathname: '/medication', search: `?level=warning` }} />
                <Statistics name='Warning' value={aed?.totalDanger} color='#ea2b1b' to={{ pathname: '/medication', search: `?level=danger` }} />
              </div>
              :
              <div className='list'>
                <Statistics name='Ready for Use' value={aed?.totalInfo} color='#5ac26a' to={{ pathname: '/equipment', search: `?level=info` }} />
                <Statistics name='Attention Needed' value={aed?.totalWarning} color='#f4b41a' to={{ pathname: '/equipment', search: `?level=warning` }} />
                <Statistics name='Warning' value={aed?.totalDanger} color='#ea2b1b' to={{ pathname: '/equipment', search: `?level=danger` }} />
              </div>
            }
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

export const CustomTooltip = ({ payload }) => {
  return (
    <div className='bg-light border rounded p-2'>
      <div className="d-flex center">
        <div className="rounded-circle" style={{ height: "13px", width: '13px', background: payload?.[0]?.payload?.fill }} />
        <span style={{ fontSize: '12px' }}>&nbsp;&nbsp;{payload?.[0]?.payload?.name}</span>
      </div>
      <p>{payload?.[0]?.payload?.value}</p>
    </div>
  );
};
export default AedChart;