import { FormControl, Form } from 'react-bootstrap';

const TextInput = (props) => {
  let { /*placeholder, name, onChange, defaultValue, disabled, style, value, type, autoFocus,*/
    lable, as, isTextArea, id, classes,disabled, validationText, validationTextClass, lableClass, EyeComponent, noShadow } = props
  return (
    <Form.Group autoComplete="off"
    controlId={id || "formGridLocation"} as={as}>
      <Form.Label className={`bold lable C-dark mt-1 ${lableClass}`} style={{ display: lable ? '' : 'none' }}>{lable}</Form.Label>
      <FormControl
        //  name={name} type={type} style={style} value={value} disabled={disabled} placeholder={placeholder} defaultValue={defaultValue} autoFocus={autoFocus} onChange={onChange} 
        {...props}
        disabled={disabled}
        as={isTextArea}
        className={`${noShadow ? '' : 'Shadow'} dropDown ${classes}`}
        variant='light'
        aria-autocomplete='off'
        autoComplete={'off'}
      />
      {EyeComponent}
      <Form.Text className={`text-danger ${validationTextClass}`} style={{ fontSize: '12px' }}>{validationText}</Form.Text>
    </Form.Group>
  )
}
export default TextInput;