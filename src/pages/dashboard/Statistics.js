import { Link } from "react-router-dom";

const Statistics = (props) => {
  let { name, value, color, to } = props;
  return (
    <Link to={to} className="linkText C-dark">
      <div className='d-flex align-items-center'>
        <div className='me-2'
          style={{ borderRadius: '8px', backgroundColor: color, minHeight: '12px', minWidth: '12px' }} />
        <p className='text-wrap'>{name}</p>
      </div>
      <p className='ms-3 mt-1 h6 bold'>{value}</p>
    </Link>
  )
}
export default Statistics;