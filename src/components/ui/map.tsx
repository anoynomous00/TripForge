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
  // Note: For a real application, you would need to implement geocoding
  // to convert source and destination strings into lat/lng coordinates.
  // The Google Maps Geocoding API is suitable for this.
  // The markers below are for demonstration purposes.

  return (
    <LoadScript googleMapsApiKey="AIzaSyA2PAM4vQSHRVn5fr8Jhfmlp03MQsAGmws">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
        {/* Example marker, replace with dynamic markers based on geocoded source/destination */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMap;
