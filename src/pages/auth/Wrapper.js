import { Col, Image, Row } from "react-bootstrap";
import img from '@images/banner-min.jpg';
import logo from '@images/logo.png'


const Wrapper = (props) => {
    return (
        <>
            <div className='min-vh-100'>
                <Row className='m-0 h-100'>
                    <Col md={7} className='p-0 m-0 banner d-none d-md-flex' >
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
                    <Col md={5} xs={12} sm={12} className="d-flex flex-column align-items-center min-vh-100 Bg-fff formView">
                        <div className="logo p-0">
                            <img alt="Image" src={logo} className="w-100" />
                        </div>
                        {props.children}
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Wrapper;