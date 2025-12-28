"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "./button";

interface CartCounterProps {
    value: number;
    onChange: (value: number) => void;
}

const CartCounter = ({ value, onChange }: CartCounterProps) => {
    const handleAdd = () => {
        const newValue = value + 1;
        onChange(newValue);
    };

    const handleRemove = () => {
        if (value > 1) {
            const newValue = value - 1;
            onChange(newValue);
        }
    };

    return (
        <div className="flex items-center border rounded-full h-11 md:h-[52px]">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleRemove}
                disabled={value <= 1}
            >
                <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{value}</span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleAdd}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default CartCounter;