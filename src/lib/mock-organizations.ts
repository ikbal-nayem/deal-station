
import type { Organization } from './types';

export const mockOrganizations: Organization[] = [
  {
    id: 'org-daily-grind',
    name: 'The Daily Grind',
    ownerEmail: 'org@example.com',
    createdAt: '2023-01-15T09:30:00Z',
  },
  {
    id: 'org-serenity-yoga',
    name: 'Serenity Yoga Studio',
    ownerEmail: 'manager@serenity.com',
    createdAt: '2023-02-20T14:00:00Z',
  },
  {
    id: 'org-bellas-trattoria',
    name: 'Bella\'s Trattoria',
    ownerEmail: 'owner@bella.com',
    createdAt: '2023-03-10T18:45:00Z',
  },
  {
    id: 'org-book-nook',
    name: 'The Book Nook',
    ownerEmail: 'curator@booknook.com',
    createdAt: '2023-04-05T11:10:00Z',
  },
  {
    id: 'org-chic-boutique',
    name: 'Chic Boutique',
    ownerEmail: 'style@chic.com',
    createdAt: '2023-05-25T16:20:00Z',
  },
  {
    id: 'org-scoops-ahoy',
    name: 'Scoops Ahoy',
    ownerEmail: 'captain@scoops.com',
    createdAt: '2023-06-18T20:00:00Z',
  },
];
