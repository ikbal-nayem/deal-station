
'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ICommonMasterData } from "@/interfaces/master-data.interface";
import { mockCategories } from "@/lib/mock-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const categoryFormSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function CategoriesPage() {
    const { toast } = useToast();
    const [categories, setCategories] = useState<ICommonMasterData[]>(mockCategories);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<ICommonMasterData | null>(null);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: { name: '' }
    });

    const handleEditClick = (category: ICommonMaster-data.interface) => {
        setCurrentCategory(category);
        form.reset({ name: category.name });
        setDialogOpen(true);
    };

    const handleAddNewClick = () => {
        setCurrentCategory(null);
        form.reset({ name: '' });
        setDialogOpen(true);
    };

    const handleDeleteClick = (categoryId: string) => {
        setCategories(cats => cats.filter(c => c.id !== categoryId));
        toast({
            title: "Category Deleted",
            description: "The category has been successfully removed.",
        });
    };

    const handleFormSubmit = (values: CategoryFormValues) => {
        if (currentCategory) {
            setCategories(cats => cats.map(c => c.id === currentCategory.id ? { ...c, ...values } : c));
            toast({ title: "Category Updated", description: `${values.name} has been updated.` });
        } else {
            const newCategory: ICommonMasterData = { id: `cat-${Date.now()}`, ...values };
            setCategories(cats => [newCategory, ...cats]);
            toast({ title: "Category Added", description: `${values.name} has been created.` });
        }
        setDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-bold">Manage Categories</h1>
                    <p className="text-muted-foreground">A list of all offer categories.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddNewClick}>
                            <PlusCircle /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                                <DialogHeader>
                                    <DialogTitle>{currentCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                                </DialogHeader>
                                <FormInput
                                    control={form.control}
                                    name="name"
                                    label="Category Name"
                                    placeholder="e.g., Food & Drink"
                                    required
                                />
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                    <Button type="submit">{currentCategory ? 'Save Changes' : 'Create Category'}</Button>
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
                                <TableHead className="text-right w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
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
                                                <DropdownMenuItem onClick={() => handleEditClick(cat)} className="cursor-pointer">
                                                    <Edit className="mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive px-2 py-1.5 h-auto font-normal">
                                                            <Trash2 className="mr-2" /> Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>This will permanently delete the category.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteClick(cat.id)}>Delete</AlertDialogAction>
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
