
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, UserPlus, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

import { mockOrganizations } from '@/lib/mock-organizations';
import { mockUsers as initialUsers } from '@/lib/mock-users';
import { mockOffers } from '@/lib/mock-data';
import type { Organization, User, Offer } from '@/lib/types';
import { format } from 'date-fns';

export default function OrganizationDetailPage() {
    const params = useParams();
    const orgId = params.orgId as string;
    const { toast } = useToast();

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);

    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserName, setNewUserName] = useState('');

    useEffect(() => {
        const foundOrg = mockOrganizations.find(o => o.id === orgId);
        if (foundOrg) {
            setOrganization(foundOrg);
            setUsers(initialUsers.filter(u => u.organizationId === orgId));
            setOffers(mockOffers.filter(o => o.organizationId === orgId));
        }
    }, [orgId]);

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!organization) return;
        
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: newUserName,
            email: newUserEmail,
            role: 'Organization',
            organizationId: organization.id,
        };

        setUsers(currentUsers => [...currentUsers, newUser]);
        toast({
            title: "User Added",
            description: `${newUserName} has been added to ${organization.name}.`,
        });
        setNewUserName('');
        setNewUserEmail('');
    };

    const handleRemoveUser = (userId: string) => {
        const userToRemove = users.find(u => u.id === userId);
        if (!userToRemove) return;

        setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
        toast({
            title: "User Removed",
            description: `${userToRemove.name} has been removed from the organization.`,
        });
    };

    if (!organization) {
        return (
            <div className="p-6">
                <Link href="/admin/organizations" className="flex items-center text-sm text-muted-foreground hover:underline mb-4">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Organizations
                </Link>
                <h1 className="text-2xl font-bold">Organization not found</h1>
                <p>The organization you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <div>
            <Link href="/admin/organizations" className="flex items-center text-sm text-muted-foreground hover:underline mb-4">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Organizations
            </Link>

            <div className="mb-6">
                <h1 className="text-3xl font-bold">{organization.name}</h1>
                <p className="text-muted-foreground">Owner: {organization.ownerEmail}</p>
                <p className="text-sm text-muted-foreground">Joined: {format(new Date(organization.createdAt), 'PPP')}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Users</CardTitle>
                        <CardDescription>Add or remove users for this organization.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddUser} className="flex items-end gap-2 mb-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="newUserName">Name</Label>
                                <Input
                                    id="newUserName"
                                    placeholder="John Doe"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="newUserEmail">Email</Label>
                                <Input
                                    id="newUserEmail"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit">
                                <UserPlus className="mr-2 h-4 w-4" /> Add
                            </Button>
                        </form>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-right">
                                           <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will remove {user.name} from the organization. This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleRemoveUser(user.id)} className="bg-destructive hover:bg-destructive/90">
                                                            Remove User
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {users.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">No users found for this organization.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Offer Summary & History</CardTitle>
                        <CardDescription>An overview of the offers created by this organization.</CardDescription>
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
                            <p className="text-center text-muted-foreground py-4">This organization hasn't created any offers yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
