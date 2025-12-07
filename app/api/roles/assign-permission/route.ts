import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { role_id, permission_id } = await request.json();
    if (!role_id || !permission_id) {
      throw new Error("Role ID and permission ID are required");
    }
    const role = await prisma.roles.findUnique({
      where: { id: role_id },
    });
    if (!role) {
      throw new Error("Role not found");
    }
    const permission = await prisma.permissions.findUnique({
      where: { id: permission_id },
    });
    if (!permission) {
      throw new Error("Permission not found");
    }
    const rolePermission = await prisma.role_permissions.create({
      data: { role_id, permission_id },
    });
    if (!rolePermission) {
      throw new Error("Failed to assign permission to role");
    }
    return NextResponse.json({
      success: true,
      message: "Permission assigned to role successfully",
      data: rolePermission,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    }, { status: 500 });
  }
}