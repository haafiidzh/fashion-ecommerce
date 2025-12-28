// src/components/shop-page/filters/PriceSection.tsx
import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useShop } from "@/features/shop/context/shop-context";
import { useEffect, useState } from "react";

const PriceSection = () => {
    const { setFilters, state } = useShop();
    const [priceRange, setPriceRange] = useState<[number, number]>([50, 200]);

    useEffect(() => {
        if (state.filters.priceRange) {
            setPriceRange(state.filters.priceRange);
        }
    }, [state.filters.priceRange]);

    const handlePriceChange = (value: number[]) => {
        const newRange: [number, number] = [value[0], value[1]];
        setPriceRange(newRange);
        setFilters({ priceRange: newRange });
    };

    return (
        <Accordion type="single" collapsible defaultValue="filter-price">
            <AccordionItem value="filter-price" className="border-none">
                <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
                    Price
                </AccordionTrigger>
                <AccordionContent className="pt-4" contentClassName="overflow-visible">
                    <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={250}
                        step={1}
                        label="$"
                        onValueChange={handlePriceChange}
                    />
                    <div className="mb-3" />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default PriceSection;