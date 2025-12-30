
'use client';

import { Control, FieldValues, Path, PathValue, FieldPathValue } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormInputProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
}

export function FormInput<T extends FieldValues>({ control, name, label, placeholder, type = "text" }: FormInputProps<T>) {
     if (type === 'file') {
        const { ref, ...rest } = control.register(name);
        return (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input placeholder={placeholder} type={type} {...rest} ref={ref} />
                </FormControl>
                <FormMessage />
            </FormItem>
        );
    }
    
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} type={type} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
