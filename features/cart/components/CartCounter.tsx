"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CartCounterProps {
  initialValue: number;
  onAdd: () => void;
  onRemove: () => void;
  isZeroDelete?: boolean;
  min?: number;
  max?: number;
}

export default function CartCounter({
  initialValue,
  onAdd,
  onRemove,
  isZeroDelete = false,
  min = 0,
  max,
}: CartCounterProps) {
  const validInitialValue = Number(initialValue) > 0 ? Number(initialValue) : 1;
  
  const [value, setValue] = useState(validInitialValue);

  useEffect(() => {
    const newValue = Number(initialValue) > 0 ? Number(initialValue) : 1;
    setValue(newValue);
  }, [initialValue]);

  const handleDecrease = () => {
    if (value > min) {
      onRemove();
    } else if (isZeroDelete && value === 1) {
      onRemove();
    }
  };

  const handleIncrease = () => {
    if (!max || value < max) {
      onAdd();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between border border-black/10 rounded-full bg-white"
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:h-10 md:w-10 rounded-l-full hover:bg-gray-100 cursor-pointer"
        onClick={handleDecrease}
        disabled={value <= min && !isZeroDelete}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="text-sm md:text-base font-medium px-3 md:px-4 min-w-8 text-center">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:h-10 md:w-10 rounded-r-full hover:bg-gray-100 cursor-pointer"
        onClick={handleIncrease}
        disabled={max !== undefined && value >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

