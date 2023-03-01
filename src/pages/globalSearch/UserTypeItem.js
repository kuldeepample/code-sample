import Container from "@/components/common/Container";
import { Col, Row, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import avatar from '@images/avatar1.png'
import { getMobile, isNotUser } from "@/helpers";

const UserTypeItem = ({ data }) => {
    return (
        <Container classes='p-2 mt-2 Shadow'>
            <Col xs={1} className="ps-0 d-flex align-items-center">
                <Image src={data?.image || avatar} alt='Image' className='avatar rounded-circle B-primary me-1' />
            </Col>
            <Row as={Col} className='m-0 C-818188 text-truncate center' xs={1} md={2} lg={4} style={{ fontSize: '16px' }}>
                <Col as={isNotUser() ? Link : Col} to={`/people/${data?.id}`} className="linkText">
                    <p className='C-primary text-truncate' >{data?.fname} {data?.lname}</p>
                </Col>
                <Col className="p-lg-0">
                    <p className='text-truncate'>{getMobile(data?.mobile)}</p>
                </Col>
                <Col lg={4}>
                    <p className='text-truncate'>{data?.email}</p>
                </Col>
                <Col lg={2} className="p-lg-0 ">
                    <p className='text-truncate'>{data?.user_role?.name}</p>
                </Col>
            </Row>
        </Container>
    )
}
export default UserTypeItem;