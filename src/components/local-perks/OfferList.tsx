'use client';

import * as React from 'react';
import type { Offer } from '@/lib/types';
import OfferCard from './OfferCard';
import { Skeleton } from '@/components/ui/skeleton';

interface OfferListProps {
  offers: Offer[];
  onOfferClick: (offer: Offer) => void;
}

export default function OfferList({ offers, onOfferClick }: OfferListProps) {
  const hasOffers = offers.length > 0;
  return (
    <div className="p-4 space-y-4 h-full">
      <div className="pb-4">
        <h2 className="text-2xl font-bold font-headline">Nearby Offers</h2>
        <p className="text-muted-foreground">Special perks waiting for you.</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {hasOffers
          ? offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} onOfferClick={onOfferClick} />
            ))
          : Array.from({ length: 5 }).map((_, i) => <OfferCardSkeleton key={i} />)}
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
