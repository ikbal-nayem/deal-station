

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
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string; // Should not be stored in frontend state in a real app
  role: UserRole;
  organizationId?: string; // if role is 'Organization' or if user is assigned to one
  avatarUrl?: string;
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

export type Category = {
    id: string;
    name: string;
}

export type Tag = {
    id: string;
    name: string;
}

export type Branch = {
    id: string;
    name: string;
    address: string;
    organizationId: string;
};
