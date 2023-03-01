import { Button } from 'react-bootstrap'
const Pressable = (props) => {
   let { onPress, title, titleStyle, classes, children } = props;
   return (
      <Button
         {...props}
         className={classes ? `pressable ${classes}` : `pressable`}
         onClick={onPress}
      >
         {title && <span style={{ fontSize: '14px', ...titleStyle }}>{title}</span>}
         {children}
      </Button >
   )
}
export default Pressable;