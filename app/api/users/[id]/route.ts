import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/features/users/types/user-types";
import { hash } from "bcrypt";
import { users } from "@/app/generated/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        pob: true,
        dob: true,
        gender: true,
        email_verified_at: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        user_roles: {
          select: {
            roles: {
              select: {
                id: true,
                name: true,
                guard: true,
                created_at: true,
                updated_at: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transformedUser: User = {
      ...user,
      password: "",
      roles: user.user_roles?.map((ur) => ({
        id: ur.roles.id,
        name: ur.roles.name,
        guard: ur.roles.guard || "",
        created_at: ur.roles.created_at,
        updated_at: ur.roles.updated_at,
      })) || [],
    } as User;

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    const { username, email, password, phone, gender, pob, dob } = body;
    const existingUser: User|null = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Update data:", { username, email, phone, gender, pob, dob });

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        username,
        email,
        password: password ? await hash(password, 10) : existingUser.password,
        phone: phone || null,
        gender: gender || null,
        pob: pob || null,
        dob: dob ? new Date(dob) : null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        pob: true,
        dob: true,
        gender: true,
        email_verified_at: true,
        created_at: true,
        updated_at: true,
        user_roles: {
          select: {
            roles: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const transformedUser = {
      ...updatedUser,
      roles: updatedUser.user_roles.map((ur) => ({ name: ur.roles.name })),
      user_roles: undefined,
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    console.log("Session:", session);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid user ID",
        data: null
      }, { status: 400 });
    }

    const existingUser = await prisma.users.findUnique({
      where: { id: userId },
    });
    
    if (!existingUser) {
      return NextResponse.json({ 
        success: false,
        message: "User not found",
        data: null
      }, { status: 404 });
    }

    const checkUserRoles = await prisma.user_roles.findMany({
      where: { user_id: userId },
    });
    
    if (checkUserRoles.length > 0) {
      await prisma.user_roles.deleteMany({
        where: { user_id: userId },
      });
    }

    const user = await prisma.users.delete({
      where: { id: userId },
    });

    return NextResponse.json({ 
      success: true,
      message: "User deleted successfully",
      data: null
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
        data: null
      },
      { status: 500 }
    );
  }
}
