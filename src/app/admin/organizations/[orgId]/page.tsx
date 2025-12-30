
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Users, ShoppingBag, GitBranchPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockOrganizations } from '@/lib/mock-organizations';
import type { Organization } from '@/lib/types';
import { mockUsers } from '@/lib/mock-users';
import { mockOffers } from '@/lib/mock-data';

export default function OrganizationDetailsPage() {
    const params = useParams();
    const orgId = params.orgId as string;

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [userCount, setUserCount] = useState(0);
    const [offerCount, setOfferCount] = useState(0);
    const [branchCount, setBranchCount] = useState(0);

    useEffect(() => {
        const foundOrg = mockOrganizations.find(o => o.id === orgId);
        if (foundOrg) {
            setOrganization(foundOrg);
            setUserCount(mockUsers.filter(u => u.organizationId === orgId).length);
            setOfferCount(mockOffers.filter(o => o.organizationId === orgId).length);
            // Assuming 2 branches for now as in branch page
            setBranchCount(2); 
        }
    }, [orgId]);


    if (!organization) {
        return <div className="text-center">Loading...</div>;
    }

    return (
       <Card>
            <CardHeader>
                <CardTitle>Organization Overview</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">Assigned to this organization</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
                        <GitBranchPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{branchCount}</div>
                        <p className="text-xs text-muted-foreground">Registered locations</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{offerCount}</div>
                        <p className="text-xs text-muted-foreground">Created by this organization</p>
                    </CardContent>
                </Card>
               </div>
            </CardContent>
        </Card>
    );
}
