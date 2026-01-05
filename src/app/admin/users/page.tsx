
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ROLES } from '@/constants/auth.constant';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { IUser } from '@/interfaces/auth.interface';
import { mockOrganizations } from '@/lib/mock-organizations';
import { mockUsers as initialUsers } from '@/lib/mock-users';
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, MoreHorizontal, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { IMeta } from '@/interfaces/common.interface';

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
    const { user: authUser } = useAuth();
	const [users, setUsers] = useState<IUser[]>(initialUsers);
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState<IUser | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const [meta, setMeta] = useState<IMeta>({ page: 0, limit: 10, totalRecords: initialUsers.length, totalPageCount: Math.ceil(initialUsers.length / 10) });

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

    const paginatedUsers = useMemo(() => {
        const filtered = users.filter(user => 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
        setMeta(prev => ({...prev, totalRecords: filtered.length, totalPageCount: Math.ceil(filtered.length / 10)}));
        const start = meta.page * meta.limit;
        const end = start + meta.limit;
        return filtered.slice(start, end);
    }, [users, debouncedSearchQuery, meta.page, meta.limit]);

	useEffect(() => {
		if (!isDialogOpen) {
			form.reset();
			setCurrentUser(null);
		}
	}, [isDialogOpen, form]);

    const handlePageChange = (page: number) => {
        setMeta(prev => ({...prev, page}));
    }

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
									options={Object.values(ROLES).filter(role => authUser?.roles.includes(ROLES.SUPER_ADMIN) || role !== ROLES.SUPER_ADMIN)}
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
                <CardHeader>
					<CardTitle>User List</CardTitle>
					<div className='relative mt-2'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search users...'
							className='pl-10'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</CardHeader>
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
							{paginatedUsers.map((user) => (
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
													<Edit className='mr-2 h-4 w-4' /> Edit
												</DropdownMenuItem>
                                                <DropdownMenuSeparator />
												<ConfirmationDialog
													trigger={
														<div className='relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-danger hover:bg-danger/10'>
															<Trash2 className='mr-2 h-4 w-4' /> Delete
														</div>
													}
													title='Are you sure?'
													description='This action cannot be undone. This will permanently delete the user.'
													onConfirm={() => handleDeleteClick(user.id!)}
													confirmText='Delete'
													confirmVariant='danger'
												/>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
                 <CardFooter>
                    <Pagination meta={meta} onPageChange={handlePageChange} noun="User" />
                </CardFooter>
			</Card>
		</div>
	);
}
