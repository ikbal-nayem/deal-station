'use client';

import * as React from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { Offer } from '@/lib/types';
import { Star } from 'lucide-react';

interface MapViewProps {
  offers: Offer[];
  onMarkerClick: (offer: Offer) => void;
  center?: { lat: number; lng: number };
  selectedOfferId?: string;
}

export default function MapView({ offers, onMarkerClick, center, selectedOfferId }: MapViewProps) {
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || 'DEMO_MAP_ID';
  
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    if (mapRef.current && center) {
        // You can add more complex map interactions here
    }
  }, [center]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Map
        ref={mapRef}
        defaultZoom={12}
        defaultCenter={center}
        center={center}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={mapId}
      >
        {offers.map((offer) => (
          <AdvancedMarker
            key={offer.id}
            position={{ lat: offer.latitude, lng: offer.longitude }}
            onClick={() => onMarkerClick(offer)}
            title={offer.title}
          >
            <Pin
              background={'hsl(var(--primary))'}
              borderColor={'hsl(var(--primary-foreground))'}
              glyphColor={'hsl(var(--primary-foreground))'}
              scale={selectedOfferId === offer.id ? 1.2 : 1}
            >
              {offer.isMemberOnly && <Star className="w-4 h-4" />}
            </Pin>
          </AdvancedMarker>
        ))}
      </Map>
    </div>
  );
}
