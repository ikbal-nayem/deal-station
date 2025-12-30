
'use client';

import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FormCheckboxProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    description?: string;
    className?: string;
}

export function FormCheckbox<T extends FieldValues>({ control, name, label, description, className }: FormCheckboxProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4", className)}>
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>{label}</FormLabel>
                        {description && <FormDescription>{description}</FormDescription>}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

    