
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from 'next/link';

import { mockOrganizations as initialOrgs } from "@/lib/mock-organizations";
import type { Organization } from "@/lib/types";
import { format } from "date-fns";

export default function OrganizationsPage() {
    const { toast } = useToast();
    const [organizations, setOrganizations] = useState<Organization[]>(initialOrgs);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
    
    const [orgName, setOrgName] = useState('');
    const [orgUserEmail, setOrgUserEmail] = useState('');

    const handleEditClick = (org: Organization) => {
        setCurrentOrg(org);
        setOrgName(org.name);
        setOrgUserEmail(org.ownerEmail);
        setDialogOpen(true);
    };

    const handleAddNewClick = () => {
        setCurrentOrg(null);
        setOrgName('');
        setOrgUserEmail('');
        setDialogOpen(true);
    };
    
    const handleDeleteClick = (orgId: string) => {
        setOrganizations(orgs => orgs.filter(o => o.id !== orgId));
        toast({
            title: "Organization Deleted",
            description: "The organization has been successfully removed.",
        })
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (currentOrg) {
            // Update existing organization
            setOrganizations(orgs => orgs.map(o => o.id === currentOrg.id ? { ...o, name: orgName, ownerEmail: orgUserEmail } : o));
            toast({
                title: "Organization Updated",
                description: `${orgName} has been successfully updated.`,
            });
        } else {
            // Add new organization
            const newOrg: Organization = {
                id: `org-${Date.now()}`,
                name: orgName,
                ownerEmail: orgUserEmail,
                createdAt: new Date().toISOString(),
            };
            setOrganizations(orgs => [newOrg, ...orgs]);
            toast({
                title: "Organization Added",
                description: `${orgName} has been created.`,
            });
        }

        setDialogOpen(false);
        setOrgName('');
        setOrgUserEmail('');
        setCurrentOrg(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Organizations</h1>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddNewClick}>
                            <PlusCircle className="mr-2"/>
                            Add Organization
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{currentOrg ? 'Edit Organization' : 'Add New Organization'}</DialogTitle>
                            <DialogDescription>
                                {currentOrg ? 'Update the details of the existing organization.' : 'Create a new organization and assign an initial user.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="orgName" className="text-right">Name</Label>
                                <Input 
                                    id="orgName"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    className="col-span-3"
                                    placeholder="e.g., The Daily Grind"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="orgUserEmail" className="text-right">Owner Email</Label>
                                <Input
                                    id="orgUserEmail"
                                    type="email"
                                    value={orgUserEmail}
                                    onChange={(e) => setOrgUserEmail(e.target.value)}
                                    className="col-span-3"
                                    placeholder="user@organization.com"
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">{currentOrg ? 'Save Changes' : 'Create Organization'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Organization List</CardTitle>
                    <CardDescription>A list of all partner organizations in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Owner Email</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {organizations.map((org) => (
                                <TableRow key={org.id}>
                                    <TableCell className="font-medium">{org.name}</TableCell>
                                    <TableCell>{org.ownerEmail}</TableCell>
                                    <TableCell>{format(new Date(org.createdAt), "PPP")}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/organizations/${org.id}`} className="cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditClick(org)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive p-2 h-auto font-normal">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the organization
                                                                and all associated data.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteClick(org.id)} className="bg-destructive hover:bg-destructive/90">
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
