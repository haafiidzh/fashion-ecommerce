"use client";

import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useShop } from "@/features/shop/context/shop-context";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/features/products/components/product-card";
import { Sliders } from "lucide-react";
import { useEffect } from "react";

export default function ShopPage() {
    const { state, setFilters, setPage } = useShop();

    const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
    const endIndex = startIndex + state.pagination.itemsPerPage;
    const productsToDisplay = state.filteredProducts.slice(startIndex, endIndex);

    useEffect(() => {
        console.log("Raw Products (All Data):", state.products);
        console.log("Filtered Products (After Filter):", state.filteredProducts);
        console.log("Active Filters:", state.filters);
        console.log("Pagination:", state.pagination);
        console.log("Displaying Products:", productsToDisplay);
    }, [state]);

    const handleSortChange = (value: string) => {
        setFilters({ sortBy: value });
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    return (
        <main className="pb-20">
            <div className="max-w-frame mx-auto px-4 xl:px-0">
                <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
                <BreadcrumbShop />
                <div className="flex md:space-x-5 items-start">
                    <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-black text-xl">Filters</span>
                            <Sliders className="text-2xl text-black/40" />
                        </div>
                        <Filters />
                    </div>
                    <div className="flex flex-col w-full space-y-5">
                        <div className="flex flex-col lg:flex-row lg:justify-between">
                            <div className="flex items-center justify-between">
                                <h1 className="font-bold text-2xl md:text-[32px]">Shop</h1>
                                <MobileFilters />
                            </div>
                            <div className="flex flex-col sm:items-center sm:flex-row">
                                <span className="text-sm md:text-base text-black/60 mr-3">
                                    Showing {startIndex + 1}-{Math.min(endIndex, state.filteredProducts.length)} of {state.filteredProducts.length} Products
                                </span>
                                <div className="flex items-center">
                                    Sort by:{" "}
                                    <Select
                                        defaultValue={state.filters.sortBy || "most-popular"}
                                        onValueChange={handleSortChange}
                                    >
                                        <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="most-popular">Most Popular</SelectItem>
                                            <SelectItem value="low-price">Low Price</SelectItem>
                                            <SelectItem value="high-price">High Price</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {state.loading ? (
                            <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                                {Array.from({ length: 9 }).map((_, index) => (
                                    <div key={index} className="space-y-3">
                                        <Skeleton className="h-[295px] w-full rounded-lg" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : state.error ? (
                            <div className="text-center py-10">
                                <p className="text-red-500 mb-4">{state.error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-black text-white rounded-full"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                                    {productsToDisplay.map((product) => (
                                        <ProductCard key={product.id} data={product} />
                                    ))}
                                </div>

                                {state.pagination.totalPages > 1 && (
                                    <>
                                        <hr className="border-t-black/10" />
                                        <Pagination className="justify-between">
                                            <PaginationPrevious
                                                href="#"
                                                className="border border-black/10"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (state.pagination.currentPage > 1) {
                                                        handlePageChange(state.pagination.currentPage - 1);
                                                    }
                                                }}
                                            />
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        className="text-black/50 font-medium text-sm"
                                                        isActive={state.pagination.currentPage === 1}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePageChange(1);
                                                        }}
                                                    >
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>

                                                {state.pagination.totalPages > 1 && (
                                                    <PaginationItem>
                                                        <PaginationLink
                                                            href="#"
                                                            className="text-black/50 font-medium text-sm"
                                                            isActive={state.pagination.currentPage === 2}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handlePageChange(2);
                                                            }}
                                                        >
                                                            2
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )}

                                                {state.pagination.totalPages > 2 && (
                                                    <PaginationItem className="hidden lg:block">
                                                        <PaginationLink
                                                            href="#"
                                                            className="text-black/50 font-medium text-sm"
                                                            isActive={state.pagination.currentPage === 3}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handlePageChange(3);
                                                            }}
                                                        >
                                                            3
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )}

                                                {state.pagination.totalPages > 4 && (
                                                    <PaginationItem>
                                                        <PaginationEllipsis className="text-black/50 font-medium text-sm" />
                                                    </PaginationItem>
                                                )}

                                                {state.pagination.totalPages > 3 && (
                                                    <PaginationItem className="hidden lg:block">
                                                        <PaginationLink
                                                            href="#"
                                                            className="text-black/50 font-medium text-sm"
                                                            isActive={state.pagination.currentPage === state.pagination.totalPages}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handlePageChange(state.pagination.totalPages);
                                                            }}
                                                        >
                                                            {state.pagination.totalPages}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )}

                                                {state.pagination.totalPages > 2 && (
                                                    <PaginationItem className="hidden sm:block">
                                                        <PaginationLink
                                                            href="#"
                                                            className="text-black/50 font-medium text-sm"
                                                            isActive={state.pagination.currentPage === state.pagination.totalPages - 1}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handlePageChange(state.pagination.totalPages - 1);
                                                            }}
                                                        >
                                                            {state.pagination.totalPages - 1}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )}

                                                {state.pagination.totalPages > 1 && (
                                                    <PaginationItem>
                                                        <PaginationLink
                                                            href="#"
                                                            className="text-black/50 font-medium text-sm"
                                                            isActive={state.pagination.currentPage === state.pagination.totalPages}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handlePageChange(state.pagination.totalPages);
                                                            }}
                                                        >
                                                            {state.pagination.totalPages}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                )}
                                            </PaginationContent>

                                            <PaginationNext
                                                href="#"
                                                className="border border-black/10"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (state.pagination.currentPage < state.pagination.totalPages) {
                                                        handlePageChange(state.pagination.currentPage + 1);
                                                    }
                                                }}
                                            />
                                        </Pagination>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}