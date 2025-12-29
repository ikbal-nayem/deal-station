'use client';

import * as React from 'react';
import type { Offer } from '@/lib/types';
import MapView from './MapView';

interface ClientMapViewProps {
  offers: Offer[];
  onMarkerClick: (offer: Offer) => void;
  center?: { lat: number; lng: number };
  selectedOfferId?: string;
}

function ClientMapView({ offers, onMarkerClick, center, selectedOfferId }: ClientMapViewProps) {
  const Map = React.useMemo(() => (
      <MapView
          offers={offers}
          onMarkerClick={onMarkerClick}
          center={center}
          selectedOfferId={selectedOfferId}
      />
  ), [offers, onMarkerClick, center, selectedOfferId]);

  return Map;
}

export default React.memo(ClientMapView);
