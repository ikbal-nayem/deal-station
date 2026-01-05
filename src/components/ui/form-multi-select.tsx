
'use client';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import React, { useState } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Button } from './button';
import { Badge } from './badge';

interface FormMultiSelectProps<TFieldValues extends FieldValues, TOption> {
	control: Control<TFieldValues | any>;
	name: FieldPath<TFieldValues>;
	label: string;
	placeholder?: string;
	required?: boolean;
	options: TOption[];
	getOptionLabel: (option: TOption) => string;
	getOptionValue: (option: TOption) => string;
}

export function FormMultiSelect<TFieldValues extends FieldValues, TOption>({
	control,
	name,
	label,
	placeholder,
	required,
	options,
	getOptionLabel,
	getOptionValue,
}: FormMultiSelectProps<TFieldValues, TOption>) {
	const [open, setOpen] = useState(false);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel required={required}>{label}</FormLabel>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant='outline'
									role='combobox'
									aria-expanded={open}
									className='w-full justify-between h-auto min-h-10'
								>
									<div className='flex gap-1 flex-wrap'>
										{field.value && field.value.length > 0 ? (
											field.value.map((value: string) => {
												const option = options.find((opt) => getOptionValue(opt) === value);
												if (!option) return null;
												return (
													<Badge
														variant='secondary'
														key={value}
														className='mr-1'
														onClick={(e) => {
															e.stopPropagation();
															field.onChange(field.value.filter((v: string) => v !== value));
														}}
													>
														{getOptionLabel(option)}
														<X className='ml-1 h-3 w-3' />
													</Badge>
												);
											})
										) : (
											<span className='text-muted-foreground'>{placeholder || 'Select...'}</span>
										)}
									</div>
									<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className='w-full p-0'>
							<Command>
								<CommandInput placeholder='Search...' />
								<CommandList>
									<CommandEmpty>No results found.</CommandEmpty>
									<CommandGroup>
										{options.map((option) => (
											<CommandItem
												key={getOptionValue(option)}
												onSelect={(currentValue) => {
													const currentValueArray = field.value || [];
													const value = getOptionValue(option);
													if (currentValueArray.includes(value)) {
														field.onChange(currentValueArray.filter((v: string) => v !== value));
													} else {
														field.onChange([...currentValueArray, value]);
													}
												}}
											>
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														field.value?.includes(getOptionValue(option)) ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{getOptionLabel(option)}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
