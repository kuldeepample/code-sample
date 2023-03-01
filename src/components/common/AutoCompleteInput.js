import React, { Component } from 'react';
import TextInput from '@common/TextInput'
import { getAddress } from 'helpers';

class AutoCompleteInput extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      address: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this)
    this.autocomplete = null;
  }

  componentDidMount() {
    setTimeout(() => {
      const google = window.google;
      this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {})
      this.autocomplete.addListener("place_changed", this.handlePlaceSelect)
    }, 2000);
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace();
    const address = getAddress(addressObject);
    this.props.handleSelect(address);
  }

  handleChange = (e) => {
    this.setState({ address: e.target.value });
    this.props.onChange(e);
  }

  render() {
    return (
      <React.Fragment>
        <TextInput
          id="autocomplete"
          lable={this.props.lable}
          placeholder={this.props.placeholder}
          name={this.props.name}
          disabled={this.props.disabled}
          value={this.props.value || ''}
          onChange={this.handleChange}
          validationText={this.props.validationMessage['address'] ? `Address is required` : ''}
        />
      </React.Fragment>
    );
  }
}

export default AutoCompleteInput;