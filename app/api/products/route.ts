import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const products = await prisma.products.findMany({
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

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Product name is required" }, { status: 400 });
        }

        const newProduct = await prisma.products.create({
            data: { name },
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Failed to create product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}