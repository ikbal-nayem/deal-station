'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
	Dialog,
	DialogClose,
	DialogContent,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { IApiRequest } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const categoryFormSchema = z.object({
	name: z.string().min(2, { message: 'Category name must be at least 2 characters.' }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const initPayload: IApiRequest = {
	body: { active: true },
	meta: { page: 0, limit: 20 },
};

export default function CategoriesPage() {
	const [categories, setCategories] = useState<ICommonMasterData[]>([]);
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [currentCategory, setCurrentCategory] = useState<ICommonMasterData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: { name: '' },
	});

	const fetchCategories = async () => {
		setIsLoading(true);
		try {
			const response = await MasterDataService.category.getList(initPayload);
			setCategories(response.body);
		} catch (error: any) {
			toast.error({
				title: 'Error',
				description: error.message || 'Could not fetch categories.',
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleEditClick = (category: ICommonMasterData) => {
		setCurrentCategory(category);
		form.reset({ name: category.name });
		setDialogOpen(true);
	};

	const handleAddNewClick = () => {
		setCurrentCategory(null);
		form.reset({ name: '' });
		setDialogOpen(true);
	};

	const handleDeleteClick = async (categoryId: string) => {
		try {
			await MasterDataService.category.delete(categoryId);
			toast.success({
				title: 'Category Deleted',
				description: 'The category has been successfully removed.',
			});
			fetchCategories();
		} catch (error) {
			toast.error({
				title: 'Error',
				description: 'Could not delete category.',
			});
		}
	};

	const handleFormSubmit = async (values: CategoryFormValues) => {
		setIsSubmitting(true);
		try {
			if (currentCategory) {
				await MasterDataService.category.update({ ...currentCategory, ...values });
				toast({
					variant: 'success',
					title: 'Category Updated',
					description: `${values.name} has been updated.`,
				});
			} else {
				await MasterDataService.category.add(values);
				toast({
					variant: 'success',
					title: 'Category Added',
					description: `${values.name} has been created.`,
				});
			}
			setDialogOpen(false);
			fetchCategories();
		} catch (error) {
			toast({
				variant: 'danger',
				title: 'Error',
				description: `Could not ${currentCategory ? 'update' : 'create'} category.`,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-start'>
				<div>
					<h1 className='text-xl font-bold'>Manage Categories</h1>
					<p className='text-muted-foreground'>A list of all offer categories.</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={handleAddNewClick}>
							<PlusCircle /> Add Category
						</Button>
					</DialogTrigger>
					<DialogContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
								<DialogHeader>
									<DialogTitle>{currentCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
								</DialogHeader>
								<FormInput
									control={form.control}
									name='name'
									label='Category Name'
									placeholder='e.g., Food & Drink'
									required
									disabled={isSubmitting}
								/>
								<DialogFooter>
									<DialogClose asChild>
										<Button type='button' variant='secondary' disabled={isSubmitting}>
											Cancel
										</Button>
									</DialogClose>
									<Button type='submit' disabled={isSubmitting}>
										{isSubmitting ? 'Saving...' : currentCategory ? 'Save Changes' : 'Create Category'}
									</Button>
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
								<TableHead className='text-right w-[100px]'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={2} className='text-center'>
										Loading...
									</TableCell>
								</TableRow>
							) : categories.length > 0 ? (
								categories.map((cat) => (
									<TableRow key={cat.id}>
										<TableCell className='font-medium'>{cat.name}</TableCell>
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
													<DropdownMenuItem onClick={() => handleEditClick(cat)} className='cursor-pointer'>
														<Edit className='mr-2' /> Edit
													</DropdownMenuItem>
													<ConfirmationDialog
														trigger={
															<div className='relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-danger hover:bg-danger/10'>
																<Trash2 className='mr-2' /> Delete
															</div>
														}
														title='Are you sure?'
														description='This will permanently delete the category.'
														onConfirm={() => handleDeleteClick(cat.id)}
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
									<TableCell colSpan={2} className='text-center'>
										No categories found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
