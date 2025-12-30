
'use client';

import { Control, FieldValues, Path, useController } from "react-hook-form";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FormImageUploadProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    currentImage?: string | null;
    fallbackText?: string;
    shape?: 'circle' | 'square';
}

export function FormImageUpload<T extends FieldValues>({
    control,
    name,
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
            field.onChange([file]);
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
    const avatarClasses = cn(
        "bg-muted border-2 border-dashed",
        isSquare ? "h-32 w-32 rounded-lg" : "h-24 w-24",
    );

    return (
        <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <FormControl>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                         <Avatar className={avatarClasses}>
                            <AvatarImage src={preview || undefined} className="object-cover" />
                            <AvatarFallback className={cn(isSquare && "rounded-lg")}>
                                {fallbackText}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
                            onClick={() => inputRef.current?.click()}
                        >
                            <Camera className="h-4 w-4" />
                            <span className="sr-only">Upload image</span>
                        </Button>
                        {preview && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={handleRemoveImage}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove image</span>
                            </Button>
                        )}
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            ref={inputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm text-muted-foreground">
                            Click the camera to upload a new image.
                        </p>
                         <p className="text-xs text-muted-foreground">
                            Recommended size: 400x400px. Max 2MB.
                        </p>
                    </div>
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
