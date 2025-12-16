import React from 'react';
import { Category, CategoryFormData } from '@/features/categories/types/category-types';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryModalViewProps {
    isOpen: boolean;
    isLoading: boolean;
    category: Category | null;
    formData: CategoryFormData;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onInputChange: (value: string) => void;
    onOpenChange: (open: boolean) => void;
}

export function CategoryModalView({
                                      isOpen,
                                      isLoading,
                                      category,
                                      formData,
                                      onClose,
                                      onSubmit,
                                      onInputChange,
                                      onOpenChange,
                                  }: CategoryModalViewProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {category ? 'Edit Category' : 'Create New Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? 'Make changes to your category here. Click save when you are done.'
                            : 'Add a new category to your store. Click save when you are done.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => onInputChange(e.target.value)}
                                className="col-span-3"
                                placeholder="Enter category name"
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !formData.name.trim()}
                        >
                            {isLoading ? 'Saving...' : (category ? 'Update' : 'Create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}