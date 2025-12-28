import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sortBy = searchParams.get('sortBy') || 'most-popular';

        // Build where clause
        let whereClause: any = {
            deleted_at: null,
        };

        // Add category filter if provided
        if (category) {
            whereClause.product_category = {
                name: {
                    equals: category,
                    mode: 'insensitive'
                }
            };
        }

        // Add price range filter if provided
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price.gte = parseInt(minPrice);
            if (maxPrice) whereClause.price.lte = parseInt(maxPrice);
        }

        // Determine order by
        let orderBy: any = {
            created_at: 'desc',
        };

        if (sortBy === 'low-price') {
            orderBy = {
                price: 'asc',
            };
        } else if (sortBy === 'high-price') {
            orderBy = {
                price: 'desc',
            };
        }

        const products = await prisma.products.findMany({
            where: whereClause,
            include: {
                product_category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                product_variants: {
                    include: {
                        variants: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy,
        });

        const normalizedProducts = products.map(product => {
            let normalizedImages: any[] = [];

            if (product.images && typeof product.images === 'string') {
                try {
                    const parsedImages = JSON.parse(product.images);

                    if (Array.isArray(parsedImages) && parsedImages.length >0 && typeof parsedImages[0] === 'string') {
                        normalizedImages = parsedImages.map((url, index) => ({
                            id: `img-${index}`,
                            url: url,
                            alt: product.name || 'Product image',
                            public_id: `img-${index}`,
                        }));
                    }
                    else if (Array.isArray(parsedImages)) {
                        normalizedImages = parsedImages;
                    }
                } catch (error) {
                    console.error("Failed to parse images for product", product.id, error);
                    normalizedImages = [];
                }
            }
            else if (Array.isArray(product.images)) {
                normalizedImages = product.images;
            }

            return {
                ...product,
                images: normalizedImages,
            };
        });

        return NextResponse.json(normalizedProducts);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, price, category_id, images } = await request.json();

        if (!name || price === undefined || !category_id) {
            return NextResponse.json(
                { error: "Name, price, and category_id are required" },
                { status: 400 }
            );
        }

        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        let uniqueSlug = slug;
        let counter =1;
        while (await prisma.products.findFirst({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        const newProduct = await prisma.products.create({
            data: {
                name,
                slug: uniqueSlug,
                price: parseInt(price, 10),
                category_id: parseInt(category_id, 10),
                images: images || null,
            },
            include: {
                product_category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create product:", error);

        if (error.code === 'P2003') {
            return NextResponse.json(
                { error: "Invalid category_id. Category does not exist." },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}