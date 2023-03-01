import { Col, Row, Image, OverlayTrigger, Popover } from 'react-bootstrap'
import { getAccessoryColor, getRightIcon } from '@/helpers'
import _ from 'lodash'
import { ToolTip } from './common'
import { MdOutlineLocationOn, MdOutlineDescription } from 'react-icons/md';
import { ShowDescription } from '.'
import { useNavigate, Link } from 'react-router-dom'
import { FaRegUser } from 'react-icons/fa'
import { useSelector } from 'react-redux';

const EquipmentItem = (props) => {
	let { id, serial_number, lot_number, location, description, compliance_status, accessories, missingAccessories, equipment_model, equipment_users, status } = props?.data;
	const navigate = useNavigate();

	const equipmentCategories = useSelector(state => state.equipment.equipmentCategories);
	let category = equipmentCategories?.find(category => category?.id === +equipment_model?.equipment_category_id);

	const isMedication = equipmentCategories?.find((categ) => +categ?.id === +category?.parent_id)?.slug === 'medication'

	function getColor() {
		if (compliance_status?.level === 'info') return 'success'
		else return compliance_status?.level
	}

	const getWorstAccessory = (id) => {
		let item = _.filter(accessories, (key) => { return key?.equipment_model_accessory?.accessory_type?.id === id })
		if (_.size(item) > 1) {
			let sorted = _.sortBy(item, (key) => { return key.expiration })
			item = sorted[0]    // next Expiring accessory
		}
		else item = item[0]
		return item;
	}

	const showAccessory = (id) => {
		let slug = id === 1 ? 'battery' : 'pad';
		let item;
		if (!_.isEmpty(missingAccessories)) {
			let missing = _.find(missingAccessories, (key) => { return key?.accessory_type?.id === id })
			if (missing) item = missing;
			else item = getWorstAccessory(id);
		}
		else {
			item = getWorstAccessory(id);
		}
		let icon = item?.accessory_type?.icon || item?.equipment_model_accessory?.accessory_type?.icon
		return icon && <img src={icon} title={slug} alt='icon' className={`Icon accessory-${getAccessoryColor(item?.expiration)}`} />
	}

	const onLog = tab => navigate({ pathname: `${isMedication ? '/medication/' : '/equipment/'}${id}`, search: `tab=${tab}` })

	return (
		<div className={`m-0 Bg-fff rounded d-flex flex-row mt-2 Shadow overflow-hidden equipmentItem-height`} >
			<div className={`Bg-${getColor()} p-0`} style={{ minWidth: '12px' }} ></div>
			<Row as={Col} className='p-2 m-0'>
				<Col xs={11} as={Link} to={`${isMedication ? '/medication/' : '/equipment/'}${id}`}
					className={`p-0 linkText`}>
					<Row className='m-0 p-0 d-flex flex-row justify-content-between'>
						<Col lg={'auto'} sm={'auto'} xs={'auto'} className='p-0 center'>
							<Image src={equipment_model?.image} alt='modal' className='AED' />
						</Col>
						<Row as={Col} xs={11} md={11} lg={12} className='center justify-content-between p-0 m-0'>
							<Col as={Row} xs={12} sm={6} lg={props?.inPoepleDetail ? 5 : 6} className='center justify-content-start m-0'>
								<Col xs={12} md={12} lg={5} className='p-0'>
									<p className='C-primary itemText text-truncate'><span className='C-818188'>{isMedication ? 'LN: ' : 'SN: '}</span> {isMedication ? lot_number : serial_number}</p>
								</Col>
								{!props?.inLocationDetail ?
									<Col xs={12} md={12} lg={7} className='p-0 collapseble'>
										<OverlayTrigger trigger="hover" placement="bottom"
											overlay={
												<Popover >
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
									:
									<Col className=' p-0 linkText C-dark bold F-14' xs={12} md={12} lg={7}>
										<MdOutlineDescription className='C-primary me-1' size={22} />
										<ShowDescription text={description} />
									</Col>
								}
							</Col>
							{props?.inPoepleDetail
								? <Col xs={12} sm={6} lg={2} className='center flex-row justify-content-start m-0'>
									<FaRegUser className='C-primary me-1' size={18} />
									<p className='itemText C-818188'>{equipment_users && equipment_users[0] && equipment_users[0]?.user_type?.name}</p>
								</Col>
								: null
							}
							<Col as={Row} xs={12} sm={6} lg={props?.inPoepleDetail ? 5 : 6} className='center justify-content-start m-0'>
								<Col xs={12} md={12} lg={props?.inMainList ? 4 : 5} className='p-0 d-flex'>
									<span className={`C-${getColor()} itemText text-truncate`}>{compliance_status?.name}</span>
								</Col>
								{props?.inMainList
									? <Col xs={12} md={12} lg={2} className='p-0 d-flex'>
										<div className={`${status}Status`}>{status}</div>
									</Col>
									: null}
								<Col className='p-0 center' xs={8} md={12} lg={props?.inMainList ? 5 : 7}>
									<div className='d-flex justify-content-between w-100' style={{ maxWidth: '160px' }}>
										<img src={getRightIcon(compliance_status?.level)} alt='Icon' className='Icon' />
										{showAccessory(2)}
										{showAccessory(1)}
									</div>
								</Col>
							</Col>
						</Row>
					</Row>
				</Col>
				<Col className='center justify-content-end' xs={1} sm={1} lg={1}>
					<ToolTip
						options={[
							{ name: `Log ${['hearing', 'vision'].includes(category?.slug) ? 'Service' : 'Inspection'}`, onClick: () => onLog(1) },
							{ name: 'Log Activity', onClick: () => onLog(4) }
						]}
					/>
				</Col>
			</Row >
		</div >
	)
}

export default EquipmentItem;