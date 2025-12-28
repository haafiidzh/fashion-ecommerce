"use client";

import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useShop } from "@/features/shop/context/shop-context";

const SizeSection = () => {
    const { setFilters, state } = useShop();

    const handleSizeClick = (size: string) => {
        setFilters({ size });
    };

    return (
        <Accordion type="single" collapsible defaultValue="filter-size">
            <AccordionItem value="filter-size" className="border-none">
                <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
                    Size
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0">
                    <div className="flex items-center flex-wrap">
                        {[
                            "S",
                            "M",
                            "L",
                            "XL",
                        ].map((size, index) => (
                            <button
                                key={index}
                                type="button"
                                className={cn([
                                    "bg-[#F0F0F0] m-1 flex items-center justify-center px-5 py-2.5 text-sm rounded-full max-h-[39px]",
                                    state.filters.size === size && "bg-black font-medium text-white",
                                ])}
                                onClick={() => handleSizeClick(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default SizeSection;