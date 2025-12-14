import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const category = await prisma.product_category.findUnique({
            where: { id: parseInt(params.id) },
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error(`Failed to fetch category ${params.id}:`, error);
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { name } = await request.json();
        const id = parseInt(params.id);

        if (!name) {
            return NextResponse.json({ error: "Category name is required" }, { status: 400 });
        }

        const updatedCategory = await prisma.product_category.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error(`Failed to update category ${params.id}:`, error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.product_category.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(`Failed to delete category ${params.id}:`, error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}