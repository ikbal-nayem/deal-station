
'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ROLES } from '@/constants/auth.constant';
import { useToast } from '@/hooks/use-toast';
import { IUser } from '@/interfaces/auth.interface';
import { mockOrganizations } from '@/lib/mock-organizations';
import { mockUsers as initialUsers } from '@/lib/mock-users';
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const userFormSchema = z
	.object({
		firstName: z.string().min(2, 'First name is required'),
		lastName: z.string().min(2, 'Last name is required'),
		email: z.string().email('Invalid email address'),
		phone: z.string().optional(),
		role: z.nativeEnum(ROLES),
		organizationId: z.string().optional(),
	})
	.refine((data) => data.role !== ROLES.OPERATOR || !!data.organizationId, {
		message: 'Organization is required for this role',
		path: ['organizationId'],
	});

type UserFormValues = z.infer<typeof userFormSchema>;

const mapToIUser = (user: UserFormValues, id?: string): IUser => ({
	id: id || `user-${Date.now()}`,
	username: user.email,
	email: user.email,
	firstName: user.firstName,
	lastName: user.lastName,
	phone: user.phone,
	roles: [user.role],
	organizationId: user.role === ROLES.OPERATOR ? user.organizationId : undefined,
});

export default function UsersPage() {
	const { toast } = useToast();
	const [users, setUsers] = useState<IUser[]>(initialUsers);
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState<IUser | null>(null);

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			role: ROLES.USER,
			organizationId: '',
		},
	});

	const watchedRole = form.watch('role');

	useEffect(() => {
		if (!isDialogOpen) {
			form.reset();
			setCurrentUser(null);
		}
	}, [isDialogOpen, form]);

	const handleEditClick = (user: IUser) => {
		setCurrentUser(user);
		form.reset({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phone: user.phone || '',
			role: user.roles[0],
			organizationId: user.organizationId || '',
		});
		setDialogOpen(true);
	};

	const handleAddNewClick = () => {
		setCurrentUser(null);
		form.reset();
		setDialogOpen(true);
	};

	const handleDeleteClick = (userId: string) => {
		setUsers((users) => users.filter((u) => u.id !== userId));
		toast({
			title: 'User Deleted',
			description: 'The user has been successfully removed.',
		});
	};

	const handleFormSubmit = (values: UserFormValues) => {
		if (currentUser) {
			setUsers((users) => users.map((u) => (u.id === currentUser.id ? { ...mapToIUser(values, u.id), id: u.id } : u)));
			toast({ title: 'User Updated', description: `${values.firstName} has been updated.` });
		} else {
			const newUser = mapToIUser(values);
			setUsers((users) => [newUser, ...users]);
			toast({ title: 'User Added', description: `${values.firstName} has been created.` });
		}
		setDialogOpen(false);
	};

	const getOrgName = (orgId?: string) => {
		if (!orgId) return '-';
		return mockOrganizations.find((o) => o.id === orgId)?.name || 'Unknown Org';
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-start'>
				<div>
					<h1 className='text-xl font-bold'>Manage Users</h1>
					<p className='text-muted-foreground'>Add, edit, or remove users from the system.</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={handleAddNewClick}>
							<PlusCircle /> Add User
						</Button>
					</DialogTrigger>
					<DialogContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
								<DialogHeader>
									<DialogTitle>{currentUser ? 'Edit User' : 'Add New User'}</DialogTitle>
									<DialogDescription>
										{currentUser ? "Update the user's details." : 'Create a new user and assign them a role.'}
									</DialogDescription>
								</DialogHeader>
								<div className='grid grid-cols-2 gap-4'>
									<FormInput
										control={form.control}
										name='firstName'
										label='First Name'
										placeholder='John'
										required
									/>
									<FormInput
										control={form.control}
										name='lastName'
										label='Last Name'
										placeholder='Doe'
										required
									/>
								</div>
								<FormInput
									control={form.control}
									name='email'
									label='Email'
									type='email'
									placeholder='user@example.com'
									required
								/>
								<FormInput
									control={form.control}
									name='phone'
									label='Phone (Optional)'
									placeholder='555-123-4567'
								/>

								<FormSelect
									control={form.control}
									name='role'
									label='Role'
									placeholder='Select a role'
									required
									options={Object.values(ROLES)}
									getOptionValue={(option) => option}
									getOptionLabel={(option) => option.replace(/_/g, ' ')}
								/>

								{watchedRole === ROLES.OPERATOR && (
									<FormSelect
										control={form.control}
										name='organizationId'
										label='Organization'
										placeholder='Select an organization'
										required
										options={mockOrganizations}
										getOptionValue={(org) => org.id}
										getOptionLabel={(org) => org.name}
									/>
								)}

								<DialogFooter>
									<DialogClose asChild>
										<Button type='button' variant='secondary'>
											Cancel
										</Button>
									</DialogClose>
									<Button type='submit'>{currentUser ? 'Save Changes' : 'Create User'}</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>
			<Card>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Organization</TableHead>
								<TableHead className='text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell className='font-medium'>
										{user.firstName} {user.lastName}
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Badge variant='secondary'>{user.roles[0]?.replace(/_/g, ' ')}</Badge>
									</TableCell>
									<TableCell>{getOrgName(user.organizationId)}</TableCell>
									<TableCell className='text-right'>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost' className='h-8 w-8 p-0'>
													<span className='sr-only'>Open menu</span>
													<MoreHorizontal />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem onClick={() => handleEditClick(user)} className='cursor-pointer'>
													<Edit className='mr-2' /> Edit
												</DropdownMenuItem>
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button
															variant='ghost'
															className='w-full justify-start text-sm text-danger hover:text-danger px-2 py-1.5 h-auto font-normal'
														>
															<Trash2 className='mr-2' /> Delete
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Are you sure?</AlertDialogTitle>
															<AlertDialogDescription>
																This will permanently delete the user.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction onClick={() => handleDeleteClick(user.id!)}>
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
