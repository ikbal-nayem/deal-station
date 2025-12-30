
'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { type Tag } from "@/lib/types";
import { mockTags } from "@/lib/mock-data";
import { FormInput } from "@/components/ui/form-input";

const tagFormSchema = z.object({
  name: z.string().min(2, { message: "Tag name must be at least 2 characters." }),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

export default function TagsPage() {
    const { toast } = useToast();
    const [tags, setTags] = useState<Tag[]>(mockTags);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentTag, setCurrentTag] = useState<Tag | null>(null);

    const form = useForm<TagFormValues>({
        resolver: zodResolver(tagFormSchema),
        defaultValues: { name: '' }
    });

    const handleEditClick = (tag: Tag) => {
        setCurrentTag(tag);
        form.reset({ name: tag.name });
        setDialogOpen(true);
    };

    const handleAddNewClick = () => {
        setCurrentTag(null);
        form.reset({ name: '' });
        setDialogOpen(true);
    };

    const handleDeleteClick = (tagId: string) => {
        setTags(ts => ts.filter(t => t.id !== tagId));
        toast({
            title: "Tag Deleted",
            description: "The tag has been successfully removed.",
        });
    };

    const handleFormSubmit = (values: TagFormValues) => {
        if (currentTag) {
            setTags(ts => ts.map(t => t.id === currentTag.id ? { ...t, ...values } : t));
            toast({ title: "Tag Updated", description: `${values.name} has been updated.` });
        } else {
            const newTag: Tag = { id: `tag-${Date.now()}`, ...values };
            setTags(ts => [newTag, ...ts]);
            toast({ title: "Tag Added", description: `${values.name} has been created.` });
        }
        setDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-xl font-bold">Manage Tags</h1>
                    <p className="text-muted-foreground">A list of all available tags for offers.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddNewClick}>
                            <PlusCircle /> Add Tag
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                                <DialogHeader>
                                    <DialogTitle>{currentTag ? 'Edit Tag' : 'Add New Tag'}</DialogTitle>
                                </DialogHeader>
                                <FormInput
                                    control={form.control}
                                    name="name"
                                    label="Tag Name"
                                    placeholder="e.g., Vegan"
                                    required
                                />
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                    <Button type="submit">{currentTag ? 'Save Changes' : 'Create Tag'}</Button>
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
                            {tags.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell className="font-medium">{tag.name}</TableCell>
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
                                                <DropdownMenuItem onClick={() => handleEditClick(tag)} className="cursor-pointer">
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
                                                            <AlertDialogDescription>This will permanently delete the tag.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteClick(tag.id)}>Delete</AlertDialogAction>
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
