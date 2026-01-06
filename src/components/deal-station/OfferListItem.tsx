'use client';

import * as React from 'react';
import Image from 'next/image';
import { MapPin, Star, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Offer } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Props {
  offer: Offer;
  onShowDetailsClick: (offer: Offer) => void;
  onShowOnMapClick: (offer: Offer) => void;
}

export default function OfferListItem({ offer, onShowDetailsClick, onShowOnMapClick }: Props) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const showLoginOverlay = offer.isMemberOnly && !isLoggedIn;
  const placeholderImage = PlaceHolderImages[0];

  const handleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showLoginOverlay) return router.push('/login');
    onShowDetailsClick(offer);
  };

  const handleMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowOnMapClick(offer);
  };

  return (
    <Card className="relative flex items-center gap-3 p-3 min-h-[96px]" onClick={handleDetails}>
      <div className="shrink-0">
        <Image src={placeholderImage.imageUrl} alt={offer.title} width={96} height={96} className="rounded-md object-cover" data-ai-hint={placeholderImage.imageHint} />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold line-clamp-1">{offer.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{offer.companyName}</p>
          </div>
          {offer.isMemberOnly && <Badge variant="default" className="bg-accent text-accent-foreground"><Star className="w-3 h-3 mr-1"/>Member</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{offer.description}</p>
        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{offer.distance} away</div>
            <Badge variant="secondary">{offer.discount}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={handleMap}>Show on Map</Button>
            <Button type="button" size="sm" onClick={handleDetails}>View</Button>
          </div>
        </div>
      </div>

      {showLoginOverlay && (
        <div className="absolute inset-0 bg-background/80 dark:bg-background/60 backdrop-blur-sm flex items-center justify-center">
          <div className="p-3 bg-card rounded-md text-center">
            <Lock className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm">Members only</p>
            <Button size="sm" className="mt-2" onClick={(e) => { e.stopPropagation(); router.push('/login'); }}>Login</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
