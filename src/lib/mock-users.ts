
import { User } from './types';
import { mockOrganizations } from './mock-organizations';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    firstName: 'Alice',
    lastName: 'User',
    email: 'user@example.com',
    password: 'password',
    role: 'End User',
    phone: '555-111-2222',
  },
  {
    id: 'admin-1',
    firstName: 'Bob',
    lastName: 'Admin',
    email: 'admin@example.com',
    password: 'password',
    role: 'Admin',
    phone: '555-333-4444',
  },
  {
    id: 'org-1',
    firstName: 'Charlie',
    lastName: 'Owner',
    email: 'org@example.com',
    password: 'password',
    role: 'Organization',
    organizationId: mockOrganizations[0].id,
    phone: '555-555-6666',
  },
  {
    id: 'user-2',
    firstName: 'David',
    lastName: 'Staff',
    email: 'staff@dailygrind.com',
    password: 'password',
    role: 'Organization',
    organizationId: mockOrganizations[0].id,
    phone: '555-777-8888',
  },
   {
    id: 'user-3',
    firstName: 'Eve',
    lastName: 'User',
    email: 'eve@example.com',
    password: 'password',
    role: 'End User',
    phone: '555-999-0000',
  },
];
