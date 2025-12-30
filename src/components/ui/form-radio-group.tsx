
'use client';

import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioOption {
    value: string;
    label: string;
}

interface FormRadioGroupProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    options: RadioOption[];
    required?: boolean;
    className?: string;
    orientation?: "vertical" | "horizontal";
}

export function FormRadioGroup<T extends FieldValues>({ control, name, label, options, required, className, orientation = 'vertical' }: FormRadioGroupProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("space-y-3", className)}>
                    <FormLabel required={required}>{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className={cn("flex", orientation === 'vertical' ? "flex-col space-y-1" : "flex-row space-x-4")}
                        >
                            {options.map((option) => (
                                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {option.label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

    