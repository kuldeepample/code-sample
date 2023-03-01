import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { Row, Col, Spinner } from "react-bootstrap";
import _ from 'lodash'
import { Container, EmptyComponent } from '@/components/common'
import UserTypeItem from "./UserTypeItem";
import LocationTypeItem from "./LocationTypeItem";
import EquipmentTypeItem from "./EquipmentTypeItem";
import ReportTypeItem from "./ReportTypeItem";
import { getQueryParams, isNotUser } from "@/helpers";
import { PaginationComponent } from "@/components";
import { getSearchResults } from "@/services";
import CredentialTypeItem from './CredentialTypeItem'
import CourseItem from "../Courses/CourseComponent/CourseItem";

const GlobalSearch = (props) => {
	const dispatch = useDispatch()
	const [state, setState] = useState({
		limit: 10,
		offset: 0,
		activePage: 1,
		totalResults: 0,
	});
	let location = useLocation()
	let navigate = useNavigate()
	const { loading, selected, checked, searchKey, results, totalResults, limit, activePage, offset, callList } = state;

	const tabData = [
		{ id: 1, name: 'Location', key: 'location' },
		{ id: 2, name: 'People', key: 'user' },
		{ id: 3, name: 'Equipment', key: 'equipment' },
		{ id: 4, name: 'Credential', key: 'credential' },
		{ id: 6, name: 'Course', key: 'course' },
		{ id: 7, name: 'Medication', key: 'medication' },
		// { id: 4, name: 'Training', key: 'training' },
		{ id: 5, name: 'Reports', key: 'report' },
	]

	const handleSearchResults = () => {
		let searchParams = location.search;
		if (searchParams) {
			let objectParams = getValue()
			let selectedArray = [];
			let checkedArray = [];
			_.mapKeys(objectParams, function (v, key) {
				tabData.forEach((item) => {
					if (item.key === key) {
						checkedArray.push(item.id);
						selectedArray.push(item);
					}
				})
				return key;
			});

			let payload = {
				...objectParams,
				limit: limit || 10,
				offset: limit * (activePage - 1),
			}
			if(objectParams.search.trim()){
				setState(prev => ({ ...prev, loading: true, selected: selectedArray, checked: checkedArray, }))
				dispatch(getSearchResults(payload)).unwrap().then(res => {
					if (res) {
						setState(prev => ({ ...prev, loading: false, selected: selectedArray, checked: checkedArray, searchKey: objectParams.search, results: res?.data, totalResults: res?.total }))
					}
				});
			}
		}
		else {
			navigate('/dashboard')
		}
	}
	useEffect(() => {
		handleSearchResults()
	}, [ limit, activePage, callList])

	useEffect(() => {
		setState({...state, activePage: 1, callList: !callList, offset: 0 })
	}, [location.search])

	const getValue = () => {
		if (location.search.includes('search')) {
			const windowUrl = location.search;
			const params = new URLSearchParams(windowUrl);
			return Object.fromEntries(params)
		}
	}

	const getParams = (item) => {
		let p = { search: searchKey };
		item.forEach((data) => { p[data.key] = 1; })
		return (getQueryParams(p))
	}

	const handleCheck = (e, item) => {
		if (e.target.checked) {
			navigate({
				pathname: '/search',
				search: `?${getParams(_.concat(selected || [], [item]))}`
			})
		}
		else {
			navigate({
				pathname: '/search',
				search: `?${getParams(_.remove(selected, (key) => { return key.id !== item.id; }))}`
			})
		}
	}

	return (
		<>
			<Row style={{ margin: '11px 0 0 15px' }}>
				<Col md={3} className='Bg-fff'>
					<p className="c mt-3 C-dark text-wrap text-truncate" style={{ fontSize: '16px' }}>Modify the Results from <br />http://connect.schoolhealth.com</p>
					{
						tabData.map((item, key) => {
							return ( (item?.id !== 2 || isNotUser()) &&
								<div key={key} className="d-flex align-items-center mt-2">
									<label className="d-flex align-items-center">
										<input type='checkbox' className='regular-checkbox me-1'
											name={'tab' + item.id}
											onClick={(e) => handleCheck(e, item)}
											checked={_.includes(checked, item.id)}
										/>
										<p className="ms-2 sort" style={{ fontSize: '14px' }} >{item?.name}</p>
									</label>
								</div>
							)
						})
					}
					<hr style={{ marginTop: '55px' }} />
					<div style={{ marginTop: '49.5px' }}>
						<p className="sort">Can't find what you need?</p>
					</div>
					<div style={{ height: '117', marginTop: '18px' }} className="mb-5 text-wrap">
						<p className="sort text-wrap">Visit our <a href="https://www.schoolhealth.com/" target="_blank" > Corporate Site </a> for marketing and sales information.
							<br /><br />
							Visit our <a href='https://schoolhealthcorporation.zendesk.com/hc/en-us' target="_blank"> Help Center </a> for documentation, support knowledge base, and community discussions.</p>
					</div>
				</Col>
				<Col md={9} className='mt-1'>
					<Container md={'auto'} classes='ps-0 d-flex flex-row align-items-center justify-content-start'>
						<Col className="C-primary">Search Results</Col>
						<Col className="sort">results {offset + (totalResults ? 1 : 0)}-{_.size(results) + offset} of {totalResults}</Col>
					</Container>

					<p className="sort m-2" style={{ fontSize: '12px' }}>Related search for {searchKey}</p>
					{!_.isEmpty(results) ?
						(_.isArray(results) ? results : [])?.map((item, key) => {
							if (item?.type === 'user') {
								return <UserTypeItem key={key} data={item} />
							}
							else if (item?.type === 'location') {
								return <LocationTypeItem key={key} data={item} />
							}
							else if (item?.type === 'equipment') {
								return <EquipmentTypeItem key={key} data={item} />
							}
							else if (item?.type === 'medication') {
								return <EquipmentTypeItem key={key} data={item} />
							}
							else if (item?.type === 'report') {
								return <ReportTypeItem key={key} data={item} />
							}
							else if(item?.type === 'credential') {
								return <CredentialTypeItem key={key} data={item} />
							}
							else if(item?.type === 'course') {
								return <CourseItem key={key} data={item} globalSearch/>
							}
							else return null
						})
						:
						<EmptyComponent title='Result' />
					}

					{totalResults > 10 ? <Row className='mt-2 center'>
						<PaginationComponent
							activePage={activePage}
							isLimit
							limit={limit}
							totalItemsCount={totalResults}
							handlePageChange={(page) => !loading && setState({ ...state, offset: limit * (page - 1), activePage: page })}
							handleChange={(e, value) => setState({ ...state, [e.target.name]: value, activePage: 1, offset: 0 })}
						/>
					</Row>
						: null}
				</Col>
			</Row>
			{
				loading &&
				<Row style={{ zIndex: 1, position: 'absolute', opacity: 0.8, height: '136%' }} className='w-100 p-0 m-0 center Bg-fff'>
					<Spinner animation='border' />
				</Row>
			}

		</>
	)
}
const actionCreators = {
	// getSearchResults: (queryParams) => (dispatch) => dispatch(getSearchResults(queryParams)),
}
export default connect(null, actionCreators)(GlobalSearch);