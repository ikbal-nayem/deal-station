
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockOrganizations } from '@/lib/mock-organizations';
import type { Branch } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FormInput } from '@/components/ui/form-input';

const branchFormSchema = z.object({
  name: z.string().min(2, "Branch name is required"),
  address: z.string().min(5, "Address is required"),
});
type BranchFormValues = z.infer<typeof branchFormSchema>;

export default function OrganizationBranchesPage() {
    const params = useParams();
    const orgId = params.orgId as string;
    const { toast } = useToast();

    const [branches, setBranches] = useState<Branch[]>([]);
    const [isBranchDialogOpen, setBranchDialogOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);

    const branchForm = useForm<BranchFormValues>({ resolver: zodResolver(branchFormSchema) });

    useEffect(() => {
        const foundOrg = mockOrganizations.find(o => o.id === orgId);
        if (foundOrg) {
            setBranches([
                { id: 'branch-1', name: `${foundOrg.name} - Main`, address: foundOrg.address || '123 Main St', organizationId: orgId },
                { id: 'branch-2', name: `${foundOrg.name} - Downtown`, address: '456 Downtown Ave', organizationId: orgId },
            ]);
        }
    }, [orgId]);

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

    return (
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
                                            <DropdownMenuItem onClick={() => handleEditBranch(branch)} className="cursor-pointer"><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive px-2 py-1.5 h-auto font-normal"><Trash2 className="mr-2 h-4 w-4"/> Delete</Button></AlertDialogTrigger>
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
    );
}
