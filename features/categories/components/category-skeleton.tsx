"use client"

export default function CategorySkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4">
                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                        <div className="h-8 bg-gray-300 rounded w-8"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}