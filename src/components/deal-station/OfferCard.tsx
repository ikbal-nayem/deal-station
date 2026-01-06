'use client';

import OfferListItem from './OfferListItem';
import OfferGridCard from './OfferGridCard';
import type { Offer } from '@/lib/types';

interface OfferCardProps {
  offer: Offer;
  onShowDetailsClick: (offer: Offer) => void;
  onShowOnMapClick: (offer: Offer) => void;
  layout?: 'list' | 'grid';
}

// Lightweight wrapper to preserve backward compatibility. Prefer using OfferListItem or OfferGridCard directly.
export default function OfferCard({ offer, onShowDetailsClick, onShowOnMapClick, layout = 'list' }: OfferCardProps) {
  return layout === 'list' ? (
	<OfferListItem offer={offer} onShowDetailsClick={onShowDetailsClick} onShowOnMapClick={onShowOnMapClick} />
  ) : (
	<OfferGridCard offer={offer} onShowDetailsClick={onShowDetailsClick} onShowOnMapClick={onShowOnMapClick} />
  );
}
