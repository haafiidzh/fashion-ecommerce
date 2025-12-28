"use client";

import { useProduct } from "@/features/products/context/product-context";
import { cn } from "@/lib/utils";
import React from "react";
import {CheckCircle} from "lucide-react";

const colorsData = [
    {
        name: "Coklat",
        code: "bg-[#4F4631]",
    },
    {
        name: "Hijau",
        code: "bg-[#314F4A]",
    },
    {
        name: "Biru",
        code: "bg-[#31344F]",
    },
];

const ColorSelection = () => {
    const { selection, setColorSelection } = useProduct();

    return (
        <div className="flex flex-col">
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Pilih Warna
      </span>
            <div className="flex items-center flex-wrap space-x-3 sm:space-x-4">
                {colorsData.map((color, index) => (
                    <button
                        key={index}
                        type="button"
                        className={cn([
                            color.code,
                            "rounded-full w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center",
                        ])}
                        onClick={() => setColorSelection(color)}
                    >
                        {selection.colorSelection.name === color.name && (
                            <CheckCircle className="text-base text-white" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorSelection;