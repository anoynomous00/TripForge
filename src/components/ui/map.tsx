'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 20.5937, // Center of India (or change to your default)
  lng: 78.9629,
};

const MyMap = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyA2PAM4vQSHRVn5fr8Jhfmlp03MQsAGmws">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
        {/* Optional: Marker for your tour office */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMap;
