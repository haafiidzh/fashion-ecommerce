// src/components/shop-page/filters/ColorsSection.tsx
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
import {CheckCircle} from "lucide-react";

const ColorsSection = () => {
    const { setFilters, state } = useShop();

    const handleColorClick = (color: string) => {
        setFilters({ color });
    };

    return (
        <Accordion type="single" collapsible defaultValue="filter-colors">
            <AccordionItem value="filter-colors" className="border-none">
                <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
                    Colors
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0">
                    <div className="flex space-2.5 flex-wrap md:grid grid-cols-5 gap-2.5">
                        {[
                            { name: "green", class: "bg-green-600" },
                            { name: "red", class: "bg-red-600" },
                            { name: "yellow", class: "bg-yellow-300" },
                            { name: "orange", class: "bg-orange-600" },
                            { name: "cyan", class: "bg-cyan-400" },
                            { name: "blue", class: "bg-blue-600" },
                            { name: "purple", class: "bg-purple-600" },
                            { name: "pink", class: "bg-pink-600" },
                            { name: "white", class: "bg-white" },
                            { name: "black", class: "bg-black" },
                        ].map((color, index) => (
                            <button
                                key={index}
                                type="button"
                                className={cn([
                                    color.class,
                                    "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border border-black/20",
                                ])}
                                onClick={() => handleColorClick(color.name)}
                            >
                                {state.filters.color === color.name && (
                                    <CheckCircle className="text-base text-white" />
                                )}
                            </button>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default ColorsSection;