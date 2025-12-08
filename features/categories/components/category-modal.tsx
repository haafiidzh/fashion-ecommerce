'use client';

import React, { useState, useEffect } from 'react';
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

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    isLoading?: boolean;
}

export default function CategoryModal({
                                          isOpen,
                                          onClose,
                                          category,
                                          onSubmit,
                                          isLoading = false
                                      }: CategoryModalProps) {
    const [formData, setFormData] = useState<CategoryFormData>({ name: '' });

    useEffect(() => {
        if (category) {
            setFormData({ name: category.name });
        } else {
            setFormData({ name: '' });
        }
    }, [category, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        try {
            await onSubmit(formData);
            setFormData({ name: '' });
        } catch (error) {
            console.error('Error submitting category:', error);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
            setFormData({ name: '' });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ name: e.target.value })}
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
};
