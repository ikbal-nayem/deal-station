
'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

interface ConfirmationDialogProps {
	trigger: React.ReactNode;
	title: string;
	description: string;
	onConfirm: () => void;
	confirmText?: string;
	cancelText?: string;
	confirmVariant?: 'default' | 'danger';
}

export function ConfirmationDialog({
	trigger,
	title,
	description,
	onConfirm,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	confirmVariant = 'default',
}: ConfirmationDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{cancelText}</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className={cn(
							buttonVariants({
								variant: confirmVariant,
							})
						)}
					>
						{confirmText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
