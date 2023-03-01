import { Col, Image, Row } from 'react-bootstrap';

const EquipmentItem = (props) => {
    let { item } = props
    return (
        <Row
            className={`p-2 m-0 Bg-fff d-flex flex-row justify-content-between align-items-center`}
            style={{ minHeight: '78px' }}
        >
            <Col lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'} className='p-0 d-flex flex-row align-items-center justify-content-between'>
                <Image src={item?.equipment_model?.image} alt='modal' className='avatar2 me-1 mb-1' />
            </Col>
            <Row as={Col} lg={11} md={11} sm={11} xs={11} className='d-flex flex-row justify-content-between align-items-center m-0'>
                <Col lg={3} md={6} sm={6} xs={12} className='itemText C-primary bold'>{item?.lot_number || item?.serial_number }</Col>
                <Col lg={3} md={4} sm={4} xs={12} className='itemText C-818188 '>{item?.equipment_model?.name || 'NA'}</Col>
                <Col lg={4} md={7} sm={7} xs={12} className='itemText C-818188 collapseble'>{item?.compliance_status?.name || 'NA'}</Col>
                <Col lg={2} md={4} sm={4} xs={12} className='itemText C-818188 ' title='Compliant'>{item?.compliant ? "Yes" : 'No'}</Col>
            </Row>
        </Row>
    )
}
export default EquipmentItem;