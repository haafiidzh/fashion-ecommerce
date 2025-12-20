import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const generateUniqueSlugForUpdate = async (name: string, excludeId: number): Promise<string> => {
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.products.findFirst({ where: { slug, id: { not: excludeId } } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);

        if (isNaN(productId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const product = await prisma.products.findUnique({
            where: {
                id: productId,
                deleted_at: null,
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

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        let normalizedImages: any[] = [];

        if (product.images && typeof product.images === 'string') {
            try {
                const parsedImages = JSON.parse(product.images);

                if (Array.isArray(parsedImages) && parsedImages.length > 0 && typeof parsedImages[0] === 'string') {
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
                console.error("Failed to parse images JSON for product", product.id, error);
                normalizedImages = [];
            }
        }
        else if (Array.isArray(product.images)) {
            normalizedImages = product.images;
        }
        const responseProduct = {
            ...product,
            images: normalizedImages,
        };

        return NextResponse.json(responseProduct);
    } catch (error) {
        console.error(`Failed to fetch product:`, error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);

        if (isNaN(productId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const { name, price, category_id, images } = await request.json();

        if (!name || price === undefined || !category_id) {
            return NextResponse.json(
                { error: "Name, price, and category_id are required" },
                { status: 400 }
            );
        }

        const slug = await generateUniqueSlugForUpdate(name, productId);

        const updatedProduct = await prisma.products.update({
            where: { id: productId },
            data: {
                name,
                slug,
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

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        console.error(`Failed to update product:`, error);

        if (error.code === 'P2025') {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (error.code === 'P2003') {
            return NextResponse.json(
                { error: "Invalid category_id. Category does not exist." },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);

        if (isNaN(productId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        await prisma.products.update({
            where: { id: productId },
            data: {
                deleted_at: new Date(),
            },
        });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        console.error(`Failed to delete product:`, error);

        if (error.code === 'P2025') {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}