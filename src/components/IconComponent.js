import { MdOutlineReportGmailerrorred, MdOutlineCheckCircleOutline, MdOutlineWarningAmber } from 'react-icons/md'

const IconComponent = ({ data }) => {

    const getStyles = (value) => {
        return { width: '83px', minWidth: '43px', opacity: value === 0 ? 0.5 : 'inherit' };
    }

    return (
        <div className='d-flex w-100 text-nowrap' style={{ maxWidth: '250px', minWidth: '130px' }}>
            <div className='center C-success' style={getStyles(data?.info)}>
                <MdOutlineCheckCircleOutline className='status_icon' />
                <span className='m-1'>{data?.info}</span>
            </div>
            <div className='center C-warning' style={getStyles(data?.warning)}>
                <MdOutlineWarningAmber className='status_icon' />
                <span className='m-1'>{data?.warning}</span>
            </div>
            <div className='center C-danger' style={getStyles(data?.danger)}>
                <MdOutlineReportGmailerrorred className='status_icon' />
                <span className='m-1'>{data?.danger}</span>
            </div>
        </div>
    )
}
export default IconComponent;