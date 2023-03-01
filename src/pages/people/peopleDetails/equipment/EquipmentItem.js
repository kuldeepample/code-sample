import { Col, Image, Row } from 'react-bootstrap';

const EquipmentItem = (props) => {
    let { item } = props
    return (
        <Row
            className={`p-2 m-0 Bg-fff d-flex flex-row justify-content-between align-items-center`}
            style={{ minHeight: '78px' }}
        >
            <Col lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'} className='p-0 d-flex flex-row align-items-center justify-content-between'>
                <Image src={item?.equipment_model?.image} alt='Model' className='avatar2 me-1 mb-1' />
            </Col>
            <Row as={Col} lg={11} md={11} sm={11} xs={11} className='d-flex flex-row justify-content-between align-items-center m-0' style={{ width: '90%'}}>
                <Col lg={3} md={6} xs={12} className='itemText C-primary bold text-truncate'>{item?.serial_number || item?.lot_number}</Col>
                <Col lg={3} md={6} xs={12} className='itemText C-primary bold text-truncate'>{item?.location?.name || ''}</Col>
                <Col lg={2} md={4} xs={12} className='itemText C-818188 '>{item?.equipment_model?.name || 'NA'}</Col>
                <Col lg={3} md={7} xs={10} className='itemText C-818188 collapseble'>{item?.compliance_status?.name || 'NA'}</Col>
                <Col lg={1} md={4} xs={2} className='itemText C-818188 '>{item?.compliant ? "Yes" : 'No'}</Col>
            </Row>
        </Row>
    )
}
export default EquipmentItem;