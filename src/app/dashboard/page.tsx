
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { mockOffers } from '@/lib/mock-data';
import { ShoppingBag, GitBranchPlus } from 'lucide-react';

export default function OrganizationDashboardPage() {
  const { user } = useAuth();
  const offerCount = user ? mockOffers.filter(o => o.organizationId === user.organizationId).length : 0;
  
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Welcome, {user ? `${user.firstName} ${user.lastName}` : 'Organization'}!</h1>
        <p className="text-muted-foreground">Here's a summary of your organization's activity.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Offers</CardTitle>
             <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offerCount}</div>
            <p className="text-xs text-muted-foreground">Active offers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Branches</CardTitle>
            <GitBranchPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
             <p className="text-xs text-muted-foreground">Managed locations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
