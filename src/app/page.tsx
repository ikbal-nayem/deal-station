
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Offer } from '@/lib/types';
import { mockOffers } from '@/lib/mock-data';
import { useLocation } from '@/hooks/use-location';
import OfferList from '@/components/local-perks/OfferList';
import OfferDetailsSheet from '@/components/local-perks/OfferDetailsSheet';
import { List, Map as MapIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';

const ClientMapView = dynamic(() => import('@/components/local-perks/ClientMapView'), {
  ssr: false,
});


export default function LocalPerksPage() {
  const [allOffers, setAllOffers] = React.useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = React.useState<Offer[]>([]);
  const [selectedOfferForSheet, setSelectedOfferForSheet] = React.useState<Offer | null>(null);
  const [selectedOfferForMap, setSelectedOfferForMap] = React.useState<Offer | null>(null);
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const { location, error: locationError } = useLocation();
  const [view, setView] = React.useState<'list' | 'map'>('list');
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const { isLoggedIn } = useAuth();
  const router = useRouter();

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
    setAllOffers(mockOffers);
    setFilteredOffers(mockOffers);
    const uniqueCategories = ['All', ...Array.from(new Set(mockOffers.map(o => o.category)))];
    setCategories(uniqueCategories);
  }, [location]);

  React.useEffect(() => {
    let offers = allOffers;

    if (selectedCategory !== 'All') {
      offers = offers.filter(offer => offer.category === selectedCategory);
    }

    if (searchQuery) {
      offers = offers.filter(offer => 
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredOffers(offers);
  }, [selectedCategory, allOffers, searchQuery]);

  const handleShowDetailsClick = (offer: Offer) => {
    if (offer.isMemberOnly && !isLoggedIn) {
      router.push('/login');
      return;
    }
    setSelectedOfferForSheet(offer);
    setSheetOpen(true);
  };
  
  const handleShowOnMapClick = (offer: Offer) => {
    // By setting it to null first, we ensure React detects the change even if the same offer is clicked again.
    // This is crucial for the line to be re-drawn if the map view was changed.
    setSelectedOfferForMap(null);
    setTimeout(() => {
      setSelectedOfferForMap(offer);
      setView('map');
    }, 0);
  };

  const handleMarkerClick = (offer: Offer) => {
     if (offer.isMemberOnly && !isLoggedIn) {
      router.push('/login');
      return;
    }
    setSelectedOfferForSheet(offer);
    setSheetOpen(true);
    setSelectedOfferForMap(offer);
  }

  const onSheetOpenChange = (isOpen: boolean) => {
    setSheetOpen(isOpen);
    if (!isOpen) {
      // Delay clearing the offer to allow the sheet to animate out
      setTimeout(() => {
        setSelectedOfferForSheet(null);
      }, 300);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <Header>
          <div className="flex items-center gap-1 rounded-md bg-muted p-1 md:hidden">
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
      </Header>
      
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div className={cn('md:w-1/2 lg:w-[450px] h-full overflow-y-auto border-r', view !== 'list' && 'hidden md:flex')}>
          <OfferList
            offers={filteredOffers}
            onShowDetailsClick={handleShowDetailsClick}
            onShowOnMapClick={handleShowOnMapClick}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className={cn('flex-1 h-full', view !== 'map' && 'hidden md:block')}>
          <ClientMapView 
            offers={filteredOffers} 
            onMarkerClick={handleMarkerClick} 
            center={location} 
            selectedOfferForMap={selectedOfferForMap} 
          />
        </div>
      </main>

      <OfferDetailsSheet
        offer={selectedOfferForSheet}
        isOpen={isSheetOpen}
        onOpenChange={onSheetOpenChange}
      />
    </div>
  );
}
