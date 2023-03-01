import { DeleteModal, FilterForm, PaginationComponent } from '@/components'
import { DropDown, EmptyComponent, ReactDatePicker } from '@/components/common'
import CourseItem from '@/pages/Courses/CourseComponent/CourseItem'
import { deleteCourse, getCourseList, getCredentialTypesList, getStateList } from '@/services'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import _ from 'lodash'
import { Col, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import CourseForm from '@/pages/Courses/CourseForm'
import { toast } from 'react-toastify'

const Course = (props) => {
    const { data } = props
    const dispatch = useDispatch()

    const reducerData = useSelector((state) => {
        return {
            credentialTypes: state.credential.credentialTypes,
            parentCategories: state.equipment.parentCategories,
            stateList: state.course.stateList,
            coursesList: state.course.courseList,
            apiLoading: state.equipment.loading,
        }
    })
    const { credentialTypes, stateList, coursesList } = reducerData;

    const [state, setState] = useState({})
    const { addModal, toolTip, courseInfo, tab = 1, loading, onFilter, type, isClearable,
        limit = 10, activePage = 1, deleteModal, isSubmitting, status, totalItems
    } = state

    const [courseDate, setCourseDate] = useState([null, null]);
    const [course_start, course_end] = courseDate;

    useEffect(() => {
        callCourseList()
    }, [onFilter])


    useEffect(() => {
        dispatch(getCredentialTypesList())
        dispatch(getStateList({ slug: 'course' }))
    }, [])

    const callCourseList = () => {
        let payload = {
            user_id: data?.id,
            credential_type_id: `${type?.id || ''}`,
            // duration: tab === 1 ? 'upcoming' : tab === 2 ? 'past' : '',
            start_date: course_start,
            end_date: course_end,
            state_id: status?.id,
            limit: limit || 10,
            offset: limit * (activePage - 1) || 0,
        }
        setState({ ...state, loading: true })
        dispatch(getCourseList(payload)).unwrap().then((res) => {
            if (res.success) {
                setState({ ...state, loading: false, addModal: false, totalItems: res?.total, toolTip: undefined })
            }
        })
    }

    const MessageComponent = () => {
        return <>
            <span className='text-center itemText C-dark'>Are you sure you want to remove this course</span>
        </>
    }

    const handleAddModel = () => {
        setState({ ...state, addModal: true, courseInfo: {} })
    }

    const handleFilter = (name, value) => {
        setState({ ...state, [name]: value })
    }


    const handlePageChange = (page) => {
        setState({ ...state, activePage: page, onFilter: !onFilter })
    }

    const handleEdit = (item) => {
        setState({ ...state, addModal: true, toolTip: false, courseInfo: item })
    }
    const handleDelete = (item) => {
        setState({ ...state, deleteModal: true, toolTip: false, courseInfo: item })
    }

    const deleteCourseItem = () => {
        setState({ ...state, isSubmitting: true })
        dispatch(deleteCourse({ id: courseInfo?.id })).unwrap().then((res) => {
            if (res?.success) {
                setState({ ...state, isSubmitting: false, deleteModal: false, onFilter: !onFilter })
                toast.success(res?.message)
            } else
                setState({ ...state, isSubmitting: false })
        })
    }

    return (
        <>
            <FilterForm
                name={'Course'}
                isClearable={isClearable}
                onClearFilter={() => {
                    setCourseDate([null, null])
                    setState({ ...state, isClearable: false, type: '', status: '', onFilter: !onFilter })
                }}
                onFilterClick={() => setState({ ...state, onFilter: !onFilter, isClearable: true })}
            >
                <Col className='mt-2'>
                    <DropDown
                        placeholder="Course Type"
                        data={credentialTypes}
                        value={type?.name}
                        onChange={(e) => handleFilter('type', JSON.parse(e.target.id))} />
                </Col>
                <Col className='mt-2 pe-0'>
                    <ReactDatePicker
                        selectsRange
                        placeholderText="Date Range"
                        startDate={course_start}
                        endDate={course_end}
                        classes='Shadow text-dark'
                        onChange={(update) => { setCourseDate(update) }}
                    />
                </Col>
                <Col className='mt-2'>
                    <DropDown
                        placeholder="Status"
                        data={stateList}
                        value={status?.name}
                        onChange={(e) => handleFilter('status', JSON.parse(e.target.id))}
                    />
                </Col>
            </FilterForm>

            {loading
                ? <div className='d-flex center flex-grow-1'>
                    <Spinner animation='border' className='d-flex align-self-center' />
                </div>
                : _.isEmpty(coursesList)
                    ? <EmptyComponent title="Courses" />
                    :
                    <>
                        {coursesList?.map((item) => {
                            return <CourseItem data={item} handleEdit={() => handleEdit(item)} handleDelete={() => handleDelete(item)} toolTip={toolTip} peopleDetail />
                        })
                        }

                        {totalItems > 10 &&
                            <PaginationComponent
                                activePage={activePage}
                                limit={limit}
                                isLimit
                                totalItemsCount={totalItems}
                                handlePageChange={(page) => handlePageChange(page)}
                                handleChange={(e, value) => setState({ [e.target.name]: value, activePage: 1 })} />
                        }
                    </>
            }

            {addModal &&
                <CourseForm
                    callList={callCourseList}
                    show={addModal}
                    closeModal={() => setState({ ...state, addModal: false, toolTip: undefined })}
                    courseInfo={courseInfo} />
            }
            {deleteModal &&
                <DeleteModal
                    name='Course'
                    isSubmitting={isSubmitting}
                    messageComponent={<MessageComponent />}
                    show={deleteModal}
                    closeModal={() => setState({ ...state, deleteModal: false, toolTip: undefined })}
                    onClickDelete={deleteCourseItem} />
            }
        </>
    )
}

export default Course