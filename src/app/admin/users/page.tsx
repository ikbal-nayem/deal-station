
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
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
import { Form, FormMessage } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormMultiSelect } from '@/components/ui/form-multi-select';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ROLES } from '@/constants/auth.constant';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { IUser } from '@/interfaces/auth.interface';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { IRole } from '@/interfaces/master-data.interface';
import { AuthService } from '@/services/api/auth.service';
import { UserService } from '@/services/api/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, MoreHorizontal, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const userFormSchema = z.object({
	firstName: z.string().min(2, 'First name is required'),
	lastName: z.string().min(2, 'Last name is required'),
	email: z.string().email('Invalid email address'),
	phone: z
		.string()
		.regex(/^(?:\+8801|01)[3-9]\d{8}$/, 'Must be a valid Bangladeshi phone number.')
		.optional()
		.or(z.literal('')),
	roles: z.array(z.string()).min(1, 'At least one role is required.'),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const defaultValues = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	roles: [],
};

export default function UsersPage() {
	const { user: authUser } = useAuth();
	const [users, setUsers] = useState<IUser[]>([]);
	const [isLoading, setLoading] = useState(true);
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
	const [currentUser, setCurrentUser] = useState<IUser | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const [allRoles, setAllRoles] = useState<IRole[]>([]);
	const [meta, setMeta] = useState<IMeta>({ page: 0, limit: 10 });

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues,
	});

	const fetchUsers = useCallback(async (page = 0, search = '') => {
		setLoading(true);
		const payload: IApiRequest = {
			body: { ...(search && { searchKey: search }) },
			meta: { page, limit: 10 },
		};
		try {
			const response = await UserService.searchUsers(payload);
			setUsers(response.body);
			setMeta(response.meta);
		} catch (error: any) {
			toast.error({
				title: 'Error',
				description: error.message || 'Could not fetch users.',
			});
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers(0, debouncedSearchQuery);
	}, [debouncedSearchQuery, fetchUsers]);

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const response = await AuthService.getRoles();
				setAllRoles(response.body);
			} catch (error) {}
		};
		fetchRoles();
	}, []);

	const assignableRoles = useMemo(() => {
		if (!authUser) return [];
		if (authUser.roles.includes(ROLES.SUPER_ADMIN) || authUser.roles.includes(ROLES.ADMIN)) {
			return allRoles.filter((role) => [ROLES.ADMIN, ROLES.OPERATOR].includes(role.roleCode as ROLES));
		}
		if (authUser.roles.includes(ROLES.ORG_ADMIN)) {
			return allRoles.filter((role) =>
				[ROLES.ORG_ADMIN, ROLES.ORG_OPERATOR].includes(role.roleCode as ROLES)
			);
		}
		return [];
	}, [allRoles, authUser]);

	useEffect(() => {
		if (!isDialogOpen) {
			form.reset();
			setCurrentUser(null);
		}
	}, [isDialogOpen, form]);

	const handlePageChange = (page: number) => {
		setMeta((prev) => ({ ...prev, page }));
		fetchUsers(page, debouncedSearchQuery);
	};

	const handleEditClick = (user: IUser) => {
		setCurrentUser(user);
		const userRoleIds =
			user.roles
				?.map((roleCode) => allRoles.find((r) => r.roleCode === roleCode)?.id)
				.filter((id): id is string => !!id) || [];

		form.reset({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phone: user.phone,
			roles: userRoleIds,
		});
		setDialogOpen(true);
	};

	const handleAddNewClick = () => {
		setCurrentUser(null);
		form.reset();
		setDialogOpen(true);
	};

	const handleDeleteClick = async (userId: string) => {
		try {
			await UserService.deleteUser(userId);
			toast.error({
				title: 'User Deleted',
				description: 'The user has been successfully removed.',
			});
			fetchUsers(meta.page, debouncedSearchQuery);
		} catch (error: any) {
			toast.error({
				title: 'Error',
				description: error.message || 'Could not delete user.',
			});
		}
	};

	const handleFormSubmit = async (values: UserFormValues) => {
		setSubmitting(true);
		const payload = {
			...values,
			roles: values.roles.map((roleId) => allRoles.find((r) => r.id === roleId)?.roleCode),
		};
		try {
			if (currentUser) {
				await UserService.updateUser({ id: currentUser.id, ...payload });
				toast.success({ title: 'User Updated', description: `${values.firstName} has been updated.` });
			} else {
				await UserService.createUser(payload);
				toast.success({ title: 'User Added', description: `${values.firstName} has been created.` });
			}
			setDialogOpen(false);
			fetchUsers(meta.page, debouncedSearchQuery);
		} catch (error: any) {
			toast.error({
				title: 'Error',
				description: error.message || `Could not ${currentUser ? 'update' : 'create'} user.`,
			});
		} finally {
			setSubmitting(false);
		}
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
										{currentUser ? "Update the user's details." : 'Create a new user and assign them roles.'}
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
									placeholder='01...'
								/>

								<FormMultiSelect
									control={form.control}
									name='roles'
									label='Roles'
									required
									placeholder='Select roles...'
									options={assignableRoles}
									getOptionValue={(option) => option.id}
									getOptionLabel={(option) => option.name}
								/>

								<DialogFooter>
									<DialogClose asChild>
										<Button type='button' variant='secondary' disabled={isSubmitting}>
											Cancel
										</Button>
									</DialogClose>
									<Button type='submit' disabled={isSubmitting}>
										{isSubmitting ? 'Saving...' : currentUser ? 'Save Changes' : 'Create User'}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>
			<Card>
				<CardHeader className='pb-0'>
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
								<TableHead className='text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={4} className='text-center'>
										Loading...
									</TableCell>
								</TableRow>
							) : users.length > 0 ? (
								users.map((user) => (
									<TableRow key={user.id}>
										<TableCell className='font-medium'>
											{user.firstName} {user.lastName}
										</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											<div className='flex flex-wrap gap-1'>
												{user.roles.map((role) => (
													<Badge key={role} variant='secondary'>
														{role?.replace(/_/g, ' ')}
													</Badge>
												))}
											</div>
										</TableCell>
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
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} className='text-center'>
										No users found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
				<CardFooter>
					<Pagination meta={meta} onPageChange={handlePageChange} noun='User' />
				</CardFooter>
			</Card>
		</div>
	);
}
