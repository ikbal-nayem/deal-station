
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Globe, Phone, Mail, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { mockOrganizations } from '@/lib/mock-organizations';
import type { Organization } from '@/lib/types';

export default function OrganizationDetailsPage() {
    const params = useParams();
    const orgId = params.orgId as string;

    const [organization, setOrganization] = useState<Organization | null>(null);

    useEffect(() => {
        const foundOrg = mockOrganizations.find(o => o.id === orgId);
        if (foundOrg) {
            setOrganization(foundOrg);
        }
    }, [orgId]);


    if (!organization) {
        return <div className="text-center">Loading...</div>;
    }

    return (
       <Card>
            <CardHeader>
                <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5"/>
                    <span className="text-sm">{organization.address || 'No address provided'}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground"/>
                    <a href={`mailto:${organization.ownerEmail}`} className="text-sm hover:underline">{organization.ownerEmail}</a>
                </div>
                 <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground"/>
                    <span className="text-sm">{organization.phone || 'No phone provided'}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground"/>
                     <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{organization.website || 'No website provided'}</a>
                </div>
                 <Separator/>
                 <p className="text-xs text-muted-foreground pt-2">
                    Joined on {format(new Date(organization.createdAt), 'PPP')}
                 </p>
            </CardContent>
        </Card>
    );
}
