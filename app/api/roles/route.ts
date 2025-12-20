import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const roles = await prisma.roles.findMany({
      include: {
        role_permissions: {
          include: {
            permissions: true,
          },
        },
      },
    });
    if (!roles) {
      throw new Error("Fetching roles failed");
    }
    
    const formattedRoles = roles.map((role) => ({
      ...role,
      permissions: role.role_permissions.map((rp) => rp.permission_id),
    }));
    
    return NextResponse.json({
      success: true,
      message: "Roles fetched successfully",
      data: formattedRoles,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
        data: null,
      },
      { status: 500 }
    );
  }
};

export async function POST(request: Request) {
  try {
    const { name, guard, permissions } = await request.json();
    if (!name || !guard) {
      throw new Error("Name and guard are required");
    }
    const role = await prisma.roles.create({
      data: { name, guard },
    });

    if (!role) {
      throw new Error("Creating role failed");
    }

    if (permissions && Array.isArray(permissions) && permissions.length > 0) {
      await prisma.role_permissions.createMany({
        data: permissions.map((permissionId: number) => ({
          role_id: role.id,
          permission_id: permissionId,
        })),
      });
    }

    const roleWithPermissions = await prisma.roles.findUnique({
      where: { id: role.id },
      include: {
        role_permissions: {
          include: {
            permissions: true,
          },
        },
      },
    });

    const formattedRole = roleWithPermissions ? {
      ...roleWithPermissions,
      permissions: roleWithPermissions.role_permissions.map((rp) => rp.permission_id),
    } : role;

    return NextResponse.json({
      success: true,
      message: "Role created successfully",
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