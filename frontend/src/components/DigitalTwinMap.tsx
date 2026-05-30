import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Hotspot {
  id: number;
  lat: number;
  lng: number;
  name: string;
  risk_score: number;
  status: string;
  severity: string;
}

interface Props {
  hotspots: Hotspot[];
}

const DigitalTwinMap: React.FC<Props> = ({ hotspots }) => {
  const hyderabadCenter: [number, number] = [17.3850, 78.4867];

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <MapContainer center={hyderabadCenter} zoom={12} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {hotspots.map((spot) => (
          <React.Fragment key={spot.id}>
            <Marker position={[spot.lat, spot.lng]}>
              <Popup>
                <div className="text-slate-900">
                  <h3 className="font-bold">{spot.name}</h3>
                  <p>Risk: {(spot.risk_score * 100).toFixed(0)}%</p>
                  <p>Status: <span className="capitalize">{spot.status}</span></p>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={[spot.lat, spot.lng]} 
              radius={500} 
              pathOptions={{ 
                color: spot.status === 'active' ? '#ef4444' : '#f59e0b',
                fillColor: spot.status === 'active' ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.2
              }} 
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default DigitalTwinMap;
