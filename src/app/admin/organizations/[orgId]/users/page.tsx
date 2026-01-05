
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockUsers as initialUsers } from '@/lib/mock-users';
import { IUser } from '@/interfaces/auth.interface';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FormInput } from '@/components/ui/form-input';
import { ROLES } from '@/constants/auth.constant';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

const userFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});
type UserFormValues = z.infer<typeof userFormSchema>;

export default function OrganizationUsersPage() {
    const params = useParams();
    const orgId = params.orgId as string;
    const { toast } = useToast();

    const [users, setUsers] = useState<IUser[]>([]);
    const [isUserDialogOpen, setUserDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);

    const userForm = useForm<UserFormValues>({ resolver: zodResolver(userFormSchema) });

    useEffect(() => {
        if (orgId) {
            setUsers(initialUsers.filter(u => u.organizationId === orgId));
        }
    }, [orgId]);

    const handleAddNewUser = () => {
        setCurrentUser(null);
        userForm.reset({ firstName: '', lastName: '', email: '', phone: '' });
        setUserDialogOpen(true);
    };

    const handleEditUser = (user: IUser) => {
        setCurrentUser(user);
        userForm.reset({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone || '' });
        setUserDialogOpen(true);
    };

    const handleUserFormSubmit = (values: UserFormValues) => {
        if (currentUser) {
            setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...values, username: values.email } : u));
            toast({ title: "User Updated", description: "The user's details have been updated." });
        } else {
            const newUser: IUser = {
				id: `user-${Date.now()}`,
				username: values.email,
				roles: [ROLES.USER],
				...values,
				organizationId: orgId,
			};
            setUsers([newUser, ...users]);
            toast({ title: "User Added", description: `${values.firstName} has been added.` });
        }
        setUserDialogOpen(false);
    };

    const handleRemoveUser = (userId: string) => {
        setUsers(users.filter(u => u.id !== userId));
        toast({ title: "User Removed", description: "The user has been removed." });
    };

    return (
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
                                <FormInput control={userForm.control} name="firstName" label="First Name" placeholder="John" required />
                                <FormInput control={userForm.control} name="lastName" label="Last Name" placeholder="Doe" required />
                                <FormInput control={userForm.control} name="email" label="Email" type="email" placeholder="user@example.com" required/>
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
                                            <DropdownMenuItem onClick={() => handleEditUser(user)} className="cursor-pointer"><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <ConfirmationDialog
                                                trigger={<div className='relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-danger hover:bg-danger/10'><Trash2 className="mr-2 h-4 w-4"/> Delete</div>}
                                                title="Are you sure?"
                                                description={`This will remove ${user.firstName} from the organization.`}
                                                onConfirm={() => handleRemoveUser(user.id!)}
                                                confirmText='Remove'
                                                confirmVariant='danger'
                                            />
                                        </DropdownMenuContent>
                                     </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {users.length === 0 && <p className="text-center text-muted-foreground py-4">No users found for this organization.</p>}
            </CardContent>
        </Card>
    );
}
