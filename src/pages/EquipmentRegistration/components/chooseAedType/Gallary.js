import { Image, Row, Col } from 'react-bootstrap';
import Pressable from '@components/common/Pressable';

const Gallary = (props) => {
   let { handleChange, state, equipmentModels } = props
   return (
      <Row className='p-1 d-flex justify-content-center m-0 h-100'>
         {equipmentModels
            ? (equipmentModels).map((item, key) => { return <GallaryItem item={item} key={key} handleChange={handleChange} id={state?.aed?.id} /> })
            : <div className='center C-818188 F-16'>Equipment Not found</div>
         }
      </Row>
   )
}

const GallaryItem = (props) => {
   let { item, handleChange, id } = props
   let btn = "Bg-fff C-818188 add-now-btn";
   let activeBtn = 'Bg-primary C-fff add-now-btn';
   return (
      <Col className='border rounded m-3 d-flex flex-column align-items-center justify-content-around' style={{ maxHeight: '175px', maxWidth: '175px', minHeight: '160px', minWidth: '160px' }}>
         <Image src={item.image} alt='Modal' className='h-75 w-100' style={{ objectFit: 'contain' }} />
         <Pressable
            title='Select'
            classes={id === item.id ? activeBtn : btn}
            onPress={() => { handleChange('aed', item); }}
         />
      </Col>
   )
}

export default Gallary;