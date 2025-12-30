
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
    <div className="p-4 space-y-4 h-full">
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

      <div className="grid grid-cols-1 gap-4">
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
    <div className="flex flex-col space-y-3 p-4 border rounded-lg">
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
       <div className="space-y-2 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
