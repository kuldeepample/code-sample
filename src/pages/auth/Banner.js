import img from '@images/banner.jpg';
import { Image, Col } from "react-bootstrap";

const Banner = () => {
  return (
    <Col md={7} xs={12} sm={12} className='p-0 m-0 banner' >
      <Image
        alt="AED"
        src={img}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          minHeight: '60%',
          filter: 'contrast(0.5) brightness(0.5)'
        }}
      />
    </Col>
  )
}
export default Banner;