
import { User } from './types';
import { mockOrganizations } from './mock-organizations';

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
    name: 'Charlie (Org Owner)',
    email: 'org@example.com',
    password: 'password',
    role: 'Organization',
    organizationId: mockOrganizations[0].id,
  },
  {
    id: 'user-2',
    name: 'David (Org Staff)',
    email: 'staff@dailygrind.com',
    password: 'password',
    role: 'Organization',
    organizationId: mockOrganizations[0].id,
  },
   {
    id: 'user-3',
    name: 'Eve (End User)',
    email: 'eve@example.com',
    password: 'password',
    role: 'End User',
  },
];
