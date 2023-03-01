import { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Col, Row, Spinner } from 'react-bootstrap';

import AddressBar from '@components/Layout/AddressBar';
import { TextInput, DropDown, EmptyComponent } from '@components/common';
import { DeleteModal, FilterForm, PaginationComponent } from '@/components';

import './../../theme/Colors.css';
import './index.css';
import PeopleItem from '@/components/people/PeopleItem'
import AddEditPeople from '@/components/people/AddEditPeople';
import { isNotUser } from '@/helpers';
import SortField from '@/components/common/SortField';
import { getUserRoleList, getUsersList, updatePeopleDetail } from '@/services';
import { toast } from 'react-toastify';
// import { getUserRoleList, getUsersList, updatePeopleDetail } from '@/services/people.service';

const People = (props) => {
  const [state, setState] = useState({})
  const dispatch = useDispatch()
  const peopleData = useSelector((state) => {
    return {
      usersList: state.people.usersList,
      user: state.auth.user,
      totalUser: state.people.totalUser,
      permissions: state.auth.licensePermissions,
      userRoleList: state.people.userRoleList
    }
  })
  const { usersList, totalUser, permissions, userRoleList, user } = peopleData;
  const {
    modalOpen = false,
    deleteModal = false,
    sort,
    limit = 10,
    activePage = 1,
    activeItemData = {},
    isActive = true,
    fname, lname, user_role, isClearable, onFilter, showMenu, loading } = state;

  const sortData = [{ key: 'fname', name: "Fname" }, { key: 'lname', name: "Lname" }, { key: 'user_role_id', name: "User Role" }]

  useEffect(() => {
    if (user_role?.id) {
      handleFilter()
    }
    if (!userRoleList || userRoleList.length)
      dispatch(getUserRoleList())
  }, [user_role])

  useEffect(() => {
    getPeopleList();
  }, [onFilter, isClearable, activePage, sort?.name, limit, isActive])

  const setStates = (states) => {
    setState(prev => {
      return ({ ...prev, ...states })
    })
  }
  const getPeopleList = () => {
    setStates({ loading: true })
    let payload = {
      offset: limit * (activePage - 1),
      limit: limit,
      sort: sort?.key,
      fname: fname,
      lname: lname,
      user_role_id: user_role?.id || '',
      status: isActive ? 'active' : 'inactive'
    }
    dispatch(getUsersList(payload)).unwrap().then((res) => {
      if (res?.success)
        setStates({ loading: false })
    });
  }

  const handleFilterChange = (e, value) => setStates({ [e.target.name]: value });

  const toggleAddEditModal = data => setStates({ activeItemData: data || {}, modalOpen: !modalOpen, showMenu: data ? false : undefined })

  const toggleDeleteModal = data => setStates({ activeItemData: data || {}, deleteModal: !deleteModal, showMenu: data ? false : undefined });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value) handleFilter()
  }

  const handleFilter = () => {
    if (fname || lname || user_role?.id)
      setStates({ isClearable: true, activePage: 1, onFilter: !onFilter });
  }

  const clearFilter = () => setStates({ fname: '', lname: '', user_role: '', isClearable: false });

  const handlePageChange = (page) => setStates({ activePage: page });

  const deleteUser = () => {
    setStates({ loading: true })
    dispatch(updatePeopleDetail({id: activeItemData?.id, data: { status: 'deleted' }})).unwrap().then((res) => {
      if (res?.success) {
        toast.success(res?.message)
        toggleDeleteModal();
        getPeopleList();
      }
      else
        setStates(prev => ({ ...prev, loading: false }))
    });
  }

  let switchBtnColor = isActive ? 'Bg-success' : 'Bg-danger'

  return (
    <>
      <AddressBar page={[{ name: 'People' }]}
        right={<SortField sortData={sortData} sort={sort}
          handleChange={(e, value) => setState({ ...state, [e.target.name]: value, activePage: 1 })} />}
      />
      <FilterForm
        name='People'
        onAddClick={() => setStates({ modalOpen: true })}
        isDisableAdd={!permissions?.user?.canCreate}
        onFilterClick={() => handleFilter()}
        isClearable={isClearable}
        onClearFilter={() => clearFilter()}
      >
        <Row as={Col} className='p-0 m-0'>
          <Col xs={12} lg={4} className='mt-2'>
            <TextInput placeholder='First Name' name='fname' value={fname} onChange={(e) => handleFilterChange(e, e.target.value)} onKeyDown={handleKeyDown} />
          </Col>
          <Col xs={12} lg={4} className='mt-2'>
            <TextInput placeholder='Last Name' name='lname' value={lname} onChange={(e) => handleFilterChange(e, e.target.value)} onKeyDown={handleKeyDown} />
          </Col>
          <Col xs={12} lg={4} className='mt-2'>
            <DropDown value={user_role?.name} name='user_role' placeholder='User Role' data={userRoleList} onChange={(e) => handleFilterChange(e, JSON.parse(e.target.id))} />
          </Col>
        </Row>
        {isNotUser() ?
          <Col xs={12} lg={'auto'} className='mt-2 d-flex align-items-center'>
            <input
              className="switch-checkbox"
              id={`switch`}
              checked={isActive}
              type="checkbox"
            />
            <button
              onClick={() => setStates({ isActive: !isActive })}
              className={`switch-label`}
              htmlFor={`switch`}
            >
              <span className={`switch-button ${switchBtnColor}`} />
            </button>
            <span className='C-818188 ps-2' style={{ minWidth: '70px' }}>{isActive ? ` Active ` : 'Inactive'}</span>
          </Col>
          : null}
      </FilterForm>

      {loading && !activeItemData?.id ?
        <div className='center' style={{ width: '98%', flex: '1' }}>
          <Spinner animation="border" />
        </div>
        :
        usersList && usersList.length ?
          <div>
            {usersList.map((item, idx) =>
              <PeopleItem key={'location-' + idx}
                item={item}
                isMainList={isNotUser()}
                showMenu={showMenu}
                onClickEdit={() => { toggleAddEditModal(item); }}
                onClickDelete={() => { toggleDeleteModal(item); }} />
            )}

            {totalUser > 10 &&
              <PaginationComponent
                activePage={activePage}
                limit={limit}
                isLimit
                totalItemsCount={totalUser}
                handlePageChange={(page) => handlePageChange(page)}
                handleChange={(e, value) => setStates({ [e.target.name]: value, activePage: 1 })}
              />}
          </div>
          :
          <EmptyComponent title='People' empty={!isClearable} onAddNew={!isClearable ? () => setStates({ modalOpen: true }) : false} isDisableAddNew={!permissions?.user?.canCreate} />

      }
      {modalOpen && <AddEditPeople
        type={activeItemData?.id ? 'Edit' : 'Add'}
        name='People'
        show={modalOpen}
        user={activeItemData}
        closeModal={() => toggleAddEditModal()}
        onSuccess={() => { getPeopleList(); toggleAddEditModal(); }}
      />}

      {deleteModal &&
        <DeleteModal
          show={deleteModal}
          name={`${activeItemData?.user?.fname || activeItemData?.fname}`}
          isSubmitting={loading}
          closeModal={() => toggleDeleteModal()}
          messageComponent={<p className='lable mt-1 text-center'>Are you sure you want to remove <b>{(activeItemData?.user?.fname || activeItemData?.fname) + " " + (activeItemData?.user?.lname || activeItemData?.lname)}</b>?</p>}
          onClickDelete={() => { deleteUser() }}
        />
      }
    </>
  )
}

export default People;
