import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { user_id, role_id } = await request.json();
    if (!user_id || !role_id) {
      throw new Error("User ID and role ID are required");
    }
    const user = await prisma.users.findUnique({
      where: { id: user_id },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const role = await prisma.roles.findUnique({
      where: { id: role_id },
    });
    if (!role) {
      throw new Error("Role not found");
    }
    const userRole = await prisma.user_roles.delete({
      where: { id: role.id},
    });
    if (!userRole) {
      throw new Error("Failed to detach role from user");
    }
    return NextResponse.json({
      success: true,
      message: "Role detached from user successfully",
      data: userRole,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    }, { status: 500 });
  }
}