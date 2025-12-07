import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    if (!id) {
      throw new Error("ID is required");
    }
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return NextResponse.json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    }, { status: 500 });
  }
}