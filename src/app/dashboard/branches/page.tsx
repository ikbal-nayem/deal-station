
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function OrgBranchesPage() {
    
    const [branchName, setBranchName] = useState('');
    const [branchLocation, setBranchLocation] = useState('');

    const handleAddBranch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Adding branch:', { branchName, branchLocation });
        toast.success({
            title: "Branch Added (Simulated)",
            description: `${branchName} has been added.`,
        });
        setBranchName('');
        setBranchLocation('');
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold">Manage Your Branches</h1>
                <p className="text-muted-foreground">Add a new location for your organization.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Add New Branch</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddBranch} className="space-y-4 max-w-lg">
                        <div className="space-y-2">
                            <Label htmlFor="branchName">Branch Name</Label>
                            <Input 
                                id="branchName" 
                                placeholder="e.g., Downtown Cafe" 
                                value={branchName}
                                onChange={e => setBranchName(e.target.value)}
                                required
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="branchLocation">Location</Label>
                            <Input 
                                id="branchLocation"
                                placeholder="e.g., 123 Main St, Anytown" 
                                value={branchLocation}
                                onChange={e => setBranchLocation(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit">Add Branch</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
