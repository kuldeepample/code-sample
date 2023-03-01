import { Col, Image, Row } from 'react-bootstrap'
import { toast } from 'react-toastify';
import Footer from '../../Footer'
import { TextInput, ReactDatePicker } from '@components/common'

const LotNumber = (props) => {
    const { active, state, handleChange, goBack, goForward, id} = props;
    let { lot_number, aed, expiration, tags } = state

    const handleOnChange = (e) => {
        handleChange(e.target.name, e.target.value)
    }

    const handleForward = () => {
        if (lot_number) {
            if (expiration)
                goForward(id)
            else
                toast.warn("Please enter expiration date")
        } else
            toast.warn(`Please enter lot number!`)
    }

    return (
        <div className='h-100 d-flex flex-column justify-content-between pb-3'
            style={{ minHeight: window.innerHeight - 230 }}
        >
            <div>
                <div className='Bg-light C-primary bold ps-4 d-flex align-items-center'>Enter Lot Number</div>
                <Row className='d-flex flex-row justify-content-center p-3'>
                    <Col lg={3} md={4}>
                        <TextInput
                            name='lot_number'
                            classes={'C-primary bold mb-2'}
                            onChange={(e) => handleOnChange(e)}
                            value={lot_number}
                            placeholder={'Lot Number'}
                        />
                    </Col>
                    <Col lg={3} md={4}>
                        <ReactDatePicker
                            selected={expiration}
                            placeholderText='Expiration Date'
                            classes='Shadow C-primary'
                            onChange={(date) => handleChange('expiration', date)}
                        />
                    </Col>
                    <Col  lg={3} md={4}>
                        <TextInput
                        name='tags'
                        placeholder='Asset tag'
                        classes={'Shadow bold mb-2'}
                        onChange={(e) => handleOnChange(e)}
                        value={tags}
                        />
                    </Col>
                </Row>
                <div className='center align-items-start h-100 mb-3'>
                    <div className='border p-1 rounded' style={{ height: '310px', width: '320px' }}>
                        { aed?.image ?
                            <Image src={aed.image} alt='AED' className='magni img-fluid' />
                            :
                            <div className='center bg-light h-100 w-100'>
                                <p>Equipment image not available</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Footer active={active} goBack={() => goBack()} goForward={() => handleForward()} />
        </div>
    )
}


export default LotNumber;