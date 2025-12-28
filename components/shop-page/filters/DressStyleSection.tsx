// src/components/shop-page/filters/DressStyleSection.tsx
import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useShop } from "@/features/shop/context/shop-context";
import {ArrowRight} from "lucide-react";

type DressStyle = {
    title: string;
    slug: string;
};

const dressStylesData: DressStyle[] = [
    {
        title: "Casual",
        slug: "casual",
    },
    {
        title: "Formal",
        slug: "formal",
    },
    {
        title: "Party",
        slug: "party",
    },
    {
        title: "Gym",
        slug: "gym",
    },
];

const DressStyleSection = () => {
    const { setFilters, state } = useShop();

    const handleDressStyleClick = (style: string) => {
        setFilters({ dressStyle: style });
    };

    return (
        <Accordion type="single" collapsible defaultValue="filter-style">
            <AccordionItem value="filter-style" className="border-none">
                <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
                    Dress Style
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-0">
                    <div className="flex flex-col text-black/60 space-y-0.5">
                        {dressStylesData.map((dStyle, idx) => (
                            <button
                                key={idx}
                                className="flex items-center justify-between py-2 text-left"
                                onClick={() => handleDressStyleClick(dStyle.slug)}
                            >
                                {dStyle.title} <ArrowRight />
                            </button>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default DressStyleSection;