// src/components/AnimalsMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import animalsData from '../data/data.json';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapController = () => {
  const map = useMap();
  const bounds = L.latLngBounds(animalsData.map(animal => animal.coordinates));
  map.fitBounds(bounds.pad(0.1));
  return null;
};

const AnimalsMap = () => {
  return (
    <div style={{ height: '500px', width: '100%', margin: '20px 0' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Animal Locations</h2>
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {animalsData.map((animal, index) => (
          <Marker key={index} position={animal.coordinates}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <h3>{animal.animal}</h3>
                <p>Species: {animal.species}</p>
                <p>Location: {animal.location}</p>
                <p>Population Estimate: {animal.quantity}</p>
                {animal.quantity < 100 && 
                  <strong style={{ color: 'red' }}>Endangered Species!</strong>}
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapController />
      </MapContainer>
      <br/>
    </div>
  );
};

export default AnimalsMap;