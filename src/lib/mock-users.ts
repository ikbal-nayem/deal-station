

import { IUser } from '@/interfaces/auth.interface';
import { mockOrganizations } from './mock-organizations';
import { ROLES } from '@/constants/auth.constant';

export const mockUsers: IUser[] = [
  {
    id: 'user-1',
    firstName: 'Alice',
    lastName: 'User',
    username: 'user@example.com',
    email: 'user@example.com',
    roles: [ROLES.USER],
    phone: '555-111-2222',
  },
  {
    id: 'admin-1',
    firstName: 'Bob',
    lastName: 'Admin',
    username: 'admin@example.com',
    email: 'admin@example.com',
    roles: [ROLES.ADMIN],
    phone: '555-333-4444',
  },
  {
    id: 'org-1',
    firstName: 'Charlie',
    lastName: 'Owner',
    username: 'org@example.com',
    email: 'org@example.com',
    roles: [ROLES.OPERATOR],
    organizationId: mockOrganizations[0].id,
    phone: '555-555-6666',
  },
  {
    id: 'user-2',
    firstName: 'David',
    lastName: 'Staff',
    username: 'staff@dhakaeats.com',
    email: 'staff@dhakaeats.com',
    roles: [ROLES.OPERATOR],
    organizationId: mockOrganizations[0].id,
    phone: '555-777-8888',
  },
   {
    id: 'user-3',
    firstName: 'Eve',
    lastName: 'User',
    username: 'eve@example.com',
    email: 'eve@example.com',
    roles: [ROLES.USER],
    phone: '555-999-0000',
  },
];
