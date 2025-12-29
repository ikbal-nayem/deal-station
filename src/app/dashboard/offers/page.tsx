
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function OrgOffersPage() {
    const { toast } = useToast();
    const [offerTitle, setOfferTitle] = useState('');
    const [offerDescription, setOfferDescription] = useState('');

    const handleAddOffer = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Adding offer:', { offerTitle, offerDescription });
        toast({
            title: "Offer Added (Simulated)",
            description: `${offerTitle} has been created.`,
        });
        setOfferTitle('');
        setOfferDescription('');
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Your Offers</h1>
             <Card>
                <CardHeader>
                    <CardTitle>Add New Offer</CardTitle>
                    <CardDescription>Create a new promotional offer for your organization.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddOffer} className="space-y-4 max-w-lg">
                        <div className="space-y-2">
                            <Label htmlFor="offerTitle">Offer Title</Label>
                            <Input 
                                id="offerTitle" 
                                placeholder="e.g., 20% Off All Coffees" 
                                value={offerTitle}
                                onChange={e => setOfferTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="offerDescription">Description</Label>
                            <Textarea
                                id="offerDescription"
                                placeholder="Describe the offer..."
                                value={offerDescription}
                                onChange={e => setOfferDescription(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit">Add Offer</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
