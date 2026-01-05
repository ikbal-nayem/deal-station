
'use client';

import * as React from 'react';
import type { Offer } from '@/lib/types';
import OfferCard from './OfferCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface OfferListProps {
  offers: Offer[];
  onShowDetailsClick: (offer: Offer) => void;
  onShowOnMapClick: (offer: Offer) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function OfferList({
  offers,
  onShowDetailsClick,
  onShowOnMapClick,
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: OfferListProps) {
  const hasOffers = offers.length > 0;
  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="pb-4">
        <h2 className="text-2xl font-bold font-headline">Nearby Offers</h2>
        <p className="text-muted-foreground">Special perks waiting for you.</p>
      </div>

       <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by company or tag..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2 pb-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 -mr-2 pr-2">
        {hasOffers
          ? offers.map((offer) => (
              <OfferCard 
                key={offer.id} 
                offer={offer} 
                onShowDetailsClick={onShowDetailsClick}
                onShowOnMapClick={onShowOnMapClick}
              />
            ))
          : Array.from({ length: 5 }).map((_, i) => <OfferCardSkeleton key={i} />)}
        
        {!hasOffers && searchQuery && (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No offers found for your search.</p>
            </div>
        )}
      </div>
    </div>
  );
}

function OfferCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-md shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
