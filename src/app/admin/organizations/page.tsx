
'use client';

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Eye, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormInput } from "@/components/ui/form-input";
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { mockOrganizations as initialOrgs } from "@/lib/mock-organizations";
import type { Organization } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { IMeta } from "@/interfaces/common.interface";

const orgFormSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
  ownerEmail: z.string().email({ message: "Please enter a valid email address." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.any().nullable(),
});

type OrgFormValues = z.infer<typeof orgFormSchema>;

export default function OrganizationsPage() {
    
    const [organizations, setOrganizations] = useState<Organization[]>(initialOrgs);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [meta, setMeta] = useState<IMeta>({ page: 0, limit: 10, totalRecords: initialOrgs.length, totalPageCount: Math.ceil(initialOrgs.length / 10) });
    
    const form = useForm<OrgFormValues>({
        resolver: zodResolver(orgFormSchema),
        defaultValues: {
            name: '',
            ownerEmail: '',
            website: '',
            phone: '',
            address: '',
            logoUrl: null,
        }
    });

    const paginatedOrgs = useMemo(() => {
        const filtered = organizations.filter(org => org.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
        setMeta(prev => ({...prev, totalRecords: filtered.length, totalPageCount: Math.ceil(filtered.length / 10)}));
        const start = meta.page * meta.limit;
        const end = start + meta.limit;
        return filtered.slice(start, end);
    }, [organizations, debouncedSearchQuery, meta.page, meta.limit]);

    useEffect(() => {
        if (!isDialogOpen) {
            form.reset({
                name: '',
                ownerEmail: '',
                website: '',
                phone: '',
                address: '',
                logoUrl: null
            });
            setCurrentOrg(null);
        }
    }, [isDialogOpen, form]);

    const handlePageChange = (page: number) => {
        setMeta(prev => ({ ...prev, page }));
    };

    const handleEditClick = (org: Organization) => {
        setCurrentOrg(org);
        form.reset({
            name: org.name,
            ownerEmail: org.ownerEmail,
            website: org.website || '',
            phone: org.phone || '',
            address: org.address || '',
            logoUrl: null, // We handle the existing URL separately
        });
        setDialogOpen(true);
    };

    const handleAddNewClick = () => {
        setCurrentOrg(null);
        form.reset();
        setDialogOpen(true);
    };
    
    const handleDeleteClick = (orgId: string) => {
        setOrganizations(orgs => orgs.filter(o => o.id !== orgId));
        toast.success({
            title: "Organization Deleted",
            description: "The organization has been successfully removed.",
        })
    };

    const handleFormSubmit = (values: OrgFormValues) => {
        let logoUrl = currentOrg?.logoUrl; // Keep current logo by default
        if (values.logoUrl && values.logoUrl.length > 0) {
           logoUrl = URL.createObjectURL(values.logoUrl[0]);
        } else if (values.logoUrl === null) {
            logoUrl = undefined;
        }


        if (currentOrg) {
            const updatedOrg = { ...currentOrg, ...values, logoUrl };
            setOrganizations(orgs => orgs.map(o => o.id === currentOrg.id ? updatedOrg : o));
            toast.success({
                title: "Organization Updated",
                description: `${values.name} has been successfully updated.`,
            });
        } else {
            const newOrg: Organization = {
                id: `org-${Date.now()}`,
                createdAt: new Date().toISOString(),
                ...values,
                website: values.website || undefined,
                phone: values.phone || undefined,
                address: values.address || undefined,
                logoUrl,
            };
            setOrganizations(orgs => [newOrg, ...orgs]);
            toast.success({
                title: "Organization Added",
                description: `${values.name} has been created.`,
            });
        }

        setDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-bold">Manage Organizations</h1>
                    <p className="text-muted-foreground">A list of all partner organizations in the system.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddNewClick}>
                            <PlusCircle />
                            Add Organization
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                                <DialogHeader>
                                    <DialogTitle>{currentOrg ? 'Edit Organization' : 'Add New Organization'}</DialogTitle>
                                    <DialogDescription>
                                        {currentOrg ? 'Update the details of the existing organization.' : 'Create a new organization and assign an initial user.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="max-h-[70vh] -mr-6 pr-6">
                                <div className="space-y-4 py-4 ">
                                     <FormImageUpload
                                        control={form.control}
                                        name="logoUrl"
                                        label="Organization Logo"
                                        currentImage={currentOrg?.logoUrl}
                                        fallbackText={currentOrg?.name?.charAt(0) || '?'}
                                        shape="square"
                                     />
                                     <FormInput
                                        control={form.control}
                                        name="name"
                                        label="Name"
                                        placeholder="e.g., The Daily Grind"
                                        required
                                    />
                                    <FormInput
                                        control={form.control}
                                        name="ownerEmail"
                                        label="Owner Email"
                                        placeholder="user@organization.com"
                                        required
                                    />
                                    <FormInput
                                        control={form.control}
                                        name="website"
                                        label="Website"
                                        placeholder="https://example.com"
                                    />
                                    <FormInput
                                        control={form.control}
                                        name="phone"
                                        label="Phone"
                                        placeholder="555-123-4567"
                                    />
                                    <FormInput
                                        control={form.control}
                                        name="address"
                                        label="Address"
                                        placeholder="123 Main St, Anytown, USA"
                                    />
                                </div>
                                </ScrollArea>
                                <DialogFooter className="pt-4">
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">{currentOrg ? 'Save Changes' : 'Create Organization'}</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
				<CardHeader>
					<CardTitle>Organization List</CardTitle>
					<div className='relative mt-2'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search organizations...'
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
                                <TableHead className="hidden md:table-cell">Owner Email</TableHead>
                                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                                <TableHead className="hidden lg:table-cell">Created At</TableHead>
                                <TableHead className="text-right w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedOrgs.map((org) => (
                                <TableRow key={org.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={org.logoUrl} alt={org.name} />
                                                <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{org.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{org.ownerEmail}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{org.phone}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{format(new Date(org.createdAt), "PPP")}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal />
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
                                                <DropdownMenuItem onClick={() => handleEditClick(org)} className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <ConfirmationDialog
														trigger={
															<div className='relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-danger hover:bg-danger/10'>
																<Trash2 className='mr-2 h-4 w-4' /> Delete
															</div>
														}
														title='Are you sure?'
														description='This action cannot be undone. This will permanently delete the organization and all associated data.'
														onConfirm={() => handleDeleteClick(org.id)}
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
                    <Pagination meta={meta} onPageChange={handlePageChange} noun="Organization" />
                </CardFooter>
            </Card>
        </div>
    );
}
