import Container from "@/components/common/Container";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdOutlineLocationOn } from "react-icons/md";


const LocationTypeItem = ({ data }) => {
    return (
        <Container classes='p-3 mt-2 Shadow' >
            <Col xs={1} style={{ maxWidth: '50px' }}>
                <MdOutlineLocationOn size={28} color='#c60970' />
            </Col>
            <Col xs={11}>
                <Row as={Link} to={`/locations/${data?.id}`} className="linkText">
                    <p className='C-primary text-truncate' style={{ fontSize: '16px' }}>{data?.name}</p>
                </Row>
            </Col>
        </Container>
    )
}
export default LocationTypeItem;