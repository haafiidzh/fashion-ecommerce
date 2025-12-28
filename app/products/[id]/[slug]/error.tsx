"use client";

import { useEffect } from 'react';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Product page error:', error);
    }, [error]);

    return (
        <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">Terjadi Kesalahan</h2>
            <p className="mb-4">Gagal memuat detail produk</p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Coba Lagi
            </button>
        </div>
    );
}