

export type Offer = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  companyName: string;
  latitude: number;
  longitude: number;
  isMemberOnly: boolean;
  distance: string;
  discount: string;
  category: string;
  organizationId: string;
};

export type UserRole = 'End User' | 'Admin' | 'Organization';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be stored in frontend state in a real app
  role: UserRole;
  organizationId?: string; // if role is 'Organization' or if user is assigned to one
};

export type Organization = {
    id: string;
    name: string;
    ownerEmail: string;
    createdAt: string;
    website?: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
}

    