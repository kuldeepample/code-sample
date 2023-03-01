import { useEffect, useState } from "react";
import { Row, Col, Pagination } from "react-bootstrap";
import { DropDown } from "./common";

const PaginationComponent = (props) => {
    const { activePage = 1, limit, totalItemsCount, handlePageChange, handleChange, isLimit, classes,
        limitData = [10, 20, 30] } = props
    const [isMobile, setIsMobile] = useState(window.innerWidth > 950 ? true : false);

    useEffect(() => {
        const onResize = () => {
            setIsMobile(window.innerWidth > 950 ? true : false);
        }

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);

    let items = [];
    let totalPage = Math.ceil(totalItemsCount / +limit)
    let showPage = activePage <= 2 ? 5 : activePage + 2;
    let pageNumber = totalPage < 5 ? 1 : activePage > 3 ? totalPage - activePage === 0 ? activePage - 4 : activePage - 2 : 1
    for (pageNumber; (pageNumber <= showPage && pageNumber <= totalPage); pageNumber++) {
        let active = pageNumber === activePage;

        items.push(
            <Pagination.Item key={pageNumber} active={active}
                className={active ? 'active-page' : 'inactive-page'}
                onClick={(e) => active ? '' : handlePageChange(+e.target.text)}>

                {pageNumber}
            </Pagination.Item>,
        );
    }

    return (
        <Row className={`m-0 text-wrap justify-content-between ${classes ||  'mt-3' }`}>
            <Col xs={12} sm={7} className='text-wrap px-0'>
                <Pagination className="mt-2">
                    {isMobile ?
                        <>
                            <Pagination.Item onClick={() => handlePageChange(1)}>First</Pagination.Item>
                            <Pagination.Item onClick={() => activePage === 1 ? '' : handlePageChange(activePage - 1)} >Previous</Pagination.Item>
                        </>
                        :
                        <>
                            <Pagination.First onClick={() => handlePageChange(1)} />
                            <Pagination.Prev onClick={() => handlePageChange(activePage - 1)} />
                        </>
                    }
                    {items}
                    {isMobile ?
                        <>
                            <Pagination.Item onClick={() => activePage === totalPage ? '' : handlePageChange(activePage + 1)}>Next</Pagination.Item>
                            <Pagination.Item onClick={() => handlePageChange(totalPage)}>Last</Pagination.Item>
                        </>
                        :
                        <>
                            <Pagination.Next onClick={() => handlePageChange(activePage + 1)} />
                            <Pagination.Last onClick={() => handlePageChange(totalPage)} />
                        </>
                    }
                </Pagination>

            </Col>
            {(isLimit) &&
                <Col xs={12} sm={5} className={`d-flex flex-row justify-content-sm-end px-0`}>
                    <div className='d-flex flex-row center'>
                        <p className='sort'>Limit</p>
                        <DropDown
                            value={limit} name='limit' placeholder='Limit'
                            mainViewClass='d-flex'
                            emptySelect={false}
                            onChange={(e) => handleChange(e, e.target.text)}
                            data={limitData}
                        />
                        <p className='ps-2 sort d-none d-lg-block'>Items per page</p>
                    </div>
                </Col>
            }
        </Row>
    )
}
export default PaginationComponent;