
import { useEffect, useState } from 'react';
import { TextInput, DropDown } from '../common';
import PeopleList from '@/components/people/PeopleList';
import { Col } from 'react-bootstrap';
import _ from 'lodash';
import AddPeopleModal from '@/components/people/AddPeopleModal';
import FilterForm from '@components/FilterForm';
import { isNotUser } from '@/helpers';
import { PaginationComponent } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { getUserRoleList, getUserTypes } from '@/services';

const PeopleComponent = (props) => {
  const dispatch = useDispatch();
  const peopleData = useSelector((state) => {
    return {
      userRoleList: state.people.userRoleList,
      userTypes: state.people.userTypes
    }
  })
  const { userRoleList, userTypes} = peopleData
  const [state, setState] = useState(
    {
      filter: {
        fname: '',
        lname: '',
        user_role: {},
      },
      modalOpen: false,
      deleteModalOpen: false,
    }
  )
  const { parentData, peopleListData, handleFilter, handleAddPeople, handleEditUser, handleDeleteUser, loading, totalItems, getPeopleList} = props
  const { filter, modalOpen, isClearable, activePage = 1 } = state;

  useEffect(() => {
    let { fname, lname, user_role, user_type } = filter;
    let payload = {};
    if (fname || lname || !_.isEmpty(user_role) || !_.isEmpty(user_type)) {
      payload = {
        fname: fname,
        lname: lname,
        user_role_id: filter?.user_role?.id,
        user_type_id: filter?.user_type?.id,
      }
    }

    getPeopleList({ payload: payload, activePage: activePage })

    if (_.isEmpty(userRoleList))
      dispatch(getUserRoleList())
    if (_.isEmpty(userTypes))
      dispatch(getUserTypes())
  }, [activePage])

  useEffect(() => {
    if (filter?.user_type?.id || filter?.user_role?.id) {
      handlePeopleFilter()
    }
  }, [filter?.user_role, filter?.user_type])

  const handleFilterChange = e => setState({ ...state, filter: { ...state.filter, [e.target.name]: e.target.value } });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value) handlePeopleFilter()
  }
  const handlePageChange = (page) => setState({ ...state, activePage: page });

  const handleLastItem = () => {
    setState({ ...state, activePage: activePage - 1 })
    return { activePage: activePage - 1 }
  }

  const handlePeopleFilter = (lastItem) => {

    let { fname, lname, user_role, user_type } = filter;
    if (fname || lname || !_.isEmpty(user_role) || !_.isEmpty(user_type)) {
      let payload = {
        fname: fname,
        lname: lname,
        user_role_id: filter?.user_role?.id,
        user_type_id: filter?.user_type?.id,
        activePage: activePage
      }
      const callback = () => setState({ ...state, activePage: 1, isClearable: true })
      handleFilter({ payload: payload, callback: () => callback() });
    }
    else handleFilter({ payload: lastItem ? handleLastItem() : { activePage }, callback: () => { } });
  }

  const toggleModal = () => setState({ ...state, modalOpen: !state.modalOpen });

  const clearFilter = () => {
    setState({ ...state, isClearable: false, filter: { fname: '', lname: '', user_role: {} }, activePage: 1 })
    handleFilter({ payload: activePage, callback: () => { } });
  }

  return (
    <>
      <FilterForm
        name='People'
        onAddClick={isNotUser() ? () => toggleModal() : false}
        onFilterClick={() => handlePeopleFilter()}
        isClearable={isClearable}
        onClearFilter={() => clearFilter()}
      >
        <Col xs={12} lg={4} className=' mt-2'>
          <TextInput placeholder='First Name' name='fname' value={filter.fname} onChange={handleFilterChange} onKeyDown={handleKeyDown} />
        </Col>
        <Col xs={12} lg={4} className=' mt-2'>
          <TextInput placeholder='Last Name' name='lname' value={filter.lname} onChange={handleFilterChange} onKeyDown={handleKeyDown} />
        </Col>
        {parentData?.name &&
          <Col xs={12} lg={4} className=' mt-2'>
            <DropDown value={filter.user_role.name} placeholder='User Role' name='user_role' data={userRoleList}
              onChange={(e) => setState(({ ...state, filter: { ...state.filter, [e.target.name]: JSON.parse(e.target.id) } }))} />
          </Col>
        }
        {( parentData?.location_id )&&
          <Col xs={12} lg={4} className=' mt-2'>
            <DropDown value={filter.user_type?.name} placeholder='User Type' name='user_type' data={userTypes}
              onChange={(e) => setState(({ ...state, filter: { ...state.filter, [e.target.name]: JSON.parse(e.target.id) } }))} />
          </Col>
        }
      </FilterForm>

      <PeopleList
        peopleList={peopleListData}
        parentData={parentData}
        handleEditUser={(data) => { handleEditUser({ ...data, filter: () => handlePeopleFilter() }); }}
        handleDeleteUser={(data) => { handleDeleteUser({ ...data, filter: (lastItem) => handlePeopleFilter(lastItem) }); }}
        empty={!isClearable}
        onAddNew={isNotUser() ? () => toggleModal() : false}
      />
      {totalItems > 10 && !loading &&
        <PaginationComponent
          activePage={activePage}
          limit={10}
          totalItemsCount={totalItems}
          handlePageChange={(page) => !loading && handlePageChange(page)}
        />
      }
      {modalOpen &&
        <AddPeopleModal
          closeModal={() => toggleModal()}
          parentData={parentData}
          handleAddPeople={(data) => handleAddPeople({ ...data, activePage })}
          userTypes = {userTypes}
        />}
    </>
  )
}

export default PeopleComponent;