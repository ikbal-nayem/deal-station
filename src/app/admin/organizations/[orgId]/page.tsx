
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, UserPlus, Trash2, Globe, Phone, Mail, Building, GitBranchPlus, Edit, MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { mockOrganizations } from '@/lib/mock-organizations';
import { mockUsers as initialUsers } from '@/lib/mock-users';
import { mockOffers } from '@/lib/mock-data';
import type { Organization, User, Offer, Branch } from '@/lib/types';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FormInput } from '@/components/ui/form-input';

const userFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});
type UserFormValues = z.infer<typeof userFormSchema>;

const branchFormSchema = z.object({
  name: z.string().min(2, "Branch name is required"),
  address: z.string().min(5, "Address is required"),
});
type BranchFormValues = z.infer<typeof branchFormSchema>;

export default function OrganizationDetailPage() {
    const params = useParams();
    const orgId = params.orgId as string;
    const { toast } = useToast();

    const [organization, setOrganization] = useState<Organization | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);

    const [isUserDialogOpen, setUserDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isBranchDialogOpen, setBranchDialogOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);

    const userForm = useForm<UserFormValues>({ resolver: zodResolver(userFormSchema) });
    const branchForm = useForm<BranchFormValues>({ resolver: zodResolver(branchFormSchema) });

    useEffect(() => {
        const foundOrg = mockOrganizations.find(o => o.id === orgId);
        if (foundOrg) {
            setOrganization(foundOrg);
            setUsers(initialUsers.filter(u => u.organizationId === orgId));
            setOffers(mockOffers.filter(o => o.organizationId === orgId));
            // Mock branches for the org
            setBranches([
                { id: 'branch-1', name: `${foundOrg.name} - Main`, address: foundOrg.address || '123 Main St', organizationId: orgId },
                { id: 'branch-2', name: `${foundOrg.name} - Downtown`, address: '456 Downtown Ave', organizationId: orgId },
            ]);
        }
    }, [orgId]);

    // User handlers
    const handleAddNewUser = () => {
        setCurrentUser(null);
        userForm.reset({ firstName: '', lastName: '', email: '', phone: '' });
        setUserDialogOpen(true);
    };

    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        userForm.reset({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone || '' });
        setUserDialogOpen(true);
    };

    const handleUserFormSubmit = (values: UserFormValues) => {
        if (currentUser) {
            setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...values } : u));
            toast({ title: "User Updated", description: "The user's details have been updated." });
        } else {
            const newUser: User = { id: `user-${Date.now()}`, ...values, role: 'Organization', organizationId: orgId };
            setUsers([newUser, ...users]);
            toast({ title: "User Added", description: `${values.firstName} has been added.` });
        }
        setUserDialogOpen(false);
    };

    const handleRemoveUser = (userId: string) => {
        setUsers(users.filter(u => u.id !== userId));
        toast({ title: "User Removed", description: "The user has been removed." });
    };

    // Branch handlers
    const handleAddNewBranch = () => {
        setCurrentBranch(null);
        branchForm.reset({ name: '', address: '' });
        setBranchDialogOpen(true);
    };

    const handleEditBranch = (branch: Branch) => {
        setCurrentBranch(branch);
        branchForm.reset({ name: branch.name, address: branch.address });
        setBranchDialogOpen(true);
    };

    const handleBranchFormSubmit = (values: BranchFormValues) => {
        if (currentBranch) {
            setBranches(branches.map(b => b.id === currentBranch.id ? { ...b, ...values } : b));
            toast({ title: "Branch Updated", description: "The branch has been updated." });
        } else {
            const newBranch: Branch = { id: `branch-${Date.now()}`, ...values, organizationId: orgId };
            setBranches([newBranch, ...branches]);
            toast({ title: "Branch Added", description: `${values.name} has been added.` });
        }
        setBranchDialogOpen(false);
    };

    const handleRemoveBranch = (branchId: string) => {
        setBranches(branches.filter(b => b.id !== branchId));
        toast({ title: "Branch Removed", description: "The branch has been removed." });
    };


    if (!organization) {
        return <div className="p-6 text-center">Loading organization details...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <Button variant="ghost" asChild className="-ml-4 mb-2">
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
                        <p className="text-muted-foreground">Detailed view and management portal.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 flex flex-col gap-6">
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
                </div>
                 <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* User Management Card */}
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-start">
                           <div>
                            <CardTitle>Manage Users</CardTitle>
                            <CardDescription>Add, edit, or remove users for this organization.</CardDescription>
                           </div>
                           <Dialog open={isUserDialogOpen} onOpenChange={setUserDialogOpen}>
                               <DialogTrigger asChild><Button onClick={handleAddNewUser}><UserPlus /> Add User</Button></DialogTrigger>
                               <DialogContent>
                                   <Form {...userForm}>
                                       <form onSubmit={userForm.handleSubmit(handleUserFormSubmit)} className="space-y-4">
                                            <DialogHeader><DialogTitle>{currentUser ? 'Edit User' : 'Add New User'}</DialogTitle></DialogHeader>
                                            <FormInput control={userForm.control} name="firstName" label="First Name" placeholder="John" />
                                            <FormInput control={userForm.control} name="lastName" label="Last Name" placeholder="Doe" />
                                            <FormInput control={userForm.control} name="email" label="Email" type="email" placeholder="user@example.com" />
                                            <FormInput control={userForm.control} name="phone" label="Phone (Optional)" placeholder="555-123-4567" />
                                            <DialogFooter>
                                                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                                <Button type="submit">{currentUser ? 'Save Changes' : 'Add User'}</Button>
                                            </DialogFooter>
                                       </form>
                                   </Form>
                               </DialogContent>
                           </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.phone || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditUser(user)}><Edit className="mr-2"/> Edit</DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild><Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive px-2 py-1.5 h-auto font-normal"><Trash2 className="mr-2"/> Delete</Button></AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will remove {user.firstName} from the organization.</AlertDialogDescription></AlertDialogHeader>
                                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleRemoveUser(user.id)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction></AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                 </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {users.length === 0 && <p className="text-center text-muted-foreground py-4">No users found.</p>}
                        </CardContent>
                    </Card>

                    {/* Branch Management Card */}
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-start">
                           <div>
                            <CardTitle>Manage Branches</CardTitle>
                            <CardDescription>Manage the organization's locations.</CardDescription>
                           </div>
                            <Dialog open={isBranchDialogOpen} onOpenChange={setBranchDialogOpen}>
                                <DialogTrigger asChild><Button onClick={handleAddNewBranch}><PlusCircle /> Add Branch</Button></DialogTrigger>
                                <DialogContent>
                                   <Form {...branchForm}>
                                       <form onSubmit={branchForm.handleSubmit(handleBranchFormSubmit)} className="space-y-4">
                                            <DialogHeader><DialogTitle>{currentBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle></DialogHeader>
                                            <FormInput control={branchForm.control} name="name" label="Branch Name" placeholder="e.g., Downtown Cafe" />
                                            <FormInput control={branchForm.control} name="address" label="Address" placeholder="123 Main St, Anytown, USA" />
                                            <DialogFooter>
                                                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                                <Button type="submit">{currentBranch ? 'Save Changes' : 'Add Branch'}</Button>
                                            </DialogFooter>
                                       </form>
                                   </Form>
                               </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Address</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {branches.map(branch => (
                                        <TableRow key={branch.id}>
                                            <TableCell>{branch.name}</TableCell>
                                            <TableCell>{branch.address}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditBranch(branch)}><Edit className="mr-2"/> Edit</DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild><Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive px-2 py-1.5 h-auto font-normal"><Trash2 className="mr-2"/> Delete</Button></AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the branch.</AlertDialogDescription></AlertDialogHeader>
                                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleRemoveBranch(branch.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                 </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {branches.length === 0 && <p className="text-center text-muted-foreground py-4">No branches found.</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Offer Summary</CardTitle>
                            <CardDescription>An overview of offers created by {organization.name}.</CardDescription>
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
                 </div>
            </div>
        </div>
    );
}
