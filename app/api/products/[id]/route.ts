import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

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

        return NextResponse.json(product);
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

        const updatedProduct = await prisma.products.update({
            where: { id: productId },
            data: {
                name,
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