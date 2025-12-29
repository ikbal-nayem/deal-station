'use client';

import * as React from 'react';
import MapView from './MapView';
import type { Offer } from '@/lib/types';

interface ClientMapViewProps {
  offers: Offer[];
  onMarkerClick: (offer: Offer) => void;
  center?: { lat: number; lng: number };
  selectedOfferId?: string;
}

const ClientMapView = ({ offers, onMarkerClick, center, selectedOfferId }: ClientMapViewProps) => {
  return (
      <MapView
          offers={offers}
          onMarkerClick={onMarkerClick}
          center={center}
          selectedOfferId={selectedOfferId}
      />
  );
};

export default ClientMapView;
