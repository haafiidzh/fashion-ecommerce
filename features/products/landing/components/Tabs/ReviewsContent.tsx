import { Button } from "@/components/ui/button";
import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const ReviewsContent = () => {
    const reviewsData = [
        {
            id: 1,
            name: "John Doe",
            rating: 5,
            date: "2023-10-15",
            comment: "Produk sangat bagus, kualitas sesuai dengan harga. Pengiriman cepat dan packing aman.",
        },
        {
            id: 2,
            name: "Jane Smith",
            rating: 4,
            date: "2023-10-10",
            comment: "Produk sesuai deskripsi, namun sedikit lebih kecil dari yang saya harapkan. Tapi overall bagus.",
        },
    ];

    return (
        <section>
            <div className="flex items-center justify-between flex-col sm:flex-row mb-5 sm:mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-black mr-2">
                        Semua Ulasan
                    </h3>
                    <span className="text-sm sm:text-base text-black/60">({reviewsData.length})</span>
                </div>
                <div className="flex items-center space-x-2.5">
                    <Select defaultValue="latest">
                        <SelectTrigger className="min-w-[120px] font-medium text-xs sm:text-base px-4 py-3 sm:px-5 sm:py-4 text-black bg-[#F0F0F0] border-none rounded-full h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Terbaru</SelectItem>
                            <SelectItem value="most-relevant">Paling Relevan</SelectItem>
                            <SelectItem value="oldest">Terlama</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        type="button"
                        className="sm:min-w-[166px] px-4 py-3 sm:px-5 sm:py-4 rounded-full bg-black font-medium text-xs sm:text-base h-12"
                    >
                        Tulis Ulasan
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 sm:mb-9">
                {reviewsData.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{review.name}</h4>
                            <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                ))}
            </div>
            <div className="w-full px-4 sm:px-0 text-center">
                <Link
                    href="#"
                    className="inline-block w-[230px] px-11 py-4 border rounded-full hover:bg-black hover:text-white text-black transition-all font-medium text-sm sm:text-base border-black/10"
                >
                    Muat Lebih Banyak Ulasan
                </Link>
            </div>
        </section>
    );
};

export default ReviewsContent;