
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function UsersPage() {
    const { toast } = useToast();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Adding user:', { userName, userEmail });
        toast({
            title: "User Added (Simulated)",
            description: `${userName} has been added.`,
        });
        setUserName('');
        setUserEmail('');
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
             <Card>
                <CardHeader>
                    <CardTitle>Add New User</CardTitle>
                    <CardDescription>Create a new user account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddUser} className="space-y-4 max-w-lg">
                        <div className="space-y-2">
                            <Label htmlFor="userName">User Name</Label>
                            <Input 
                                id="userName" 
                                placeholder="e.g., John Doe" 
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                                required
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="userEmail">User Email</Label>
                            <Input 
                                id="userEmail" 
                                type="email"
                                placeholder="user@example.com" 
                                value={userEmail}
                                onChange={e => setUserEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit">Add User</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
