
'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose, DialogDescription as FormDialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Tag, Star } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { mockOffers as initialOffers } from "@/lib/mock-data";
import { mockOrganizations } from "@/lib/mock-organizations";
import { mockCategories } from "@/lib/mock-data";
import { mockTags } from "@/lib/mock-data";
import { type Offer } from "@/lib/types";
import { FormInput } from "@/components/ui/form-input";
import { SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";

const offerFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  fullDescription: z.string().min(20, "Full description must be at least 20 characters."),
  discount: z.string().min(1, "Discount is required."),
  organizationId: z.string({ required_error: "Please select an organization." }),
  categoryId: z.string({ required_error: "Please select a category." }),
  tags: z.array(z.string()).optional(),
  isMemberOnly: z.boolean().default(false),
  // In a real app, you might have a branchId select here as well
});

type OfferFormValues = z.infer<typeof offerFormSchema>;

export default function AdminOffersPage() {
    const { toast } = useToast();
    const [offers, setOffers] = useState<Offer[]>(initialOffers);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);

    const form = useForm<OfferFormValues>({
        resolver: zodResolver(offerFormSchema),
        defaultValues: {
            title: '',
            description: '',
            fullDescription: '',
            discount: '',
            organizationId: '',
            categoryId: '',
            tags: [],
            isMemberOnly: false,
        }
    });

    const handleEditClick = (offer: Offer) => {
        setCurrentOffer(offer);
        form.reset({
            title: offer.title,
            description: offer.description,
            fullDescription: offer.fullDescription,
            discount: offer.discount,
            organizationId: offer.organizationId,
            categoryId: mockCategories.find(c => c.name === offer.category)?.id || '',
            isMemberOnly: offer.isMemberOnly,
            // Assuming tags can be mapped back, this is simplified
            tags: [],
        });
        setDialogOpen(true);
    };

    const handleAddNewClick = () => {
        setCurrentOffer(null);
        form.reset();
        setDialogOpen(true);
    };

    const handleDeleteClick = (offerId: string) => {
        setOffers(offers => offers.filter(o => o.id !== offerId));
        toast({
            title: "Offer Deleted",
            description: "The offer has been successfully removed.",
        });
    };

    const handleFormSubmit = (values: OfferFormValues) => {
        const selectedOrg = mockOrganizations.find(o => o.id === values.organizationId);
        const selectedCategory = mockCategories.find(c => c.id === values.categoryId);

        if (!selectedOrg || !selectedCategory) {
            toast({ title: "Error", description: "Invalid organization or category selected.", variant: "danger" });
            return;
        }

        if (currentOffer) {
            const updatedOffer: Offer = {
                ...currentOffer,
                ...values,
                companyName: selectedOrg.name,
                category: selectedCategory.name,
                // In a real app, lat/lng would come from the org/branch
                latitude: currentOffer.latitude,
                longitude: currentOffer.longitude,
                distance: currentOffer.distance,
            };
            setOffers(offers => offers.map(o => o.id === currentOffer.id ? updatedOffer : o));
            toast({ title: "Offer Updated", description: `${values.title} has been updated.` });
        } else {
            const newOffer: Offer = {
                id: `offer-${Date.now()}`,
                ...values,
                companyName: selectedOrg.name,
                category: selectedCategory.name,
                // Dummy data for new offers
                latitude: 23.8103,
                longitude: 90.4125,
                distance: '1.0 mi',
            };
            setOffers(offers => [newOffer, ...offers]);
            toast({ title: "Offer Added", description: `${values.title} has been created.` });
        }
        setDialogOpen(false);
    };
    
    const getOrgName = (orgId: string) => mockOrganizations.find(o => o.id === orgId)?.name || 'Unknown';


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-bold">Manage Offers</h1>
                    <p className="text-muted-foreground">A gallery of all promotional offers in the system.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddNewClick}>
                            <PlusCircle /> Add Offer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                                <DialogHeader>
                                    <DialogTitle>{currentOffer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
                                    <FormDialogDescription>Fill out the form below to create or update an offer.</FormDialogDescription>
                                </DialogHeader>

                                <ScrollArea className="max-h-[70vh] -mr-6 pr-6">
                                <div className="space-y-4 py-4">
                                    <FormInput control={form.control} name="title" label="Offer Title" placeholder="e.g., 20% Off All Coffees" required />
                                    
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormSelect
                                            control={form.control}
                                            name="organizationId"
                                            label="Organization"
                                            placeholder="Select an organization"
                                            required
                                        >
                                            {mockOrganizations.map(org => (<SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>))}
                                        </FormSelect>
                                        <FormInput control={form.control} name="discount" label="Discount Value" placeholder="e.g., 20% OFF or FREE" required />
                                    </div>
                                    
                                    <FormTextarea
                                        control={form.control}
                                        name="description"
                                        label="Short Description"
                                        placeholder="A brief, catchy description for the offer card."
                                        required
                                    />
                                     <FormTextarea
                                        control={form.control}
                                        name="fullDescription"
                                        label="Full Description"
                                        placeholder="The full details of the offer to be shown in the details view."
                                        rows={5}
                                        required
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormSelect
                                            control={form.control}
                                            name="categoryId"
                                            label="Category"
                                            placeholder="Select a category"
                                            required
                                        >
                                            {mockCategories.map(cat => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}
                                        </FormSelect>
                                        <FormField
                                            control={form.control}
                                            name="isMemberOnly"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-3">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Member Only</FormLabel>
                                                    <FormDescription>
                                                    Is this offer exclusive to members?
                                                    </FormDescription>
                                                </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="tags"
                                        render={() => (
                                            <FormItem>
                                                 <FormLabel>Tags (Optional)</FormLabel>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                                    {mockTags.map((item) => (
                                                        <FormField
                                                            key={item.id}
                                                            control={form.control}
                                                            name="tags"
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(item.id)}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...(field.value || []), item.id])
                                                                                        : field.onChange(field.value?.filter((value) => value !== item.id));
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal">{item.name}</FormLabel>
                                                                    </FormItem>
                                                                );
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                </div>
                                </ScrollArea>
                                
                                <DialogFooter className="pt-4">
                                    <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                    <Button type="submit">{currentOffer ? 'Save Changes' : 'Create Offer'}</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {offers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {offers.map((offer) => (
                        <Card key={offer.id} className="flex flex-col">
                            <CardHeader>
                                {offer.isMemberOnly && (
                                     <div className="flex justify-end -mb-2">
                                        <Badge variant="default" className="bg-accent text-accent-foreground"><Star className="mr-1 h-3 w-3" /> Member</Badge>
                                     </div>
                                )}
                                <CardTitle className="text-lg">{offer.title}</CardTitle>
                                <CardDescription>{getOrgName(offer.organizationId)}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <Badge variant="secondary">{offer.discount}</Badge>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleEditClick(offer)} className="cursor-pointer"><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="w-full justify-start text-sm text-danger hover:text-danger px-2 py-1.5 h-auto font-normal"><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This action cannot be undone and will permanently delete the offer.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteClick(offer.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="flex flex-col items-center justify-center py-20">
                    <CardContent className="text-center">
                        <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Offers Yet</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Get started by creating your first promotional offer.</p>
                        <Button className="mt-6" onClick={handleAddNewClick}><PlusCircle className="mr-2 h-4 w-4"/>Create Offer</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
