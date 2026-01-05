
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, MoreHorizontal, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';

const tagFormSchema = z.object({
	name: z.string().min(2, { message: 'Tag name must be at least 2 characters.' }),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

export default function TagsPage() {
	const { toast } = useToast();
	const [tags, setTags] = useState<ICommonMasterData[]>([]);
	const [meta, setMeta] = useState<IMeta>({ page: 0, limit: 10 });
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [currentTag, setCurrentTag] = useState<ICommonMasterData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const form = useForm<TagFormValues>({
		resolver: zodResolver(tagFormSchema),
		defaultValues: { name: '' },
	});

	const fetchTags = useMemo(
		() => async (page = 0, search = '') => {
			setIsLoading(true);
			const payload: IApiRequest = {
				body: { active: true, name: { contains: search, mode: 'insensitive' } },
				meta: { page, limit: 10 },
			};
			try {
				const response = await MasterDataService.tag.getList(payload);
				setTags(response.body);
				setMeta(response.meta);
			} catch (error) {
				toast({
					variant: 'danger',
					title: 'Error',
					description: 'Could not fetch tags.',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[toast]
	);

	useEffect(() => {
		fetchTags(0, debouncedSearchQuery);
	}, [debouncedSearchQuery, fetchTags]);

	const handlePageChange = (page: number) => {
		fetchTags(page, debouncedSearchQuery);
	};

	const handleEditClick = (tag: ICommonMasterData) => {
		setCurrentTag(tag);
		form.reset({ name: tag.name });
		setDialogOpen(true);
	};

	const handleAddNewClick = () => {
		setCurrentTag(null);
		form.reset({ name: '' });
		setDialogOpen(true);
	};

	const handleDeleteClick = async (tagId: string) => {
		try {
			await MasterDataService.tag.delete(tagId);
			toast({
				variant: 'success',
				title: 'Tag Deleted',
				description: 'The tag has been successfully removed.',
			});
			fetchTags(meta.page, debouncedSearchQuery);
		} catch (error) {
			toast({
				variant: 'danger',
				title: 'Error',
				description: 'Could not delete tag.',
			});
		}
	};

	const handleFormSubmit = async (values: TagFormValues) => {
		setIsSubmitting(true);
		try {
			if (currentTag) {
				await MasterDataService.tag.update({ ...currentTag, ...values });
				toast({ variant: 'success', title: 'Tag Updated', description: `${values.name} has been updated.` });
			} else {
				await MasterDataService.tag.add(values);
				toast({ variant: 'success', title: 'Tag Added', description: `${values.name} has been created.` });
			}
			setDialogOpen(false);
			fetchTags(meta.page, debouncedSearchQuery);
		} catch (error) {
			toast({
				variant: 'danger',
				title: 'Error',
				description: `Could not ${currentTag ? 'update' : 'create'} tag.`,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-start'>
				<div>
					<h1 className='text-xl font-bold'>Manage Tags</h1>
					<p className='text-muted-foreground'>A list of all available tags for offers.</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={handleAddNewClick}>
							<PlusCircle /> Add Tag
						</Button>
					</DialogTrigger>
					<DialogContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
								<DialogHeader>
									<DialogTitle>{currentTag ? 'Edit Tag' : 'Add New Tag'}</DialogTitle>
								</DialogHeader>
								<FormInput
									control={form.control}
									name='name'
									label='Tag Name'
									placeholder='e.g., Vegan'
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
										{isSubmitting ? 'Saving...' : currentTag ? 'Save Changes' : 'Create Tag'}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Tag List</CardTitle>
					<div className='relative mt-2'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search tags...'
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
							) : tags.length > 0 ? (
								tags.map((tag) => (
									<TableRow key={tag.id}>
										<TableCell className='font-medium'>{tag.name}</TableCell>
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
													<DropdownMenuItem onClick={() => handleEditClick(tag)} className='cursor-pointer'>
														<Edit className='mr-2' /> Edit
													</DropdownMenuItem>
													<ConfirmationDialog
														trigger={
															<div className='relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-danger hover:bg-danger/10'>
																<Trash2 className='mr-2' /> Delete
															</div>
														}
														title='Are you sure?'
														description='This will permanently delete the tag.'
														onConfirm={() => handleDeleteClick(tag.id)}
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
										No tags found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
				<CardFooter>
					<Pagination meta={meta} onPageChange={handlePageChange} isLoading={isLoading} noun='Tag' />
				</CardFooter>
			</Card>
		</div>
	);
}
