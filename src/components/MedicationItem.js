import React from 'react'
import { Col, Image, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import { MdOutlineDescription, MdOutlineLocationOn } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { ToolTip } from './common';
import { getRightIcon } from '@/helpers';
import moment from 'moment';
import ShowDescription from './ShowDescription';
import '@/pages/equipment/index.css'

const MedicationItem = (props) => {
	const { equipment_model, lot_number, id, description, location,expiration, compliance_status } = props.data;

	let expirationDate = expiration ? moment(expiration).format("MM/DD/YYYY") : "-";
	const navigate = useNavigate()
	const getColor = () => {
		if (compliance_status?.level === 'info') return 'success'
		else return compliance_status?.level
	}


	const onLog = tab => navigate({ pathname: `/medication/${id}`, search: `tab=${tab}` })
	return (
		<div className={`m-0 Bg-fff rounded d-flex flex-row mt-2 Shadow overflow-hidden equipmentItem-height`} >
			<div className={`Bg-${getColor()} p-0`} style={{ minWidth: '12px' }} ></div>
			<Row as={Col} className='p-2 m-0'>
				<Col xs={11} as={Link} to={`/medication/` + id}
					className={`p-0 linkText`}>
					<Row className='m-0 p-0 d-flex flex-row justify-content-between'>
						<Col lg={'auto'} sm={'auto'} xs={'auto'} className='p-0 center'>
							<Image src={equipment_model?.image} alt='model' className='AED' />
						</Col>
						<Row as={Col} xs={11} md={11} lg={12} className='center justify-content-between p-0 m-0'>
							<Col as={Row} xs={12} sm={6} lg={5} className='center justify-content-start m-0'>
								<Col xs={12} md={12} lg={5} className='p-0'>
									<p className='C-primary itemText text-truncate'><span className='C-818188'>LN:</span> {lot_number}</p>
								</Col>
								{ props?.inLocationDetail ?
									<Col className=' p-0 linkText C-dark bold F-14' xs={12} md={12} lg={7}>
									<MdOutlineDescription className='C-primary me-1' size={22} />
									<ShowDescription text={description} />
								</Col>
								:
								<Col xs={12} md={12} lg={7} className='p-0 collapseble'>
									<OverlayTrigger trigger="hover" placement="bottom"
										overlay={
											<Popover>
												<Popover.Body>
													{description}
												</Popover.Body>
											</Popover>
										}>
										<Link to={'/locations/' + location?.id} className='p-0 linkText'>
											<span className='C-primary itemText text-truncate'>
												<MdOutlineLocationOn className='C-primary me-1' size={25} />{location?.name}
											</span>
										</Link>
									</OverlayTrigger>
								</Col>
								}
							</Col>

							<Col as={Row} xs={12} sm={6} lg={7} className='justify-content-start m-0 align-items-center'>
								<Col xs={12} md={12} lg={5} className='p-0 d-lg-flex'>
									<span className={`C-${getColor()} itemText text-truncate`}>{compliance_status?.name}</span>
								</Col>
								<Col className='p-0' xs={8} lg={2} md = {12}>
									<div className='d-lg-flex justify-content-center' style={{ maxWidth: '160px' }}>
										<img src={getRightIcon(compliance_status?.level)} alt='Icon' className='Icon' />
									</div>
								</Col>
								<Col xs={8} md={12} lg={5} className="ps-0 ps-lg-2">
									<div className='C-818188 itemText' style={{ minWidth: '7rem'}}>Expires:
										<span className='C-primary itemText ms-2'>{expirationDate}</span>
									</div>
								</Col>
							</Col>
						</Row>
					</Row>
				</Col>
				<Col className='center justify-content-end px-0' xs={1}>
					<ToolTip
						options={[
							{ name: `Log Inspection`, onClick: () => onLog(1) },
							{ name: 'Log Activity', onClick: () => onLog(3) }
						]}
					/>
				</Col>
			</Row >
		</div >
	)
}

export default MedicationItem