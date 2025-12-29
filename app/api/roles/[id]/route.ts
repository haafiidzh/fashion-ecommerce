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
    const role = await prisma.roles.findUnique({
      where: { id: parseInt(id) },
      include: {
        role_permissions: {
          include: {
            permissions: true,
          },
        },
      },
    });
    if (!role) {
      throw new Error("Role not found");
    }
    
    // Format data untuk mengembalikan permissions sebagai array of IDs
    const formattedRole = {
      ...role,
      permissions: role.role_permissions.map((rp) => rp.permission_id),
    };
    
    return NextResponse.json({
      success: true,
      message: "Role found",
      data: formattedRole,
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
    const { name, guard, permissions } = await request.json();
    
    // Update role data
    const role = await prisma.roles.update({
      where: { id: parseInt(id) },
      data: { name, guard },
    });
    
    if (!role) {
      throw new Error("Role not found");
    }
    
    if (permissions && Array.isArray(permissions)) {
      await prisma.role_permissions.deleteMany({
        where: { role_id: parseInt(id) },
      });
      
      if (permissions.length > 0) {
        await prisma.role_permissions.createMany({
          data: permissions.map((permissionId: number) => ({
            role_id: parseInt(id),
            permission_id: permissionId,
          })),
        });
      }
    }
    
    const updatedRole = await prisma.roles.findUnique({
      where: { id: parseInt(id) },
      include: {
        role_permissions: {
          include: {
            permissions: true,
          },
        },
      },
    });
    
    const formattedRole = updatedRole ? {
      ...updatedRole,
      permissions: updatedRole.role_permissions.map((rp) => rp.permission_id),
    } : role;
    
    return NextResponse.json(
      {
        success: true,
        message: "Role updated successfully",
        data: formattedRole,
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