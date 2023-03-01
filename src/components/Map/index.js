
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

const Map = ({ location }) => {
  const defaultProps = {
    center: {
      lat: location.lat || 26.0983,
      lng: location.lng || 76.150
    },
    zoom: 11
  };

  return (
    <div className='mt-2 Shadow rounded w-100 h-100' >
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <Marker
          lat={defaultProps.center.lat}
          lng={defaultProps.center.lng}
          text={location.name}
        />
      </GoogleMapReact>
    </div>
  )
}

export default Map;