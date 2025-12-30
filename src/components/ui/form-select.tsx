
'use client';

import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormSelectProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
}

export function FormSelect<T extends FieldValues>({ control, name, label, placeholder, required, className, children }: FormSelectProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn(className)}>
                    <FormLabel required={required}>{label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>{children}</SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
