'use client';

import * as React from 'react';
import MapView from './MapView';
import type { Offer } from '@/lib/types';

interface ClientMapViewProps {
  offers: Offer[];
  onMarkerClick: (offer: Offer) => void;
  center?: { lat: number; lng: number };
  selectedOfferForMap?: Offer | null;
}

const ClientMapView = ({ offers, onMarkerClick, center, selectedOfferForMap }: ClientMapViewProps) => {
  return (
      <MapView
          offers={offers}
          onMarkerClick={onMarkerClick}
          center={center}
          selectedOfferId={selectedOfferForMap?.id}
          selectedOfferForMap={selectedOfferForMap}
      />
  );
};

export default ClientMapView;
