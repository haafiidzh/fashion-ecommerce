import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { name: string } }) {
  try {
    const { name } = await params;
    if (!name) {
      throw new Error("Name is required");
    }
    const role = await prisma.roles.findFirst({
      where: { name },
    });
    if (!role) {
      throw new Error("Role not found");
    }
    return NextResponse.json({
      success: true,
      message: "Role found",
      data: true,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    }, { status: 500 });
  }
}