import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    if (!id) {
      throw new Error("ID is required");
    }

    const permission = await prisma.permissions.findUnique({
      where: { id: parseInt(id) },
    });
    if (!permission) {
      throw new Error("Permission not found");
    }
    return NextResponse.json({
      success: true,
      message: "Permission found",
      data: permission,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    }, { status: 500 });
  }
}