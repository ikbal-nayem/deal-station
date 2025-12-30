'use client';

import * as React from 'react';
import MapView from './MapView';
import type { Offer } from '@/lib/types';
import type { Feature, LineString } from 'geojson';

interface ClientMapViewProps {
  offers: Offer[];
  onMarkerClick: (offer: Offer) => void;
  center?: { lat: number; lng: number };
  selectedOfferForMap?: Offer | null;
}

const ClientMapView = ({ offers, onMarkerClick, center, selectedOfferForMap }: ClientMapViewProps) => {
  const routeLine = React.useMemo((): Feature<LineString> | undefined => {
    if (center && selectedOfferForMap) {
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [center.lng, center.lat],
            [selectedOfferForMap.longitude, selectedOfferForMap.latitude],
          ],
        },
      };
    }
    return undefined;
  }, [center, selectedOfferForMap]);
  
  return (
      <MapView
          offers={offers}
          onMarkerClick={onMarkerClick}
          center={center}
          selectedOfferId={selectedOfferForMap?.id}
          routeLine={routeLine}
      />
  );
};

export default ClientMapView;
