
'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area";

import { mockOrganizations as initialOrgs } from "@/lib/mock-organizations";
import type { Organization } from "@/lib/types";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormInput } from "@/components/ui/form-input";
import { FormImageUpload } from "@/components/ui/form-image-upload";


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
    const { toast } = useToast();
    const [organizations, setOrganizations] = useState<Organization[]>(initialOrgs);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
    
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

    const handleEditClick = (org: Organization) => {
        setCurrentOrg(org);
        form.reset({
            name: org.name,
            ownerEmail: org.ownerEmail,
            website: org.website || '',
            phone: org.phone || '',
            address: org.address || '',
            logoUrl: null,
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
        toast({
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
            // Update existing organization
            const updatedOrg = { ...currentOrg, ...values, logoUrl };
            setOrganizations(orgs => orgs.map(o => o.id === currentOrg.id ? updatedOrg : o));
            toast({
                title: "Organization Updated",
                description: `${values.name} has been successfully updated.`,
            });
        } else {
            // Add new organization
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
            toast({
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
                            {organizations.map((org) => (
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
                                                        <Eye className="mr-2" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditClick(org)} className="cursor-pointer">
                                                    <Edit className="mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                         <Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive px-2 py-1.5 h-auto font-normal">
                                                            <Trash2 className="mr-2" />
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
                                                            <AlertDialogAction onClick={() => handleDeleteClick(org.id)}>
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
