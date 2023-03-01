import { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import _ from 'lodash';
import AddPeopleEquipment from './AddPeopleEquipment';
import { DropDown, EmptyComponent } from '@components/common'
import { FilterForm, EquipmentItem, PaginationComponent } from '@/components';
import { connect, useDispatch, useSelector } from 'react-redux'
import "react-datepicker/dist/react-datepicker.css";
import { getModels, isNotUser } from '@/helpers';
import SelectionModel from '@/components/SelectionModel';
import { useNavigate } from 'react-router-dom';
import { getComplianceStatusList, getEquipmentCategoriesList, getEquipmentList, getEquipmentModelList, getUserTypes } from '@/services';

const Equipment = (props) => {
	const dispatch = useDispatch()
	const [state, setState] = useState({
		totalItems: 0,
		activePage: 1,
	});
	const equipmentData = useSelector((state) => {
		return {
			equipmentList: state.equipment.equipmentList,
			locationList: state.location.locationList,
			currentUser: state.auth.user,
			equipmentModelList: state.equipment.equipmentModelList,
			parentCategories: state.equipment?.parentCategoriesList,
			complianceStatusList: state.location.complianceStatusList,
			equipmentCategories: state.equipment.equipmentCategories,
			userTypes: state.people.userTypes,
			permissions: state.auth.licensePermissions,
		}
	})

	const { currentUser, equipmentList, locationList, equipmentModelList, complianceStatusList, 
		equipmentCategories, userTypes, parentCategories, } = equipmentData
	const navigate = useNavigate()
	const { serial_number, model, status, userType, isClearable, showModal, onFilter, location, isLoading, activePage, totalItems, selectionModel} = state
	const { data,  medication, permissions } = props
	const type = medication ? 'medication' : 'equipment';

	const parentId = parentCategories?.find((item) => item?.slug === type)?.id
	let categoryList = equipmentCategories?.filter((item) => +item?.parent_id === parentId)

	useEffect(() => {
		if ((status?.id || model?.id || location?.id || userType?.id) && !isLoading) {
			handleEquipmentFilter()
		}
	}, [status, model, location, userType])

	useEffect(() => {
		let payload = {
			slug: type,
			user_id: data?.id,
			location_id: location?.id,
			serial_number: serial_number,
			compliance_status_id: status?.id,
			equipment_model_id: model?.id,
			user_type_id: userType?.id,
			limit: 10,
			offset: 10 * (activePage - 1) || 0
		}
		setState({ ...state, isLoading: true })
		dispatch(getEquipmentList(payload)).unwrap().then((res) => setState({ ...state, totalItems: res?.total, isLoading: false }));
		dispatch(getComplianceStatusList(type))
		if (_.isEmpty(equipmentModelList))
			dispatch(getEquipmentModelList());

		if (_.isEmpty(equipmentCategories))
			dispatch(getEquipmentCategoriesList());

		if (_.isEmpty(userTypes))
			dispatch(getUserTypes())
	}, [onFilter, isClearable, activePage, type])

	const handleChange = (e, value) => setState({ ...state, [e.target.name]: value })

	const handleEquipmentFilter = () => setState({ ...state, onFilter: !onFilter, activePage: 1, isClearable: true })

	const clearFilter = () => setState({ serial_number: '', model: '', status: '', userType: '', date: null, activePage: 1, isClearable: false })

	const goToRegistration = (data) => { navigate({pathname : `/${type}/registration`, search: `slug=${data?.slug}`}) }

	return (
		<div className='d-flex flex-column flex-grow-1'>
			<FilterForm
				name={medication ? 'Medication' : 'Equipment'}
				onFilterClick={!isLoading ? () => handleEquipmentFilter() : false}
				onAddClick={(currentUser?.id === data?.id || isNotUser()) ? () => setState({ ...state, showModal: true }) : false}
				isClearable={isClearable}
				onClearFilter={() => !isLoading && clearFilter()}
			>
				<Col xs={12} lg={3} className='mt-2'>
					<DropDown
						disabled={isLoading}
						value={model?.name}
						placeholder='Model'
						name='model'
						data={getModels(parentCategories, type, equipmentModelList)?.model}
						onChange={(e) => handleChange(e, JSON.parse(e.target.id))}
					/>
				</Col>
				<Col xs={12} lg={3} className='mt-2'>
					<DropDown
						disabled={isLoading}
						value={status?.name}
						placeholder='Status'
						name='status'
						data={complianceStatusList}
						onChange={(e) => handleChange(e, JSON.parse(e.target.id))}
					/>
				</Col>
				<Col xs={12} lg={3} className='mt-2'>
					<DropDown
						searchable
						disabled={isLoading}
						value={location?.name}
						placeholder='Location'
						name='location'
						data={locationList}
						onChange={(e) => handleChange(e, JSON.parse(e.target.id))}
					/>
				</Col>
				<Col xs={12} lg={3} className='mt-2'>
					<DropDown
						disabled={isLoading}
						value={userType?.name}
						placeholder='Type'
						name='userType'
						data={userTypes}
						onChange={(e) => handleChange(e, JSON.parse(e.target.id))}
					/>
				</Col>
			</FilterForm>
			{(!_.isEmpty(equipmentList) && !isLoading) ?
				<div>
					{equipmentList.map((data, index) => {
						return (<EquipmentItem data={data} key={index} inPoepleDetail />)
					})}
					{totalItems > 10 && <PaginationComponent
						activePage={activePage}
						limit={10}
						totalItemsCount={totalItems}
						handlePageChange={(page) => !isLoading && setState({ ...state, activePage: page })}
					/>}
				</div>
				: (equipmentList && !isLoading) ?
					<EmptyComponent title={`${medication ? 'Medication' : 'Equipment'}`} />
					:
					<Row style={{ zIndex: 1, opacity: 0.8, flexGrow: '1' }} className='center m-1'>
						<Spinner animation='border' />
					</Row>
			}
			{showModal && <AddPeopleEquipment
				modelName ={medication ? 'Medication' : 'Equipment'}
				closeModal={() => setState({ ...state, showModal: false })}
				onSubmitAddEquipments={() => setState({ ...state, onFilter: !onFilter, showModal: false })}
				peopleData={data}
				addNewEquipment={() => setState({...state, selectionModel: true, showModal: false})} />
			}
			{
				<SelectionModel
					selectionModel={selectionModel}
					moduleName={medication ? "Medication" : "Equipment"}
					onHide={() => setState({ ...state, selectionModel: false })}
					categoryList={categoryList}
					onClick={goToRegistration} />
			}

		</div>
	)
}
function mapStateToProps(state) {
	return {
		// equipmentList: state.equipment.equipmentList,
		// locationList: state.location.locationList,
		// currentUser: state.auth.user,
		// equipmentModelList: state.equipment.equipmentModelList,
		// parentCategories: state.equipment?.parentCategoriesList,
		// complianceStatusList: state.location.complianceStatusList,
		// equipmentCategories: state.equipment.equipmentCategories,
		// userTypes: state.people.userTypes,
		// permissions: state.auth.licensePermissions,
	}
}
const actionCreators = {
	// getEquipmentList: (data) => (dispatch) => dispatch(getEquipmentList(data)),
	// getEquipmentModelList: (data) => (dispatch) => dispatch(getEquipmentModelList(data)),
	// getEquipmentCategoriesList: (data) => (dispatch) => dispatch(getEquipmentCategoriesList(data)),
	// getComplianceStatusList: (data) => (dispatch) => dispatch(getComplianceStatusList(data)),
	// getUserTypes: (data) => (dispatch) => dispatch(getUserTypes(data))
};
export default connect(mapStateToProps, actionCreators)(Equipment)