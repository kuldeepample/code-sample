import { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import _ from 'lodash';
import AddLocationEquipment from './AddLocationEquipment';
import { TextInput, DropDown, EmptyComponent, ReactDatePicker } from '@components/common';
import { FilterForm, EquipmentItem, PaginationComponent } from '@/components';
import { useDispatch, useSelector } from 'react-redux'
// import { getComplianceStatusList, getEquipmentCategoriesList, getEquipmentList, getEquipmentModelList } from 'actions';
import MedicationItem from '@/components/MedicationItem';
import SelectionModel from '../../../../components/SelectionModel';
import { useNavigate } from 'react-router-dom';
import { getEquipmentList, getEquipmentModelList } from '@/services';
import { getComplianceStatusList } from '@/services/location.service';

const Equipment = (props) => {
	const [state, setState] = useState({});
	const navigate = useNavigate();
	const dispatch = useDispatch()

	const equipmentData = useSelector((state) => {
		return {
			equipmentList: state.equipment.equipmentList,
			equipmentModelList: state.equipment.equipmentModelList,
			complianceStatusList: state.location.complianceStatusList,
			equipmentCategories: state.equipment.equipmentCategories
		}
	})
	const { equipmentList, equipmentModelList, complianceStatusList, equipmentCategories} = equipmentData
	let { serial_number, lot_number, model, status, date, isClearable, showModal, onFilter, loading, totalItems, activePage = 1, selectionModel } = state
	let { location, onAddEquipment, medication } = props
	let slug = medication ? 'medication' : 'equipment'

	useEffect(() => {
		dispatch(getComplianceStatusList(slug));
		if (status?.id || model?.id || date) {
			handleEquipmentFilter()
		}
		if (_.isEmpty(equipmentModelList))
			dispatch(getEquipmentModelList());


		// if (_.isEmpty(equipmentCategories))
		// getEquipmentCategoriesList()
	}, [status, model, date])

	useEffect(() => {
		let payload = {
			location_id: location?.id,
			serial_number: serial_number || '',
			lot_number: lot_number || '',
			compliance_status_id: status?.id,
			equipment_model_id: model?.id,
			date: date || '',
			limit: 10,
			offset: 10 * (activePage - 1),
			slug,
		}
		setState({ ...state, loading: true })
		dispatch(getEquipmentList(payload)).unwrap().then(res => setState({ ...state, loading: false, totalItems: res?.total || 0 }))
	}, [onFilter, isClearable, activePage])

	const handleChange = (e, value) => setState({ ...state, [e.target.name]: value });

	const handlePageChange = (page) => setState({ ...state, activePage: page });

	const handleEquipmentFilter = () => {
		if ((serial_number || model?.id || lot_number || status?.id || date) && !loading) {
			setState({ ...state, onFilter: !onFilter, isClearable: true, activePage: 1 });
		}
	}

	const addNewEquipment = () => {
		setState({ ...state, selectionModel: true, showModal: false })
	}
	const goToRegistration = (item) => {
		navigate(medication ? `/medication/registration?slug=${item?.slug}` : `/equipment/registration?slug=${item?.slug}`)
	}

	const clearFilter = () => setState({ serial_number: '', model: '', status: '', date: null, isClearable: false, activePage: 1 });

	let parentId = equipmentCategories?.find((category) => category?.slug === slug)?.id
	let categoryList = equipmentCategories?.filter((category) => +category?.parent_id === parentId);

	const modelList = (models) => {
		let parentId = categoryList?.find((category) => category?.parent_id)?.parent_id
		let modelList = models?.filter((model) => model?.equipment_category?.parent_id === parentId);
		return modelList;
	}

	return (
		<>
			<FilterForm
				name={medication ? 'Medication' : 'Equipment'}
				onFilterClick={() => handleEquipmentFilter()}
				onAddClick={() => { setState({ ...state, showModal: true }) }}
				isClearable={isClearable}
				onClearFilter={() => clearFilter()}
			>
				<Col xs={12} lg={3} className='mt-2'>
					<TextInput value={medication ? lot_number : serial_number} placeholder={`${medication ? 'Lot' : 'Serial'} Number`} name={medication ? 'lot_number' : 'serial_number'} onChange={(e) => handleChange(e, e.target.value)}
						onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) handleEquipmentFilter() }} />
				</Col>
				<Col xs={12} lg={3} className='mt-2'>
					<DropDown value={model?.name} placeholder='Model' name='model' data={modelList(equipmentModelList) || []} onChange={(e) => handleChange(e, JSON.parse(e.target.id))} />
				</Col>
				<Col xs={12} lg={3} className='mt-2'>
					<DropDown value={status?.name} placeholder='Status' name='status' data={complianceStatusList} onChange={(e) => handleChange(e, JSON.parse(e.target.id))} />
				</Col>
				<Col xs={12} lg={3} className='mt-2'>
					<ReactDatePicker
						placeholderText='Select a Date'
						selected={date}
						classes='Shadow'
						onChange={(date) => handleChange({ target: { name: "date" } }, date)}
					/>
				</Col>
			</FilterForm>
			{!_.isEmpty(equipmentList) && !loading ?
				equipmentList.map((data, index) => {
					return (
						medication ?
							<MedicationItem data={data} inLocationDetail />
							: <EquipmentItem data={data} key={index} inLocationDetail />)
				})
				: loading ?
					<Row style={{ zIndex: 1, opacity: 0.8, flex: '1' }} className='center'>
						<Spinner animation='border' />
					</Row>
					:
					<EmptyComponent title={medication ? 'Medication' : 'Equipment'} onAddNew={() => setState({ ...state, showModal: true })} />
			}
			{totalItems > 10 && !loading &&
				<PaginationComponent
					activePage={activePage}
					limit={10}
					totalItemsCount={totalItems}
					handlePageChange={(page) => !loading && handlePageChange(page)}
				/>
			}
			{showModal &&
				<AddLocationEquipment
					location={location}
					medication={medication}
					modelList={modelList(equipmentModelList)}
					addNewEquipment={addNewEquipment}
					closeModal={() => setState({ ...state, showModal: false })}
					onSubmitAddEquipments={() => {
						onAddEquipment();
						setState({ ...state, showModal: false, onFilter: !onFilter });
					}}
				/>
			}
			{
				<SelectionModel
					selectionModel={selectionModel}
					moduleName={medication ? "Medication" : "Equipment"}
					onHide={() => setState({ ...state, selectionModel: false })}
					categoryList={categoryList}
					onClick={goToRegistration} />
			}
		</>
	)
}

export default Equipment;