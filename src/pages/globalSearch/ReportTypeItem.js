import Container from "@/components/common/Container";
import { getReportImage, isNotUser } from "@/helpers";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const ReportTypeItem = ({ data }) => {
    return (
        <Container classes='p-2 mt-2 Shadow'>
            <Col xs={'auto'} style={{ width: '7rem' }}>
                <img style={{  height: '3rem' }} src={getReportImage(data?.report_type)} alt='icon' className='report_icon' />
            </Col>
            <Col as={Row} xs={10} lg={10} className="m-0 center justify-content-start">
                <Col sm={4} className='p-0 linkText' as={isNotUser() ? Link : Col} to={`/reports/${data?.id}`}>
                    <p className="C-primary F-16" >{data.name}</p>
                </Col>
                <Col className='p-0' sm={5} lg={'auto'}>
                    <p className='C-primary F-16' >Created By: <span className='sort F-14' >{data.user?.fname + " " + data?.user?.lname}</span></p>
                </Col>
            </Col>
        </Container>
    )
}
export default ReportTypeItem;