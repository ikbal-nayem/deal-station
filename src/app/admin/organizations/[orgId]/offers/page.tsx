
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockOffers } from '@/lib/mock-data';
import type { Offer } from '@/lib/types';
import { mockOrganizations } from '@/lib/mock-organizations';

export default function OrganizationOffersPage() {
    const params = useParams();
    const orgId = params.orgId as string;

    const [offers, setOffers] = useState<Offer[]>([]);
    const [organizationName, setOrganizationName] = useState('');

    useEffect(() => {
        if (orgId) {
            setOffers(mockOffers.filter(o => o.organizationId === orgId));
            const org = mockOrganizations.find(o => o.id === orgId);
            if(org) setOrganizationName(org.name);
        }
    }, [orgId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Offer Summary</CardTitle>
                <CardDescription>An overview of offers created by {organizationName}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Offer Title</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Category</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {offers.map(offer => (
                            <TableRow key={offer.id}>
                                <TableCell>{offer.title}</TableCell>
                                <TableCell>{offer.discount}</TableCell>
                                <TableCell>{offer.category}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {offers.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">This organization has not created any offers yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

