
'use client';

import { useState, useEffect } from 'react';

// Default to Dhaka, Bangladesh if location permission is denied
const DEFAULT_LOCATION = {
  lat: 23.8103,
  lng: 90.4125,
};

export function useLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLocation(DEFAULT_LOCATION);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError('Location permission denied. Showing results for a default area.');
          break;
        case error.POSITION_UNAVAILABLE:
          setError('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          setError('The request to get user location timed out.');
          break;
        default:
          setError('An unknown error occurred.');
          break;
      }
      setLocation(DEFAULT_LOCATION);
    };
    
    // Set default location immediately, then try to get precise location
    setLocation(DEFAULT_LOCATION);
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
    });
  }, []);

  return { location, error };
}
