'use client'

import React, { useState, useEffect } from 'react';
import { Category, CategoryFormData } from '@/features/categories/types/category-types';
import { CategoryModalView } from './category-modal.view';

interface CategoryModalContainerProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    isLoading?: boolean;
}

export default function CategoryModalContainer({
                                           isOpen,
                                           onClose,
                                           category,
                                           onSubmit,
                                           isLoading = false,
                                       }: CategoryModalContainerProps) {
    const [formData, setFormData] = useState<CategoryFormData>({ name: '' });

    useEffect(() => {
        if (isOpen) {
            if (category) {
                setFormData({ name: category.name });
            } else {
                setFormData({ name: '' });
            }
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

    const handleInputChange = (value: string) => {
        setFormData({ name: value });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
            setFormData({ name: '' });
        }
    };

    return (
        <CategoryModalView
            isOpen={isOpen}
            isLoading={isLoading}
            category={category}
            formData={formData}
            onClose={onClose}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onOpenChange={handleOpenChange}
        />
    );
}