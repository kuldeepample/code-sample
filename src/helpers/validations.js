import { isEmail } from "validator";
import { isValidMobile } from ".";

export const required = value => {
  if (!value) {
    return (
      <div className="validation-alert" role="alert">
        <p style={{ color: '#f00', fontSize: '13px' }}>This field is required!</p>
      </div>
    );
  }
};

export const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="validation-alert" role="alert">
        <p style={{ color: '#f00', fontSize: '13px' }}>Invalid email.</p>
      </div>
    );
  }
};

export const mobile = value => {
  if (!isValidMobile(value)) {
    return (
      <div className="validation-alert" role="alert">
        <p style={{ color: '#f00', fontSize: '13px' }}>Invalid phone number.</p>
      </div>
    );
  }
};

export const password = value => {
  if (value.length < 8 || value.length > 20) {
    return (
      <div className="validation-alert" role="alert">
        <p style={{ color: '#f00', fontSize: '13px' }}>The password must have 8 - 20 characters.</p>
      </div>
    );
  }
};

export const confirmPassword = (value, props, components) => {
  // NOTE: Tricky place. The 'value' argument is always current component's value.
  // So in case we're 'changing' let's say 'password' component - we'll compare it's value with 'confirm' value.
  // But if we're changing 'confirm' component - the condition will always be true
  // If we need to always compare own values - replace 'value' with components.password[0].value and make some magic with error rendering.

  if (components['password'][0].value !== components['cpassword'][0].value) { // value !== components['cpassword'][0].value
    // 'confirm' - name of input
    // components['confirm'] - array of same-name components because of checkboxes and radios
    // return <span className="error">Passwords are not equal.</span>
    return (
      <div className="validation-alert" role="alert">
        <p style={{ color: '#f00', fontSize: '13px' }}>Passwords does not match.</p>
      </div>
    );
  }
};