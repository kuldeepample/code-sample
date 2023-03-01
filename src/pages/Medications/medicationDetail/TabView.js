import { useState } from "react";
import { useLocation } from "react-router-dom";
import Activity from './activity';
import Documents from './documents';
import Inspection from './inspections';
import People from './people';
import { Nav, Tab } from 'react-bootstrap';


const TabView = (props) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const DEFAULT_TAB = +searchParams.get('tab') || 1
  const activeTabClasses = 'Bg-primary C-fff bold tab-border'
  const inActiveTabClasses = 'Bg-fff C-primary bold tab-border'
  const [ active, setActive ] = useState({[DEFAULT_TAB] : activeTabClasses
  })

    return(
        <>
            <Tab.Container  defaultActiveKey={DEFAULT_TAB} onSelect={(e) => setActive({[e] : activeTabClasses})} mountOnEnter={true}>
                  <Nav variant="tabs" id="detailTabs" className="flex-row mt-2" justify>
                    <Nav.Item className='center flex-column'>
                      <Nav.Link className={active[1] || inActiveTabClasses} eventKey= {1} > Inspections</Nav.Link>
                      {active[1] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                    </Nav.Item>
                    <Nav.Item  className='center flex-column'>
                      <Nav.Link className={active[2] || inActiveTabClasses} eventKey={2}> People</Nav.Link>
                      {active[2] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                    </Nav.Item>
                    <Nav.Item className='center flex-column'>
                      <Nav.Link className={active[3] || inActiveTabClasses} eventKey={3}> Activity</Nav.Link>
                      {active[3] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                    </Nav.Item>
                    <Nav.Item className='center flex-column'>
                      <Nav.Link className={active[4] || inActiveTabClasses} eventKey={4}>Documents</Nav.Link>
                      {active[4] ? <div className="tab-arrow" /> : <div style={{ height: '10px' }}></div>}
                    </Nav.Item>
                  </Nav>

                  <Tab.Content className='d-flex flex-column flex-grow-1'>
                    <Tab.Pane eventKey={1} className={`${active[1] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                      <Inspection data ={props.data}/>
                    </Tab.Pane >
                    <Tab.Pane eventKey={2} className={`${active[2] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                      <People data ={props.data}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey={3} className={`${active[3] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                      <Activity data={props.data}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey={4} className={`${active[4] ? 'd-flex' : 'd-none'} flex-column flex-grow-1`}>
                      <Documents data={props.data}/>
                    </Tab.Pane>
                  </Tab.Content>
              </Tab.Container>
        </>
    )
}

export default TabView;