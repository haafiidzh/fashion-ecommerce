import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type DressStyleCardProps = {
    title: string;
    url: string;
    image: string;
    className?: string;
};

const DressStyleCard = ({ title, url, image, className }: DressStyleCardProps) => {
    return (
        <Link
            href={url}
            className={cn(
                "group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-6 md:p-9 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent flex flex-col rounded-[20px] overflow-hidden relative min-h-[190px] md:min-h-[289px]",
                className
            )}
        >
            {/* Background Image with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-top bg-no-repeat transition-transform duration-500 group-hover/bento:scale-110"
                style={{ backgroundImage: `url(${image})` }}
            />

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300" />

            {/* Title - Top Left */}
            <div className="relative z-10 flex items-start">
                <div className="font-bold text-2xl md:text-4xl text-neutral-800 dark:text-neutral-200 transform transition-all duration-300 group-hover/bento:translate-x-2 group-hover/bento:text-black">
                    {title}
                </div>
            </div>
        </Link>
    );
};

export default DressStyleCard;