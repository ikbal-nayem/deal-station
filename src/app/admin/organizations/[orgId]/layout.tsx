
'use client';

import { useParams, usePathname } from 'next/navigation';
import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, Building, Users, ShoppingBag, Info, Mail, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockOrganizations } from '@/lib/mock-organizations';
import type { Organization } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export default function OrganizationDetailLayout({ children }: { children: ReactNode }) {
    const params = useParams();
    const pathname = usePathname();
    const orgId = params.orgId as string;

    const [organization, setOrganization] = useState<Organization | null>(null);

    useEffect(() => {
        const foundOrg = mockOrganizations.find(o => o.id === orgId);
        if (foundOrg) {
            setOrganization(foundOrg);
        }
    }, [orgId]);

    const getActiveTab = () => {
        if (pathname.endsWith('/users')) return 'users';
        if (pathname.endsWith('/branches')) return 'branches';
        if (pathname.endsWith('/offers')) return 'offers';
        return 'details';
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
            </div>

            <Tabs value={getActiveTab()} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details" asChild>
                        <Link href={`/admin/organizations/${orgId}`}>
                            <Info className="mr-2 h-4 w-4" />
                            Overview
                        </Link>
                    </TabsTrigger>
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
