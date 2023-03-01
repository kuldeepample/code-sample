import { Container, Pressable } from "@/components/common";
import AddressBar from "@/components/Layout/AddressBar";
import { Col, Row, Spinner } from "react-bootstrap";
import licenseIcon from '@images/licenseIcon.png'
import { connect, useDispatch } from "react-redux";
import moment from "moment";
import { useEffect, useState } from "react";
import _ from 'lodash'
import { isNotUser } from "@/helpers";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { createEnquiries, getLicenseDetail } from "@/services";
import './index.css'

const LicenseInfo = (props) => {
    const dispatch = useDispatch()
    const [state, setState] = useState(false)
    const { loading, licenseItems } = state
    const { licenseDetail } = props;
    let { equipmentCount, accountLicense, locationCount, userCount, } = licenseDetail
    let { license, account } = accountLicense || {}
    let { activation, expiration, license_type, status, trial } = license || {};

    useEffect(() => {
        setState({ ...state, loading: true })
        dispatch(getLicenseDetail()).unwrap().then((res) => {
            let licenseItems = res?.data?.accountLicense?.license?.license_type?.limits;
            licenseItems = _.orderBy(licenseItems, 'category.parent_id')
            setState({ ...state, loading: false, licenseItems })
        });
    }, [])

    const handleLicenseRequest = (isNew) => {
        let tokenData = JSON.parse(localStorage.getItem('token'))
        let payload = {
            account_id: tokenData?.account?.id,
            user_id: tokenData?.user?.id,
            module: 'license',
            type: isNew ? 'new' : 'renew',
        }
        setState({ ...state, loading: true })
        dispatch(createEnquiries(payload)).unwrap().then(res => {
            if (res?.success) {
                toast.success(res?.message);
            }
            else {
                toast.error(toast.message)
            }
            setState({ ...state, loading: false })
        });
    }

    if (!isNotUser())
        return (
            <div style={{ height: window.innerHeight - 110 }} className='center'>
                <span className="C-dark F-20">You are not authorized to view this page.</span>
            </div>
        )

    if (_.isEmpty(licenseDetail))
        return (
            <div style={{ height: window.innerHeight - 110 }} className='center'>
                <Spinner animation="border" style={{ height: '55px', width: '55px' }} />
            </div>
        )
    else
        return (
            <div className=''>
                <AddressBar
                    page={[{ name: 'Dashboard', link: '/dashboard' }, { name: 'License Info' }]}
                    right={<Link to="/dashboard/license-history" className="linkText C-primary me-3">History</Link>}
                />
                {license ?
                    <div className="h-100 w-100">
                        <Container classes='w-100 F-16 align-items-center Shadow'>
                            <Col xs={'auto'}>
                                <img src={licenseIcon} alt='icon' className='licenseIcon' />
                            </Col>
                            <Row as={Col} sm={2} xs={1}>
                                <Col>
                                    <span className="C-primary text-truncate">{account?.name}</span>
                                </Col>
                                <Col>
                                    <span className="C-dark">License Type:</span>
                                    <span className="C-818188"> {license_type?.name}</span>
                                </Col>
                            </Row>
                        </Container>
                        <Container classes='w-100 F-16 align-items-center Shadow mt-2 padding-none m-0'>
                            <div className="border-bottom border-2 licenseinfoItem">
                                <span className="C-primary center">License Information</span>
                            </div>
                            <div className="p-0">
                                <div className="licenseinfoItem F-16">
                                    <td className="C-dark licenseinfoItemName">Organization:</td>
                                    <td className="C-818188 fw-lighter">{account?.name}</td>
                                </div>
                                <div className="bg-light licenseinfoItem F-16">
                                    <td className="C-dark licenseinfoItemName">Activation Date:</td>
                                    <td className="C-818188 fw-lighter">{moment(activation).format('MM/DD/YYYY')}</td>
                                </div>
                                <div className="licenseinfoItem F-16">
                                    <td className="C-dark licenseinfoItemName">Expiration Date:</td>
                                    <td className="C-818188 fw-lighter">{moment(expiration).format('MM/DD/YYYY')}</td>
                                </div>
                                <div className="bg-light licenseinfoItem F-16">
                                    <td className="C-dark licenseinfoItemName">Trial Mode:</td>
                                    <td className="C-818188 fw-lighter">{trial ? 'Yes' : 'No'}</td>
                                </div>
                                <div className="licenseinfoItem F-16">
                                    <td className="C-dark licenseinfoItemName">Status:</td>
                                    <td className={`${status === 'active' ? 'C-success' : 'C-danger'} fw-lighter text-capitalize`}>{status}</td>
                                </div>
                            </div>
                            <div className="border-bottom border-top border-2 licenseinfoItem">
                                <span className="C-primary center">Uses Information</span>
                            </div>
                            {loading ?
                            <div className="center" style={{width: '100%', height: '200px'}}>
                                <Spinner animation="border" size="sm" />
                            </div>
                                :
                                <div className="p-0 d-lg-flex flex-wrap licenseItems">
                                    {licenseItems?.map((item) => {
                                        return <div className="licenseinfoItem F-16 col-lg-6">
                                            <td className="C-dark licenseinfoItemName text-capitalize">Total {item?.slug}: </td>
                                            <td className="C-818188 ps-2">{item?.count} of {item?.limit === -1 ? 'Unlimited' : item?.limit}</td>
                                        </div>
                                    })}
                                </div>
                            }
                            <div className="renueButtonArea border-top border-2">
                                <Pressable
                                    classes='add-btn'
                                    onPress={() => handleLicenseRequest(false)}
                                >{loading ?
                                    <Spinner animation="border" size="sm" />
                                    : 'Request to Renew'
                                    }
                                </Pressable>
                            </div>
                        </Container>
                    </div>
                    :
                    // <EmptyComponent title='License' />
                    <div style={{ height: window.innerHeight - 180 }} className='center flex-column'>
                        <span className="C-dark F-20">License Not Found!</span>
                        <div className="renueButtonArea border-2">
                            <Pressable
                                onPress={() => handleLicenseRequest(true)}
                                classes='add-btn'
                            >{loading ?
                                <Spinner animation="border" size="sm" />
                                : 'Request a new one'
                                }
                            </Pressable>
                        </div>
                    </div>
                }
            </div>
        )
}
const mapStateToProps = (state) => {
    return {
        licenseDetail: state?.dashboard.licenseDetail,
    }
}
const ActionCreators = {
    // getLicenseDetail: () => getLicenseDetail(),
    // createEnquiries: (data) => createEnquiries(data)
}
export default connect(mapStateToProps, ActionCreators)(LicenseInfo);