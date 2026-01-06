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

export default function OfferGridCard({ offer, onShowDetailsClick, onShowOnMapClick }: Props) {
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
    <Card className="relative flex flex-col h-full p-2 min-h-[180px] overflow-hidden" onClick={handleDetails}>
      <div className="relative w-full overflow-hidden rounded-md">
        <Image src={placeholderImage.imageUrl} alt={offer.title} width={240} height={140} className={cn('object-cover w-full h-[140px] block')} data-ai-hint={placeholderImage.imageHint} />
        {offer.isMemberOnly && <Badge variant="default" className="absolute top-2 right-2 bg-accent text-accent-foreground"><Star className="w-3 h-3 mr-1"/>Member</Badge>}
      </div>
      <div className="flex-1 mt-2">
        <h3 className="font-semibold text-sm line-clamp-1">{offer.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{offer.companyName}</p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{offer.description}</p>
      </div>
        <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{offer.distance} away</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">{offer.discount}</Badge>
          <Button type="button" size="sm" variant="ghost" onClick={handleMap}>Map</Button>
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
