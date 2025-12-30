
'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, Building, Users, ShoppingBag, Mail, Phone, Globe, GitBranchPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockOrganizations } from '@/lib/mock-organizations';
import type { Organization } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { mockUsers } from '@/lib/mock-users';
import { mockOffers } from '@/lib/mock-data';

export default function OrganizationDetailLayout({ children }: { children: ReactNode }) {
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
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

     useEffect(() => {
        // Redirect from base org page to the users tab by default
        if (pathname === `/admin/organizations/${orgId}`) {
            router.replace(`/admin/organizations/${orgId}/users`);
        }
    }, [pathname, orgId, router]);

    const getActiveTab = () => {
        if (pathname.endsWith('/users')) return 'users';
        if (pathname.endsWith('/branches')) return 'branches';
        if (pathname.endsWith('/offers')) return 'offers';
        // Default to users, which will be redirected to anyway
        return 'users';
    }
    
    if (!organization) {
        return <div className="p-6 text-center">Loading organization details...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Button variant="ghost" asChild className="-ml-4">
                    <Link href="/admin/organizations">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Organizations
                    </Link>
                </Button>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={organization.logoUrl} alt={organization.name} />
                        <AvatarFallback>{organization.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-xl font-bold">{organization.name}</h1>
                        <p className="text-muted-foreground">Joined on {format(new Date(organization.createdAt), 'PPP')}</p>
                    </div>
                </div>
                 <Card>
                    <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground"/>
                                <a href={`mailto:${organization.ownerEmail}`} className="hover:underline">{organization.ownerEmail}</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground"/>
                                <span>{organization.phone || 'No phone'}</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-muted-foreground"/>
                                <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{organization.website || 'No website'}</a>
                            </div>
                        </div>
                        <Separator/>
                         <div className="flex items-start gap-3 text-sm">
                            <Building className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0"/>
                            <span>{organization.address || 'No address provided'}</span>
                        </div>
                    </CardContent>
                </Card>

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
            </div>

            <Tabs value={getActiveTab()} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                     <TabsTrigger value="users" asChild>
                        <Link href={`/admin/organizations/${orgId}/users`}>
                             <Users className="mr-2 h-4 w-4" />
                            Users
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="branches" asChild>
                        <Link href={`/admin/organizations/${orgId}/branches`}>
                             <Building className="mr-2 h-4 w-4" />
                            Branches
                        </Link>
                    </TabsTrigger>
                    <TabsTrigger value="offers" asChild>
                         <Link href={`/admin/organizations/${orgId}/offers`}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Offers
                        </Link>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            
            <div>
                {children}
            </div>

        </div>
    );
}
