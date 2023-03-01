import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { isUserAuthenticated } from "../helpers";
import logo from '@images/logo.png'
import AddressBar from "./Layout/AddressBar";
import { getPageContent } from "@/services";

const Pages = (props) => {
    const dispatch = useDispatch()
    const [data, setData] = useState({});
    const location = useLocation()
    const params = useParams()
    // const params = useParams();
    const navigate = useNavigate();
    const slug = params.slug

    useEffect(() => {

        if (slug) {
            dispatch(getPageContent(slug)).unwrap().then(res => {
                if (res?.success)
                    setData(res?.data);
                else navigate('/', { replace: true })
            })
        }
        // else navigate('/', { replace: true })

    }, [slug])

    return (
        <div className="center flex-column bg-light">
            {
                !isUserAuthenticated() ? (
                    <div className="d-flex justify-content-start col-12 Bg-fff">
                        <div className="p-3">
                            <Link to={'/'}>
                                <img alt="logo" src={logo} className="w-50" />
                            </Link>
                        </div>
                    </div>
                )
                    : <div className="w-100">
                        <AddressBar page={[{ name: data?.name || '' }]} />
                    </div>
            }

            <div className="center">
                {data?.content
                    ? <div dangerouslySetInnerHTML={{ __html: data?.content }} className='page-container pb-5 Bg-fff p-2 px-md-4 px-3' />
                    : <div className="center"style={{height: '75vh'}}>
                        <Spinner animation='border' size='lg' style={{ height: '55px', width: "55px" }} />
                    </div>
                }
            </div>
        </div>
    )
}

export default Pages;