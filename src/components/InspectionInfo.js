import { Row, Col, Image, Spinner } from 'react-bootstrap';
import { getExpirationDate } from '@/helpers';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getInspectionDetail } from '@/services';
import { useState } from 'react';
import { Magnifier, MOUSE_ACTIVATION, TOUCH_ACTIVATION } from 'react-image-magnifiers';

const InspectionInfo = (props) => {
    const dispatch = useDispatch()
    let { correct_location, comment, correct_detail, medication, inspection_id } = props

    const [state, setState] = useState({})
    const { inspection_image, loading, imgFetching} = state
    useEffect(() => {
        setState({...state, loading: true })
        dispatch(getInspectionDetail({ id: inspection_id })).unwrap().then((res) => {
            if (res?.success) {
                setState({ ...state, inspection_image: res?.data?.equipment_image?.image, loading: false, imgFetching: true })
            } else {
                setState({...state, loading: false})
            }
        })
    }, [])

    return (
        <div style={{ position: 'relative'}}>
            {medication ?
                <>
                    <div className='border-bottom ps-3 pe-5 align-items-center d-flex flex-row justify-content-between' style={{ minHeight: '50px' }}>
                        <p className='lable C-6e6e6e ps-1'>Is Medication in correct location ?</p>
                        <p className='C-6e6e6e'>{correct_location ? "Yes" : "No"}</p>
                    </div>
                    <div className='border-bottom ps-3 pe-5 align-items-center d-flex flex-row justify-content-between' style={{ minHeight: '50px' }}>
                        <p className='lable C-6e6e6e ps-1'>Are the medication details correct ?</p>
                        <p className='C-6e6e6e'>{correct_detail ? "Yes" : "No"}</p>
                    </div>

                </>
                :
                <EquipmentInfo data={props} />
            }
            {comment &&
                <div className='border-top ps-3 pe-2 pt-1 align-items-cener d-flex ' style={{ minHeight: '40px', maxHeight: '150px' }}>
                    <span className='lable C-6e6e6e ps-1'>Comment: </span>
                    <span style={{ whiteSpace: 'break-spaces' }} className='F-12 C-818188 ps-1 Content d-flex w-100 pt-1'>{comment}</span>
                </div>
            }
            {inspection_image &&
                <div>
                    <span className='itemText C-primary ps-3'>Image: </span>
                    <div className='center mt-2 imgBox' style={{ width: inspection_image ? 'fit-content' : '300px', position: 'relative'}}>
                        {/* <img className='mt-2' src={snImg} style={{ width: '100%', height: '13rem', objectFit: 'contain'}}/> */}
                        {
                           // <Image className='imgInfo' src={locationImg}/>
                           <>
                              <Magnifier
                                 className='imgInfo'
                                 imageSrc={inspection_image}
                                 imageAlt=""
                                 dragToMove={true}
                                 mouseActivation={MOUSE_ACTIVATION.CLICK}
                                 touchActivation={TOUCH_ACTIVATION.TAP}
                                 onImageLoad={() => setState({...state, imgFetching: false})}
                              />{
                                 imgFetching &&
                                 <Row className="center  Bg-fff w-100 h-100 p-0" style={{ zIndex: 1, position: 'absolute', top: '0px', opacity: 0.8 }}>
                                    <Spinner animation="border" />
                                 </Row>
                              }
                           </>
                        }
                     </div>
                </div>
            }
            {loading &&
                <div style={{ zIndex: 1, opacity: 0.8, position: 'absolute', top: 0 }} className='w-100 h-100 center Bg-fff'>
                    <Spinner animation='border' />
                </div>
            }
        </div>
    )
}
export default InspectionInfo;


const EquipmentInfo = (props) => {
    const { correct_location, readiness_indicator, accessories, readinessImage, isService, inspection_at, } = props.data;
    let date = moment(inspection_at).format('MM/DD/YYYY')
    const getAccessoryColorByStatus = (status) => {
        if (status === 'expiring') return 'yellow'
        if (status === 'expired') return 'red'
    }

    return (
        <>
            <div className='border-bottom ps-3 pe-5 align-items-center d-flex flex-row justify-content-between' style={{ minHeight: '50px' }}>
                <p className='lable C-6e6e6e ps-1'>Is equipment in correct location ?</p>
                <p className='C-6e6e6e'>{correct_location ? "Yes" : "No"}</p>
            </div>
            {!isService ?
                <div className='border-bottom ps-3 pe-5 align-items-center d-flex flex-row justify-content-between' style={{ minHeight: '50px' }}>
                    <div className='d-flex flex-column' >
                        <span className='lable ps-1 C-6e6e6e'>Readiness indicator OK ?</span>
                        <Image src={readinessImage} alt='readiness image not available' className='readiness-image-big  F-10 C-818188 ps-2' />
                    </div>
                    <p className='C-6e6e6e'>{readiness_indicator ? "Yes" : "No"}</p>
                </div>
                :
                <div className='border-bottom ps-3 pe-5 align-items-center d-flex flex-row justify-content-between' style={{ minHeight: '50px' }}>
                    <div className='d-flex flex-column' >
                        <span className='lable ps-1 C-6e6e6e'><p>Service date</p></span>
                    </div>
                    <p className='C-6e6e6e'> {date} </p>
                </div>
            }
            {accessories && accessories.map((item, id) => {
                return (
                    <Row key={id} className='p-2 m-0 d-flex align-items-start justify-content-between flex-row pe-5'>
                        <Col as={Row} lg={10} sm={10} xs={10} className='m-0 d-flex flex-row'>
                            <Col lg={1} xs={2} className='d-flex p-0 align-items-center'>
                                <Image src={item?.accessory?.equipment_model_accessory?.accessory_type?.icon} alt='Icon' className={`accessory-${getAccessoryColorByStatus(item.status)}`} style={{ maxWidth: '30px', maxHeight: '30px' }} />
                                {/* <Image src={getAccessoryImage(item?.accessory?.equipment_model_accessory?.accessory_type?.slug, item?.installed ? item?.accessory?.expiration : moment().subtract(4, 'days'))} alt='' style={{ maxWidth: '30px', maxHeight: '30px' }} /> */}
                                {/* <Image src={getInspectionAccessoryImage(item?.accessory?.equipment_model_accessory?.accessory_type?.slug, item?.accessory?.expiration)} alt='' style={{ maxWidth: '30px', maxHeight: '30px' }} /> */}
                                <p className='lable C-818188 bold'>&nbsp; {item?.model?.name}</p>
                            </Col>
                            <Col lg={2} xs={10} className='d-flex align-items-center' >
                                <p className={`lable C-818188 bold text-capitalize ${item?.accessory?.status === 'active' ? 'C-success' : item?.accessory?.status.toLowerCase() === 'inactive' ? 'C-danger' : 'C-link'}`}>{item?.accessory?.status}</p>
                            </Col>
                            <Col lg={8} xs={10} className='d-flex align-items-center' >
                                <p className='lable C-818188 bold'>Expires: {getExpirationDate(item?.accessory?.expiration)}</p>
                            </Col>
                        </Col>
                        <Col as={Row} className='d-flex justify-content-end C-6e6e6e'>{item?.installed ? "Yes" : "No"}</Col>
                    </Row>
                )
            })}</>
    )
}