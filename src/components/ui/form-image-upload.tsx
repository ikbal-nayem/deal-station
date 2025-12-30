
'use client';

import { Control, FieldValues, Path, useController } from "react-hook-form";
import { FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, Image as ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FormImageUploadProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    description?: string;
    currentImage?: string | null;
    fallbackText?: string;
    shape?: 'circle' | 'square';
}

export function FormImageUpload<T extends FieldValues>({
    control,
    name,
    label = 'Logo or Image',
    description,
    currentImage,
    fallbackText = '?',
    shape = 'circle'
}: FormImageUploadProps<T>) {
    const { field } = useController({ name, control });
    const [preview, setPreview] = useState<string | null | undefined>(currentImage);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreview(currentImage);
    }, [currentImage]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            field.onChange([file]); // react-hook-form expects an array for FileList
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setPreview(null);
        field.onChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const isSquare = shape === 'square';
    const containerClasses = cn(
        "relative group flex items-center justify-center bg-muted border-2 border-dashed rounded-lg overflow-hidden",
        isSquare ? "h-32 w-32" : "h-24 w-24 rounded-full",
    );

    const fallbackClasses = cn(
        "flex flex-col items-center justify-center gap-1 text-muted-foreground",
        !isSquare && "rounded-full"
    );

    return (
        <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
             <div className="flex items-center gap-6">
                <div className={containerClasses} onClick={() => inputRef.current?.click()} role="button" aria-label="Upload image">
                    {preview ? (
                        <>
                            <Avatar className="h-full w-full">
                                <AvatarImage src={preview} className="object-cover" />
                                <AvatarFallback className={cn(isSquare ? 'rounded-none' : 'rounded-full')}>{fallbackText}</AvatarFallback>
                            </Avatar>
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={handleRemoveImage}
                            >
                                <Trash2 className="h-3 w-3" />
                                <span className="sr-only">Remove image</span>
                            </Button>
                        </>
                    ) : (
                        <div className={fallbackClasses}>
                            <ImageIcon className="h-8 w-8" />
                            <span className="text-xs">Upload</span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        ref={inputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
                {description && (
                    <div className="flex-1 space-y-1">
                        <p className="text-sm text-muted-foreground">{description}</p>
                         <p className="text-xs text-muted-foreground">
                            Recommended: 400x400px. Max 2MB.
                        </p>
                    </div>
                )}
            </div>
            <FormMessage />
        </FormItem>
    );
}
