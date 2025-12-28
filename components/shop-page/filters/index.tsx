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

            <div className="flex gap-2 flex-nowrap">
                <Button
                    type="button"
                    className="bg-black flex-1 rounded-full text-sm font-medium py-2.5 h-10"
                    onClick={handleApplyFilters}
                >
                    Apply Filter
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-full text-sm font-medium py-2.5 h-10"
                    onClick={resetFilters}
                >
                    Reset
                </Button>
            </div>
        </>
    );
};

export default Filters;