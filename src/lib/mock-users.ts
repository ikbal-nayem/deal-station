
import { User } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice (User)',
    email: 'user@example.com',
    password: 'password',
    role: 'End User',
  },
  {
    id: 'admin-1',
    name: 'Bob (Admin)',
    email: 'admin@example.com',
    password: 'password',
    role: 'Admin',
  },
  {
    id: 'org-1',
    name: 'Charlie (Org)',
    email: 'org@example.com',
    password: 'password',
    role: 'Organization',
    organizationId: 'org-chic-boutique',
  },
];
