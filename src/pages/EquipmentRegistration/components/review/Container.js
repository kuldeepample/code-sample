import { Row } from 'react-bootstrap'
import editIcon from '@images/edit.png'
const Container = (props) => {
   let { heading, as, classes, setActive } = props
   return (
      <div className={`${classes}`}>
         <Row as={as} className={`border rounded m-0 mt-3 p-0`}>
            <div className='border-bottom ps-3 align-items-center justify-content-between d-flex' style={{ minHeight: '50px' }}>
               <p className='lable bold'>{heading}:</p>
               <div className='d-flex align-items-center' onClick={setActive} style={{ cursor: 'pointer' }}>
                  <img src={editIcon} className='editIcon' alt='Icon' />
                  <p className='C-link lable bold' >&nbsp;Edit</p>
               </div>
            </div>
            {props.children}
         </Row>
      </div>
   )
}
export default Container;