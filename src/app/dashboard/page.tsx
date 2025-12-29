
'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function OrganizationDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Organization Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.name || 'Organization'}!</CardTitle>
            <CardDescription>Manage your offers and branches here.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Offers</CardTitle>
            <CardDescription>Create and manage special offers.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Branches</CardTitle>
            <CardDescription>Manage your business locations.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
