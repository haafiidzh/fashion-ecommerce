// components/shop-page/filters/index.tsx
import React from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import ColorsSection from "@/components/shop-page/filters/ColorsSection";
import DressStyleSection from "@/components/shop-page/filters/DressStyleSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import SizeSection from "@/components/shop-page/filters/SizeSection";
import { Button } from "@/components/ui/button";
import { useShop } from "@/features/shop/context/shop-context";

const Filters = () => {
    const { resetFilters } = useShop();

    const handleApplyFilters = () => {
        // Filters are already applied when changed, but we could add additional logic here
        // For example, close the mobile filters drawer
    };

    return (
        <>
            <hr className="border-t-black/10" />
            <CategoriesSection />
            <hr className="border-t-black/10" />
            <PriceSection />
            <hr className="border-t-black/10" />
            <ColorsSection />
            <hr className="border-t-black/10" />
            <SizeSection />
            <hr className="border-t-black/10" />
            {/*<DressStyleSection />*/}
            <div className="flex gap-2">
                <Button
                    type="button"
                    className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
                    onClick={handleApplyFilters}
                >
                    Apply Filter
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-full text-sm font-medium py-4 h-12"
                    onClick={resetFilters}
                >
                    Reset
                </Button>
            </div>
        </>
    );
};

export default Filters;