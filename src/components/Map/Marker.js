import React, { Component } from 'react';
// import { greatPlaceStyle } from './my_great_place_styles.js';
import './style.css';

export default class Marker extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  static defaultProps = {};

  render() {
    return (
      <div className='marker'>
        {/* {'o' || this.props.text}{/* need to update icon here */}
      </div>

    );
  }
}