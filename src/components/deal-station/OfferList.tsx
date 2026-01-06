
'use client';

import * as React from 'react';
import type { Offer } from '@/lib/types';
import OfferListItem from './OfferListItem';
import OfferGridCard from './OfferGridCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfferListProps {
  offers: Offer[];
  onShowDetailsClick: (offer: Offer) => void;
  onShowOnMapClick: (offer: Offer) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  display: 'list' | 'grid';
  setDisplay: (display: 'list' | 'grid') => void;
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
  display,
  setDisplay
}: OfferListProps) {
  const hasOffers = offers.length > 0;
  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-headline">Nearby Offers</h2>
          <p className="text-muted-foreground">Special perks waiting for you.</p>
        </div>
        <div className="hidden md:flex items-center gap-1 rounded-md bg-muted p-1">
            <Button
              variant={display === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDisplay('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={display === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDisplay('grid')}
              className="h-8 px-3"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
        </div>
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

      <div className={cn(
        "flex-1 overflow-y-auto -mr-2 pr-2",
        display === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"
      )}>
        {hasOffers
          ? offers.map((offer) => (
              display === 'list' ? (
                <OfferListItem
                  key={offer.id}
                  offer={offer}
                  onShowDetailsClick={onShowDetailsClick}
                  onShowOnMapClick={onShowOnMapClick}
                />
              ) : (
                <OfferGridCard
                  key={offer.id}
                  offer={offer}
                  onShowDetailsClick={onShowDetailsClick}
                  onShowOnMapClick={onShowOnMapClick}
                />
              )
            ))
          : Array.from({ length: 5 }).map((_, i) => <OfferCardSkeleton key={i} layout={display} />)}
        
        {!hasOffers && searchQuery && (
            <div className="text-center py-10 col-span-full">
                <p className="text-muted-foreground">No offers found for your search.</p>
            </div>
        )}
      </div>
    </div>
  );
}

function OfferCardSkeleton({ layout }: { layout: 'list' | 'grid'}) {
    if (layout === 'grid') {
        return (
        <div className="flex flex-col gap-2 p-2 border rounded-lg h-full">
          <Skeleton className="w-full aspect-video rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
           <div className="flex gap-2 pt-1">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-18 rounded-full" />
          </div>
        </div>
        );
    }
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
