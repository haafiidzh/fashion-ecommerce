// src/components/shop-page/filters/CategoriesSection.tsx
import React from "react";
import { useShop } from "@/features/shop/context/shop-context";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

const CategoriesSection = () => {
    const { setFilters, state } = useShop();
    const { categories, categoriesLoading, categoriesError } = state;

    const handleCategoryClick = (category: string) => {
        // Jika kategori yang diklik sama dengan filter yang aktif, hapus filter
        if (state.filters.category === category) {
            setFilters({ category: undefined });
        } else {
            setFilters({ category });
        }
    };

    if (categoriesLoading) {
        return (
            <div className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
            </div>
        );
    }

    if (categoriesError) {
        return <p className="text-red-500 text-sm">{categoriesError}</p>;
    }

    return (
        <div className="flex flex-col space-y-0.5 text-black/60">
            {categories.map((category) => (
                <button
                    key={category.id}
                    className={`flex items-center justify-between py-2 text-left ${
                        state.filters.category === category.name ? 'font-semibold text-black' : ''
                    }`}
                    onClick={() => handleCategoryClick(category.name)}
                >
                    {category.name} <ArrowRight />
                </button>
            ))}
        </div>
    );
};

export default CategoriesSection;