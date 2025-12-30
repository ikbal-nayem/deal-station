
'use client';

import * as React from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import type { Offer } from '@/lib/types';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  offers: Offer[];
  onMarkerClick: (offer: Offer) => void;
  center?: { lat: number; lng: number };
  selectedOfferId?: string;
}

export default function MapView({ offers, onMarkerClick, center, selectedOfferId }: MapViewProps) {
  const [viewState, setViewState] = React.useState({
    longitude: center?.lng ?? -122.4194,
    latitude: center?.lat ?? 37.7749,
    zoom: 12
  });

  React.useEffect(() => {
    if (center) {
      setViewState(current => ({
        ...current,
        longitude: center.lng,
        latitude: center.lat,
      }));
    }
  }, [center]);

  const [popupInfo, setPopupInfo] = React.useState<Offer | null>(null);

  const markers = React.useMemo(() => offers.map(offer => (
      <Marker
          key={offer.id}
          longitude={offer.longitude}
          latitude={offer.latitude}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onMarkerClick(offer);
            setPopupInfo(offer);
          }}
        >
          <MapPin
            className="cursor-pointer text-primary"
            fill={selectedOfferId === offer.id ? 'hsl(var(--primary))' : 'white'}
            size={30}
          />
        </Marker>
  )), [offers, onMarkerClick, selectedOfferId]);

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://demotiles.maplibre.org/style.json"
    >
      {markers}

      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
          offset={30}
        >
          <div>
            <h3 className="font-bold">{popupInfo.title}</h3>
            <p className="text-sm">{popupInfo.companyName}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
