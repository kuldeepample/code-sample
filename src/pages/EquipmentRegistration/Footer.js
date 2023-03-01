import { Row, Spinner } from 'react-bootstrap';
import Pressable from '@common/Pressable';

const Footer = (props) => {
   let { active, goBack, goForward, isForwarding, isFinish } = props;
   let forwardButtonTitle = isFinish ? "Finish" : "Next"
   if (isForwarding)
      forwardButtonTitle = <Spinner animation='border' size='sm' />
   return (
      <Row className='Aed-reg-footer'>
         {active !== 1 &&
            <Pressable classes='arrow-btn Bg-primary center' onPress={goBack} title='Back' />
         }
         <Pressable
            classes='arrow-btn Bg-primary center'
            disabled={isForwarding}
            onPress={goForward}
            title={forwardButtonTitle}
         />
      </Row>
   )
}
export default Footer;