
'use client';

import * as React from 'react';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import type { Offer } from '@/lib/types';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';
import { useTheme } from 'next-themes';

interface MapViewProps {
  offers: Offer[];
  onMarkerClick: (offer: Offer) => void;
  center?: { lat: number; lng: number };
  selectedOfferId?: string;
  selectedOfferForMap?: Offer | null;
}

export default function MapView({ offers, onMarkerClick, center, selectedOfferId, selectedOfferForMap }: MapViewProps) {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  const [viewState, setViewState] = React.useState({
    longitude: center?.lng ?? 90.4125,
    latitude: center?.lat ?? 23.8103,
    zoom: 12,
    pitch: 0,
    bearing: 0,
    transitionDuration: 1000,
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (center) {
      setViewState(current => ({
        ...current,
        longitude: center.lng,
        latitude: center.lat,
      }));
    }
  }, [center]);

   React.useEffect(() => {
    if (selectedOfferForMap) {
      setViewState(current => ({
        ...current,
        longitude: selectedOfferForMap.longitude,
        latitude: selectedOfferForMap.latitude,
        zoom: 15,
        transitionDuration: 1000,
      }));
    }
  }, [selectedOfferForMap]);


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

  const getMapStyle = () => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return isDark 
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  }

  // We need to wait for the component to be mounted to check the theme
  if (!isMounted) {
    return <div className="w-full h-full bg-muted animate-pulse" />;
  }
  
  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle={getMapStyle()}
      onClick={() => setPopupInfo(null)}
    >
      {center && (
         <Marker longitude={center.lng} latitude={center.lat}>
            <div className="animate-wave" title="Your Location">
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary-foreground shadow-md"></div>
            </div>
          </Marker>
      )}
      {markers}

      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
          offset={30}
          anchor="bottom"
          className="font-body"
        >
          <div className="p-1">
            <h3 className="font-bold text-sm text-foreground">{popupInfo.title}</h3>
            <p className="text-xs text-muted-foreground">{popupInfo.companyName}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
