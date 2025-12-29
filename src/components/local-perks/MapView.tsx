'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import type { Offer } from '@/lib/types';

interface MapViewProps {
  offers: Offer[];
  onMarkerClick: (offer: Offer) => void;
  center?: { lat: number; lng: number };
  selectedOfferId?: string;
}

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapView({ offers, onMarkerClick, center, selectedOfferId }: MapViewProps) {
  const mapRef = React.useRef(null);
  
  const position: [number, number] = center ? [center.lat, center.lng] : [37.7749, -122.4194];

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {center && <ChangeView center={position} zoom={13} />}
      {offers.map((offer) => (
        <Marker
          key={offer.id}
          position={[offer.latitude, offer.longitude]}
          eventHandlers={{
            click: () => {
              onMarkerClick(offer);
            },
          }}
        >
          <Popup>{offer.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
