'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductFormData, ProductImage } from '@/features/products/types/product-types';
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
import { useCategory } from '@/features/categories/context/category-context';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null;
    onSubmit: (data: ProductFormData) => Promise<void>;
    isLoading?: boolean;
    title?: string;
}

export default function ProductModal({
                                         isOpen,
                                         onClose,
                                         product,
                                         onSubmit,
                                         isLoading = false,
                                         title
                                     }: ProductModalProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        category_id: 0,
        name: '',
        slug: '',
        price: 0,
        images: []
    });

    // State khusus untuk input harga dalam bentuk string
    const [priceInput, setPriceInput] = useState<string>('0');

    const { state: categoryState } = useCategory();
    const { categories } = categoryState;

    useEffect(() => {
        if (product) {
            setFormData({
                category_id: product.category_id,
                name: product.name,
                slug: product.slug || '',
                price: product.price || 0,
                images: product.images || []
            });
            setPriceInput(product.price ? product.price.toString() : '0');
        } else {
            setFormData({
                category_id: 0,
                name: '',
                slug: '',
                price: 0,
                images: []
            });
            setPriceInput('0');
        }
    }, [product, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.category_id) return;

        const priceValue = parseInt(priceInput.replace(/[^\d]/g, ''), 10) || 0;

        try {
            await onSubmit({
                ...formData,
                price: priceValue
            });
            setFormData({
                category_id: 0,
                name: '',
                slug: '',
                price: 0,
                images: []
            });
            setPriceInput('0');
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
                price: 0,
                images: []
            });
            setPriceInput('0');
        }
    };

    // Handler khusus untuk input harga
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Hanya izinkan digit
        if (/^\d*$/.test(value)) {
            setPriceInput(value);
            // Update formData dengan nilai number
            setFormData({
                ...formData,
                price: parseInt(value, 10) || 0
            });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files);
        const newImages: ProductImage[] = [];

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.secure_url) {
                    newImages.push({
                        id: data.public_id,
                        url: data.secure_url,
                        public_id: data.public_id,
                        alt: file.name || ''
                    });
                }
            }

            setFormData({
                ...formData,
                images: [...(formData.images || []), ...newImages]
            });
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Gagal mengunggah gambar');
        }
    };

    const handleRemoveImage = (imageId: string) => {
        setFormData({
            ...formData,
            images: formData.images?.filter(img => img.id !== imageId) || []
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {title || (product ? 'Edit Product' : 'Create New Product')}
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
                            <div className="col-span-3 relative">
                                <Input
                                    id="price"
                                    type="text"
                                    value={priceInput}
                                    onChange={handlePriceChange}
                                    className="col-span-3"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="images" className="text-right mt-2">
                                Images
                            </Label>
                            <div className="col-span-3 space-y-2">
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                        <input
                                            id="images"
                                            type="file"
                                            className="hidden"
                                            multiple
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>

                                {formData.images && formData.images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {formData.images.map((image) => (
                                            <div key={image.id} className="relative group">
                                                <img
                                                    src={image.url}
                                                    alt={image.alt || 'Product image'}
                                                    className="w-full h-24 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(image.id)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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
}