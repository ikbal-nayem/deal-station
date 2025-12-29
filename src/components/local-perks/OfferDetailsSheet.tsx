'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QrCodePlaceholder } from '@/components/local-perks/Icons';
import { Globe, MapPin, Star } from 'lucide-react';
import type { Offer } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface OfferDetailsSheetProps {
  offer: Offer | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function OfferDetailsSheet({ offer, isOpen, onOpenChange }: OfferDetailsSheetProps) {
  const placeholderImage = PlaceHolderImages[0];

  const handleOpenInMaps = (e: React.MouseEvent) => {
    e.preventDefault();
    if (offer) {
      const url = `https://www.google.com/maps/search/?api=1&query=${offer.latitude},${offer.longitude}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-sheet rounded-t-lg max-h-[90vh] overflow-y-auto">
        {offer && (
          <div className="max-w-2xl mx-auto py-4">
            <SheetHeader className="text-left mb-4">
              <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-2xl md:text-3xl font-headline">{offer.title}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-1">
                      {offer.companyName} <MapPin className="w-4 h-4 inline-block" /> {offer.distance}
                    </SheetDescription>
                  </div>
                   {offer.isMemberOnly && <Badge variant="default" className="bg-accent text-accent-foreground"><Star className="w-3 h-3 mr-1" />Member</Badge>}
              </div>
            </SheetHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                    <Image
                        src={placeholderImage.imageUrl}
                        alt={offer.title}
                        width={800}
                        height={500}
                        className="rounded-lg object-cover w-full aspect-video mb-4"
                        data-ai-hint={placeholderImage.imageHint}
                    />
                    <h3 className="font-bold text-lg mb-2 font-headline">Description</h3>
                    <p className="text-muted-foreground">{offer.fullDescription}</p>
                </div>
                <div className="md:col-span-1 flex flex-col items-center text-center bg-card p-6 rounded-lg shadow-sm">
                    <h3 className="font-bold text-lg mb-2 font-headline">Your Perk</h3>
                    <p className="text-5xl font-bold text-primary mb-2">{offer.discount}</p>
                    <p className="text-muted-foreground mb-4">Show this QR code at checkout</p>
                    <div className="bg-white p-2 rounded-lg">
                        <QrCodePlaceholder className="w-40 h-40 text-foreground" />
                    </div>
                </div>
            </div>

            <Separator className="my-6" />

            <SheetFooter className="flex-col sm:flex-row gap-2">
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>Close</Button>
              <Button className="w-full sm:w-auto" onClick={handleOpenInMaps}>
                <Globe className="mr-2 h-4 w-4" />
                Open in Maps
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
