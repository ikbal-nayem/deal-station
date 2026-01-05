
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Edit, MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const tagFormSchema = z.object({
	name: z.string().min(2, { message: 'Tag name must be at least 2 characters.' }),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

export default function TagsPage() {
	const { toast } = useToast();
	const [tags, setTags] = useState<ICommonMasterData[]>([]);
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [currentTag, setCurrentTag] = useState<ICommonMasterData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<TagFormValues>({
		resolver: zodResolver(tagFormSchema),
		defaultValues: { name: '' },
	});

	const fetchTags = async () => {
		setIsLoading(true);
		try {
			const response = await MasterDataService.tag.getList({ body: { active: true } });
			setTags(response.body);
		} catch (error) {
			toast({
				variant: 'danger',
				title: 'Error',
				description: 'Could not fetch tags.',
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTags();
	}, []);

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
			fetchTags();
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
			fetchTags();
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
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<div className='relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-danger hover:bg-danger/10'>
																<Trash2 className='mr-2' /> Delete
															</div>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>Are you sure?</AlertDialogTitle>
																<AlertDialogDescription>
																	This will permanently delete the tag.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction onClick={() => handleDeleteClick(tag.id)}>
																	Delete
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
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
			</Card>
		</div>
	);
}
