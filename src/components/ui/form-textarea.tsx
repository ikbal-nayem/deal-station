
'use client';

import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormTextareaProps<T extends FieldValues> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    control: Control<T>;
    name: Path<T>;
    label: string;
}

export function FormTextarea<T extends FieldValues>({ control, name, label, className, ...props }: FormTextareaProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn(className)}>
                    <FormLabel required={props.required}>{label}</FormLabel>
                    <FormControl>
                        <Textarea {...props} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
