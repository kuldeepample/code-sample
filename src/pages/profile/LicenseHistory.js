import { Container } from "@/components/common";
import AddressBar from "@/components/Layout/AddressBar";
import { Col, Spinner, Table } from "react-bootstrap";
import licenseIcon from '@images/licenseIcon.png'
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useState } from "react";
import _ from 'lodash'
import { isNotUser } from "@/helpers";
import { Link } from "react-router-dom";
import { MdOutlineInfo } from 'react-icons/md'
import { AddEditModal } from "@/components";
import { getLicenseHistory } from "@/services";

const LicenseHistory = (props) => {
    const dispatch = useDispatch()
    const [states, setStates] = useState({})
    const licenseHistory = useSelector((state) =>  state?.dashboard?.licenseHistory?.accountLicenses)
    // const { licenseHistory } = props;
    const { modal, activeItem = {} } = states
    const { account, license = {} } = activeItem
    const { license_type, activation, expiration, trial, status } = license
    useEffect(() => {
        dispatch(getLicenseHistory())
    }, [])
    const toggleModal = (item) => {
        setStates({ modal: item?.id ? true : false, activeItem: item?.id ? item : {} })
    }

    if (!isNotUser())
        return (
            <div style={{ height: window.innerHeight - 110 }} className='center'>
                <span className="C-dark F-20">You are not authorized to view this page.</span>
            </div>
        )

    if (_.isEmpty(licenseHistory))
        return (
            <div style={{ height: window.innerHeight - 110 }} className='center'>
                <Spinner animation="border" style={{ height: '55px', width: '55px' }} />
            </div>
        )
    else
        return (
            <div className=''>
                <AddressBar
                    page={[{ name: 'Dashboard', link: '/dashboard' }, { name: 'License History' }]}
                    right={<Link to="/dashboard/license-info" className="linkText C-primary me-3">Info</Link>}
                />
                <div className="overflow-auto">

                    <Table>
                        <tr style={{ height: "45px" }} className="history-table-row"                        >
                            <td>License Type</td>
                            <td>Activation</td>
                            <td>Expiration</td>
                            <td>State</td>
                            <td>Status</td>
                            <td>View</td>
                        </tr>
                        {licenseHistory?.map((item, index) => {
                            return (
                                <tr key={index}
                                    style={{ height: "40px" }}
                                    className="d-table-row border-top border-1 border-0 Bg-fff C-dark fw-light history-table-row"
                                >
                                    <td>{item?.license?.license_type?.name}</td>
                                    <td>{moment(item?.license?.activation).format("MM/DD/Y")}</td>
                                    <td>{moment(item?.license?.expiration).format("MM/DD/Y")}</td>
                                    <td>{item?.status}</td>
                                    <td>{item?.license?.status}</td>
                                    <td><MdOutlineInfo size={35} style={{ cursor: 'pointer' }} color='#c60970' onClick={() => toggleModal(item)} /></td>
                                </tr>
                            )
                        })
                        }
                    </Table>
                </div>

                <AddEditModal
                    size='md'
                    name='License Info'
                    show={modal}
                    scrollable
                    closeModal={() => { toggleModal() }}
                >
                    <Container classes='w-100 F-16 align-items-center Shadow'>
                        <Col xs={'auto'}>
                            <img src={licenseIcon} alt='icon' className='licenseIcon' />
                        </Col>
                        <Col>
                            <span className="C-primary text-truncate">{account?.name}</span>
                        </Col>
                        <div className="p-0 pt-2">
                            <div className="bg-light licenseinfoItem F-16">
                                <td className="C-dark licenseinfoItemName">Organization:</td>
                                <td className="C-818188 fw-lighter">{account?.name}</td>
                            </div>
                            <div className="licenseinfoItem F-16">
                                <td className="C-dark licenseinfoItemName">License Type:</td>
                                <td className="C-818188 fw-lighter">{license_type?.name}</td>
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
                    </Container>
                </AddEditModal>
            </div>
        )
}

export default LicenseHistory;