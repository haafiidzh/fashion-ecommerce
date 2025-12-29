import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new Error("ID is required");
    }
    const { name, guard } = await request.json();
    const permission = await prisma.permissions.update({
      where: { id: parseInt(id) },
      data: { name, guard },
    });
    if (!permission) {
      throw new Error("Permission not found");
    }
    return NextResponse.json(
      {
        success: true,
        message: "Permission updated successfully",
        data: permission,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new Error("ID is required");
    }

    const permission = await prisma.permissions.delete({
      where: { id: parseInt(id) },
    });
    if (!permission) {
      throw new Error("Permission not found");
    }
    return NextResponse.json({
      success: true,
      message: "Permission deleted successfully",
      data: permission,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        data: null,
      },
      { status: 500 }
    );
  }
}
