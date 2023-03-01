import { Row } from "react-bootstrap"

const Container = (props) => {
   return (
      <Row
         {...props}
         className={`m-0 Bg-fff rounded p-2 d-flex flex-row ${props.classes}`}
      >
         {props.children}
      </Row>
   )
}
export default Container;