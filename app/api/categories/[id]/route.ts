import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const categoryId = parseInt(id);

        if (isNaN(categoryId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const category = await prisma.product_category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error(`Failed to fetch category:`, error);
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { name } = await request.json();
        const { id } = await params;
        const categoryId = parseInt(id);

        if (isNaN(categoryId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const updatedCategory = await prisma.product_category.update({
            where: { id: categoryId },
            data: { name },
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error(`Failed to update category:`, error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const categoryId = parseInt(id);

        if (isNaN(categoryId)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        await prisma.product_category.delete({
            where: { id: categoryId },
        });

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(`Failed to delete category:`, error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}