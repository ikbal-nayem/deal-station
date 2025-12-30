
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
  },
  {
    id: 'admin-1',
    firstName: 'Bob',
    lastName: 'Admin',
    email: 'admin@example.com',
    password: 'password',
    role: 'Admin',
  },
  {
    id: 'org-1',
    firstName: 'Charlie',
    lastName: 'Owner',
    email: 'org@example.com',
    password: 'password',
    role: 'Organization',
    organizationId: mockOrganizations[0].id,
  },
  {
    id: 'user-2',
    firstName: 'David',
    lastName: 'Staff',
    email: 'staff@dailygrind.com',
    password: 'password',
    role: 'Organization',
    organizationId: mockOrganizations[0].id,
  },
   {
    id: 'user-3',
    firstName: 'Eve',
    lastName: 'User',
    email: 'eve@example.com',
    password: 'password',
    role: 'End User',
  },
];
