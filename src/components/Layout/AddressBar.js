import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HiOutlineChevronRight } from 'react-icons/hi'

const AddressBar = (props) => {
    let { page, right = null } = props;

    return (
        <div style={{ height: '44px', fontSize: '16px' }}
            className="d-flex flex-row align-items-center mt-2 mb-2 Bg-fff C-primary"
        >
            {page?.map((item, index) => {
                return (
                    item.link && (page.length - 1) > index ?
                        <>
                            <Link to={item?.link} className={`bold ms-2 C-primary linkText d-flex justify-content-start`}>
                                {item?.name}
                            </Link>
                            <p className='C-818188 ms-2 d-flex align-items-center'> <HiOutlineChevronRight size={20} /> </p>
                        </>
                        :
                        <Col as={Col} className='bold ms-2 C-primary linkText d-flex justify-content-start'>{item.name} </Col>
                )
            })
            }
            {right && right}
        </div>
    )
}
export default AddressBar;