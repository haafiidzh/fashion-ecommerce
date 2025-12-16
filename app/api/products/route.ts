import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

export async function GET() {
    try {
        const products = await prisma.products.findMany({
            where: {
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
            orderBy: {
                created_at: 'desc',
            },
        });
        return NextResponse.json(products);
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

        const slug = generateSlug(name);

        const newProduct = await prisma.products.create({
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