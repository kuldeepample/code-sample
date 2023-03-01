import Container from "@/components/common/Container";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const EquipmentTypeItem = ({ data }) => {
	const isMedication = data?.type === 'medication'
	return (
		<Container classes='p-2 mt-2 Shadow'>
			<Col xs={2} lg={1} className="ps-0">
				<img src={data?.equipment_model?.image} alt='model' className='border' style={{ height: '55px', width: '55px' }} />
			</Col>
			<Col as={Row} xs={10} lg={10} className="m-0 center justify-content-start">
				<Col sm={4} className='p-0 linkText' as={Link} to={`/${isMedication ? 'medication' : 'equipment'}/${data?.id}`}>
					<p className="C-primary" style={{ fontSize: '16px' }}>{isMedication ? 'LN: ' + data?.lot_number : 'SN: ' + data.serial_number}</p>
				</Col>
				<Col className='p-0' sm={5} lg={'auto'}>
					<p className='C-primary' style={{ fontSize: '16px' }}>Equipment: <span className='sort' >{data.equipment_model?.name}</span></p>
				</Col>
			</Col>
		</Container>
	)
}
export default EquipmentTypeItem;