import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Hotspot } from '../types';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 20px; height: 20px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 12px ${color}, 0 0 24px ${color}40;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });
};

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const riskColors: Record<string, string> = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#22c55e',
};

function getRiskColor(riskScore: number): string {
  if (riskScore >= 0.7) return riskColors.high;
  if (riskScore >= 0.4) return riskColors.medium;
  return riskColors.low;
}

function getRiskLabel(riskScore: number): string {
  if (riskScore >= 0.7) return 'High Risk';
  if (riskScore >= 0.4) return 'Medium Risk';
  return 'Low Risk';
}

interface Props {
  hotspots: Hotspot[];
  selectedSpot?: Hotspot | null;
  onSpotClick?: (spot: Hotspot) => void;
}

const DigitalTwinMap: React.FC<Props> = ({ hotspots, selectedSpot, onSpotClick }) => {
  const hyderabadCenter: [number, number] = [17.3850, 78.4867];

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={hyderabadCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {hotspots.map((spot) => {
          const color = getRiskColor(spot.risk_score);
          const isSelected = selectedSpot?.id === spot.id;
          return (
            <React.Fragment key={spot.id}>
              <Marker
                position={[spot.lat, spot.lng]}
                icon={createIcon(color)}
                eventHandlers={{
                  click: () => onSpotClick && onSpotClick(spot),
                }}
              >
                <Popup>
                  <div className="p-2 font-sans">
                    <h3 className="font-bold text-sm uppercase tracking-tight border-b border-slate-200 pb-1 mb-2">
                      {spot.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      Risk: <span style={{ color }}>{getRiskLabel(spot.risk_score)}</span>
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      Garbage: <span className="text-emerald-600">{spot.garbage_percentage}%</span>
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      Status: <span className="capitalize">{spot.status}</span>
                    </p>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[spot.lat, spot.lng]}
                radius={isSelected ? 600 : 400}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.35 : 0.2,
                  weight: isSelected ? 3 : 2,
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 z-[1000] glass-card p-4 space-y-3">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Risk Legend</p>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Low Risk</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316]" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Medium Risk</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">High Risk</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinMap;
