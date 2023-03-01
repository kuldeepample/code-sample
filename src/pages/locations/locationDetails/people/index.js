import PeopleComponent from '@components/people'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import { CloseButton, Pressable } from '@/components/common';
import { Link } from 'react-router-dom';
import { addUserToLocation, deleteLocationUser, getLocationPeople } from '@/services';

const People = (props) => {
    const dispatch = useDispatch()
    const peopleData = useSelector((state) => {
        return {
            locationPeople: state.location.locationPeople
        }
    })
    const { locationPeople } = peopleData
    const [states, setState] = useState({ loading: false })
    let { loading, showModal, modalData, totalItems } = states
    let { locationData } = props

    const getPeopleList = ({ activePage, ...payload }) => {
        if (locationData && locationData.id) {
            setState((prev) => ({ ...prev, loading: true, }));
            dispatch(getLocationPeople({
                ...payload,
                location_id: locationData.id,
                limit: 10,
                offset: 10 * (activePage - 1),
            })).unwrap().then(res => {
                setState((prev) => ({ ...prev, loading: false, totalItems: res?.total || 0 }))
            })
        }
    }

    const handleAddPeople = async ({ selectedPeople, callBack, activePage }) => {
        let data = { 'user_ids': selectedPeople, 'location_id': locationData?.id }
        dispatch(addUserToLocation(data)).unwrap().then((res) => {
            if(res?.success){
                toast.success(res?.message)
            }
        })
        await dispatch(getLocationPeople({
            location_id: locationData.id,
            limit: 10,
            offset: 10 * (activePage - 1)
        })).unwrap().then((res) => {
            callBack();
        })
    }

    const handleEditUser = ({ state, filter }) => { filter(); state(); };

    const handleDeleteUser = ({ user_id, state, filter, lastItem }) => {
        dispatch(deleteLocationUser({ user_id: user_id, location_id: locationData.id })).unwrap()
            .then((res) => {
                if (res.success) {
                    toast.success(res.message)
                    filter(lastItem); state();
                }
                else {
                    setState({...state, showModal: true, modalData: res })
                    state();
                }
            })
            .catch((e) => {
                toast.error('Error in deleting People!')
                setState({...state, loading: false})
            });
    }

    const handleFilter = ({ payload, callback }) => {
        getPeopleList(payload);
        callback();
    }

    return (
        <>
            <PeopleComponent
                peopleListData={loading || locationPeople}
                parentData={locationData}
                handleFilter={(data, fun) => handleFilter(data, fun)}
                handleAddPeople={(people) => handleAddPeople(people)}
                handleEditUser={(people) => handleEditUser(people)}
                handleDeleteUser={(people) => handleDeleteUser(people)}
                loading={loading}
                totalItems={totalItems}
                getPeopleList={(props) => getPeopleList({ ...props })}
            />

            {showModal &&
                <Modal show={showModal}
                    size={"sm"} centered
                    onHide={() => setState({ showModal: false, modalData: {} })}
                    backdropClassName='bg-dark'
                >
                    <Modal.Header style={{ height: '50px' }}>
                        <Modal.Title className='C-primary modalHeader bold text-truncate'>Can not Remove People</Modal.Title>
                        <CloseButton onClose={() => setState({ showModal: false, modalData: {} })} />
                    </Modal.Header>
                    <Modal.Body className='pt-2'>
                        <div className='center flex-column C-dark text-center'>
                            <p className='F-16'>{modalData?.message}</p>
                            <p className='F-12'>If you want to remove people, please remove it from equipment detail</p>
                            <Pressable as={Link}
                                classes='mt-2'
                                to={{ pathname: '/equipment/' + modalData?.equipment?.id, search: `tab=3` }}
                                title={`Go to AED SN:${modalData?.equipment?.serial_number}`}
                            />
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}
export default People;