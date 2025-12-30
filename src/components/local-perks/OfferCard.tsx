
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Star, MapPin, Lock, Info, Map } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import type { Offer } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface OfferCardProps {
  offer: Offer;
  onShowDetailsClick: (offer: Offer) => void;
  onShowOnMapClick: (offer: Offer) => void;
}

export default function OfferCard({ offer, onShowDetailsClick, onShowOnMapClick }: OfferCardProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const showLoginOverlay = offer.isMemberOnly && !isLoggedIn;

  const placeholderImage = PlaceHolderImages[0];

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showLoginOverlay) {
        router.push('/login');
    } else {
        onShowDetailsClick(offer);
    }
  }

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowOnMapClick(offer);
  }

  return (
    <Card
      className="relative overflow-hidden group/card w-full flex flex-col"
    >
      <div className="relative">
        <Image
          src={placeholderImage.imageUrl}
          alt={offer.title}
          width={600}
          height={400}
          className={cn(
            'w-full h-32 object-cover transition-transform duration-300',
            showLoginOverlay && 'blur-sm'
          )}
          data-ai-hint={placeholderImage.imageHint}
        />
        {offer.isMemberOnly && (
          <Badge
            variant="default"
            className="absolute top-2 right-2 bg-accent text-accent-foreground"
          >
            <Star className="w-3 h-3 mr-1" />
            Member
          </Badge>
        )}
      </div>
      <CardHeader className={cn(showLoginOverlay && 'blur-sm')}>
        <CardTitle className="text-lg font-headline">
          {offer.title}
        </CardTitle>
        <CardDescription>
          {offer.companyName}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn('flex-grow', showLoginOverlay && 'blur-sm')}>
        <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
        <div className="text-xs text-muted-foreground/80 mt-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{offer.distance} away</span>
        </div>
      </CardContent>
      <CardFooter className={cn('flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-0', showLoginOverlay && 'blur-sm')}>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleMapClick}>
              <Map className="w-4 h-4 mr-2"/>
              Show on Map
          </Button>
          <Button size="sm" className="flex-1" onClick={handleDetailsClick}>
              <Info className="w-4 h-4 mr-2"/>
              Show Details
          </Button>
      </CardFooter>
      {showLoginOverlay && (
        <div className="absolute inset-0 bg-background/80 dark:bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <div className="p-4 bg-card rounded-lg shadow-xl">
                <Lock className="w-8 h-8 mx-auto text-accent mb-2" />
                <h3 className="font-bold font-headline text-lg text-foreground">Member Exclusive</h3>
                <p className="text-muted-foreground text-sm mb-4">Login to unlock this special offer.</p>
                <Button onClick={(e) => { e.stopPropagation(); router.push('/login'); }}>
                    Login to View
                </Button>
            </div>
        </div>
      )}
    </Card>
  );
}
