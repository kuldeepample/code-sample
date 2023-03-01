const LineItem = (props) => {
   let { heading, value, classes, valueColor } = props
   return (
      <div className={`d-flex flex-row ${classes}`}>
         <p className='profile-key'>{heading}: </p>
         <p className={`profile-value collapseble`} style = {{ color: valueColor}}>&nbsp;{value}</p>
      </div>
   )
}
export default LineItem;