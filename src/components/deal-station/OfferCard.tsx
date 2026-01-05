
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Star, MapPin, Lock, Info, Map } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
      className="relative overflow-hidden group/card w-full flex flex-row items-center p-3 gap-3"
    >
        <div className="relative shrink-0">
            <Image
                src={placeholderImage.imageUrl}
                alt={offer.title}
                width={128}
                height={128}
                className={cn(
                    'w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md transition-transform duration-300',
                    showLoginOverlay && 'blur-sm'
                )}
                data-ai-hint={placeholderImage.imageHint}
            />
            {offer.isMemberOnly && (
                <Badge
                    variant="default"
                    className="absolute top-1.5 right-1.5 bg-accent text-accent-foreground"
                >
                    <Star className="w-3 h-3 mr-1" />
                    Member
                </Badge>
            )}
        </div>

        <div className={cn("flex flex-col flex-1 h-full", showLoginOverlay && 'blur-sm')}>
            <h3 className="font-bold font-headline line-clamp-1">{offer.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{offer.companyName}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-grow">{offer.description}</p>
            <div className="flex flex-wrap gap-2 items-center mt-2">
                 <Badge variant="secondary" className='whitespace-nowrap'>{offer.discount}</Badge>
                 <div className="text-xs text-muted-foreground/80 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{offer.distance} away</span>
                </div>
            </div>
        </div>

        {showLoginOverlay && (
            <div className="absolute inset-0 bg-background/80 dark:bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                <div className="p-4 bg-card rounded-lg shadow-xl">
                    <Lock className="w-8 h-8 mx-auto text-accent mb-2" />
                    <h3 className="font-bold font-headline text-lg text-foreground">Member Exclusive</h3>
                    <p className="text-muted-foreground text-sm mb-4">Login to view.</p>
                    <Button onClick={(e) => { e.stopPropagation(); router.push('/login'); }}>
                        Login to View
                    </Button>
                </div>
            </div>
        )}
    </Card>
  );
}
