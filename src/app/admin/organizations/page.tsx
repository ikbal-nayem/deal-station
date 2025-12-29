
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function OrganizationsPage() {
    const { toast } = useToast();
    const [orgName, setOrgName] = useState('');
    const [orgUserEmail, setOrgUserEmail] = useState('');

    const handleAddOrganization = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Adding organization:', { orgName, orgUserEmail });
        toast({
            title: "Organization Added (Simulated)",
            description: `${orgName} has been created.`,
        });
        setOrgName('');
        setOrgUserEmail('');
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Organizations</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Organization</CardTitle>
                    <CardDescription>Create a new organization and assign an initial user.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddOrganization} className="space-y-4 max-w-lg">
                        <div className="space-y-2">
                            <Label htmlFor="orgName">Organization Name</Label>
                            <Input 
                                id="orgName" 
                                placeholder="e.g., The Daily Grind" 
                                value={orgName}
                                onChange={e => setOrgName(e.target.value)}
                                required
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="orgUserEmail">Organization User Email</Label>
                            <Input 
                                id="orgUserEmail" 
                                type="email"
                                placeholder="user@organization.com" 
                                value={orgUserEmail}
                                onChange={e => setOrgUserEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit">Add Organization</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
