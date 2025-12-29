'use client';

import * as React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Offer } from '@/lib/types';
import { mockOffers } from '@/lib/mock-data';
import { useLocation } from '@/hooks/use-location';
import OfferList from '@/components/local-perks/OfferList';
import MapView from '@/components/local-perks/MapView';
import OfferDetailsSheet from '@/components/local-perks/OfferDetailsSheet';
import { List, Map as MapIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LocalPerksPage() {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = React.useState<Offer | null>(null);
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const { location, error: locationError } = useLocation();
  const [view, setView] = React.useState<'list' | 'map'>('list');
  const { toast } = useToast();

  React.useEffect(() => {
    if (locationError) {
      toast({
        title: 'Location Error',
        description: locationError,
        variant: 'destructive',
      });
    }
  }, [locationError, toast]);

  React.useEffect(() => {
    // Here you would fetch offers based on the user's location.
    // We'll use mock data for this example.
    setOffers(mockOffers);
  }, [location]);

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setSheetOpen(true);
  };

  const handleMarkerClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setSheetOpen(true);
  }

  const onSheetOpenChange = (isOpen: boolean) => {
    setSheetOpen(isOpen);
    if (!isOpen) {
      // Delay clearing the offer to allow the sheet to animate out
      setTimeout(() => {
        setSelectedOffer(null);
      }, 300);
    }
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Configuration Error</h1>
          <p className="text-muted-foreground">
            Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div className="flex h-screen w-full flex-col bg-background text-foreground">
        <header className="flex shrink-0 items-center justify-between border-b p-2 md:hidden">
          <h1 className="text-xl font-bold font-headline px-2">LocalPerks</h1>
          <div className="flex items-center gap-1 rounded-md bg-muted p-1">
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('map')}
              className="h-8 px-3"
            >
              <MapIcon className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col md:flex-row overflow-hidden">
          <div className={cn('md:w-1/2 lg:w-[400px] h-full overflow-y-auto border-r', view !== 'list' && 'hidden md:flex')}>
            <OfferList offers={offers} onOfferClick={handleOfferClick} />
          </div>

          <div className={cn('flex-1 h-full', view !== 'map' && 'hidden md:block')}>
            <MapView offers={offers} onMarkerClick={handleMarkerClick} center={location} selectedOfferId={selectedOffer?.id} />
          </div>
        </main>

        <OfferDetailsSheet
          offer={selectedOffer}
          isOpen={isSheetOpen}
          onOpenChange={onSheetOpenChange}
        />
      </div>
    </APIProvider>
  );
}
