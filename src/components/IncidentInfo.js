import moment from 'moment'
import { connect } from 'react-redux';
import { Form } from "react-bootstrap";
import _ from 'lodash'

const IncidentInfo = (props) => {

    const { incidentName, formElements, formValues } = props

    const Field = (props) => {
        const { formElements, formValues, classes = 'border-top' } = props;
        return (
            <div>
                {formElements &&
                    formElements?.map((element, index) => {

                        let value = _.find(formValues, { form_element_id: element?.id.toString() })?.value || null
                        if (value) {
                            return (
                                <div>
                                    <div className={` p-1 d-flex flex-column justify-content-center ${classes} ${!index && 'border-none'}`} style={{ minHeight: '30px' }}>
                                        <p className='lable C-dark F-16'>{element.label} </p>
                                        {
                                            element.type === 'date' ?
                                                <p className='ps-1 F-14 C-818188'>{moment(value).format('MM/DD/YYYY')}</p>
                                                : element.type === 'textarea' ?
                                                    <span className='ps-1 F-14 C-818188'>{value}</span>
                                                    : <span className='text-capitalize ps-1 F-14 C-818188'>{value}</span>
                                        }
                                    </div>

                                    <div>
                                        {!_.isEmpty(element.elements) && value === 'yes' && (element.type === 'radio')
                                            ? <Field formElements={element.elements} formValues={formValues} classes='ms-3' />
                                            : null}
                                    </div>
                                </div>
                            )
                        }
                        else
                            return null
                    })}
            </div>
        )
    }

    return (
        <Form>
            <div className='border-bottom'>
                <p className='lable C-dark F-16'>Incident Name *</p>
                <span className='ps-1 F-14 C-818188'>{incidentName}</span>
            </div>
            <Field formElements={formElements} formValues={formValues} />
        </Form>
    )
}


export default IncidentInfo;