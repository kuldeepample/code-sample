import { updateLocationTime } from '@/services'
import moment from 'moment'
import React, { useState } from 'react'
import { Col, Spinner } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import AddEditModal from './AddEditModal'

const TimingModal = (props) => {
    const dispatch = useDispatch()

    const { show, handleModal, locationId, times } = props
    const [state, setState] = useState({})

    const apiTimeData = times?.reduce((acc, obj) => ({ ...acc, [obj.day]: { ...obj, start: obj?.start && moment(obj?.start, 'HH:mm:ss').format('HH:mm'), end: obj?.start && moment(obj?.end, 'HH:mm:ss').format('HH:mm') } }), {})
    const totalDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    let openDays = totalDays.filter((item) => !apiTimeData[item]?.is_close)

    const { selectedDays = openDays, timeTable = apiTimeData, loading = false } = state

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const handleCheck = (e, day) => {
        if (e.target.checked) {
            const newList = selectedDays.filter((item) => item !== day)
            setState({...state, timeTable: {...timeTable, [day]: {...timeTable[day], day: day, is_close: true}}, selectedDays: newList })
        }
        else {
            setState({ ...state, timeTable: {...timeTable, [day]: {...timeTable[day], day: day, is_close: false}}, selectedDays: [...selectedDays, day] })
        }
    }

    const handleUpdateTime = (day, value, openTime) => {
        const dayy = day.slice(0, 2)
        const data = {
            [dayy]: {
                day: dayy,
                start: openTime ? value : timeTable[dayy]?.start || '',
                end: openTime ? timeTable[dayy]?.end || '' : value,
                is_close: !selectedDays?.includes(dayy)
            }
        }
        setState({ ...state, timeTable: { ...timeTable, [dayy]: data[dayy] } })
    }
    const handleSubmit = () => {
        setState({...state, loading: true})
        const payload = {
            location_id: `${locationId}`,
            times: Object.values(timeTable)
        }
        dispatch(updateLocationTime(payload)).unwrap().then((res) => {
            if (res?.success) {
                toast.success(res?.message)
            }
            setState({...state, loading: false})
            handleModal()
        })
    }

    return (
        <>
            <AddEditModal
                type=' ' name='Opening Hours'
                show={show} closeModal={handleModal}
                onSubmit={handleSubmit}
            >
                <Col>
                    <div className='C-dark' >
                        <table className='w-100 time-table'>
                            <thead className='border-bottom'>
                                <th>Days</th>
                                <th>Open</th>
                                <th>Close</th>
                                <th className='text-center'>Is Close?</th>
                            </thead>

                            <tbody>
                                {days?.map((day) => {
                                    const shortDay = day?.slice(0, 2)

                                    return <tr className='mt-2'>
                                        <td className='py-2'>{day}</td>
                                        {selectedDays?.includes(day?.slice(0, 2))
                                            ?
                                            <>
                                                <td>
                                                    <input style={{ padding: 0 }} type={'time'} value={timeTable[shortDay]?.start} onChange={(e) => handleUpdateTime(day, e.target.value, true)} />
                                                </td>
                                                <td>
                                                    <input style={{ padding: 0 }} type={'time'} value={timeTable[shortDay]?.end} onChange={(e) => handleUpdateTime(day, e.target.value, false)} />
                                                </td>
                                            </>
                                            :
                                            <>
                                                <td></td>
                                                <td style={{paddingLeft: '0.4rem'}}>Closed</td>
                                            </>
                                        }
                                        <td>
                                            <input type='checkbox' className='regular-checkbox ms-1'
                                                name='users'
                                                onClick={(e) => handleCheck(e, shortDay)}
                                                checked={!selectedDays.includes(shortDay)}
                                            />
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        {loading &&
                                    <div style={{ zIndex: 1, opacity: 0.8, position: 'absolute', top: 0, left: 0 }} className='w-100 h-100 center Bg-fff'>
                                        <Spinner animation='border' />
                                    </div>
                                }
                    </div>
                </Col>
            </AddEditModal>
        </>
    )
}

export default TimingModal