import { Col, Row } from "react-bootstrap";
import _ from 'lodash'
import { toast } from 'react-toastify';

const Header = (props) => {
   const { active, setActive, completeId, stepCount } = props;
   let activeTabClasses = 'Bg-primary C-fff tabClass B-primary rounded-circle';
   let inActiveTabClasses = 'Bg-fff C-dark tabClass border';
   let completeTabClass = 'Bg-fff C-primary tabClass B-primary'
   let index = Array(stepCount).fill(0)

   const handleClick = (id) => {
      if (_.includes(completeId, id - 1))
         setActive(id)
      else
         toast.error(`Please complete step-${id - 1}`)
   }
   return (
      <Row className='center m-0'>
         <Col className='center flex-row p-2 pb-3' md={9} sm={10} xs={11} >
            {
               index.map((i, key) => {
                  let id = key + 1;
                  return (
                     <div key={id} className='d-flex flex-row align-items-center C-fff ' style={{ width: key === index.length - 1 ? '28px' : '100%' }}>
                        <button key={key}
                           className={active === id ? activeTabClasses : _.includes(completeId, id) ? completeTabClass : inActiveTabClasses}
                           onClick={() => handleClick(id)}
                        >
                           {active === id ? id : _.includes(completeId, id) ? String.fromCharCode(10003) : id}
                        </button>
                        {key < index.length - 1 && <div className='Bg-grey w-100' style={{ height: '1px' }} />}
                     </div>
                  )
               })
            }
         </Col>
      </Row>
   )
}
export default Header;