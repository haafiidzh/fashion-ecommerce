'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductFormData } from '@/features/products/types/product-types';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { categoryApi } from '@/data/categories';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null;
    onSubmit: (data: ProductFormData) => Promise<void>;
    isLoading?: boolean;
}

export default function ProductModal({
                                         isOpen,
                                         onClose,
                                         product,
                                         onSubmit,
                                         isLoading = false
                                     }: ProductModalProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        category_id: 0,
        name: '',
        slug: '',
        price: ''
    });
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (product) {
            setFormData({
                category_id: product.category_id,
                name: product.name,
                slug: product.slug || '',
                price: product.price || ''
            });
        } else {
            setFormData({
                category_id: 0,
                name: '',
                slug: '',
                price: ''
            });
        }
    }, [product, isOpen]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.category_id) return;

        try {
            await onSubmit(formData);
            setFormData({
                category_id: 0,
                name: '',
                slug: '',
                price: ''
            });
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
            setFormData({
                category_id: 0,
                name: '',
                slug: '',
                price: ''
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {product ? 'Edit Product' : 'Create New Product'}
                    </DialogTitle>
                    <DialogDescription>
                        {product
                            ? 'Make changes to your product here. Click save when you are done.'
                            : 'Add a new product to your store. Click save when you are done.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category_id" className="text-right">
                                Category
                            </Label>
                            <Select
                                value={formData.category_id.toString()}
                                onValueChange={(value) => setFormData({ ...formData, category_id: parseInt(value) })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                placeholder="Enter product name"
                                autoFocus
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="slug" className="text-right">
                                Slug
                            </Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="col-span-3"
                                placeholder="Enter product slug"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Price
                            </Label>
                            <Input
                                id="price"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="col-span-3"
                                placeholder="Enter product price"
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
                            disabled={isLoading || !formData.name.trim() || !formData.category_id}
                        >
                            {isLoading ? 'Saving...' : (product ? 'Update' : 'Create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};