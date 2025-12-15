import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new Error("ID is required");
    }
    const role = await prisma.roles.findUnique({
      where: { id: parseInt(id) },
    });
    if (!role) {
      throw new Error("Role not found");
    }
    return NextResponse.json({
      success: true,
      message: "Role found",
      data: role,
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new Error("ID is required");
    }
    const { name, guard } = await request.json();
    const role = await prisma.roles.update({
      where: { id: parseInt(id) },
      data: { name, guard },
    });
    if (!role) {
      throw new Error("Role not found");
    }
    return NextResponse.json(
      {
        success: true,
        message: "Role updated successfully",
        data: role,
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new Error("ID is required");
    }

    const role = await prisma.roles.delete({
      where: { id: parseInt(id) },
    });
    if (!role) {
      throw new Error("Role not found");
    }
    return NextResponse.json({
      success: true,
      message: "Role deleted successfully",
      data: role,
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