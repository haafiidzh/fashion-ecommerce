import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);

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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Transform the data
    const transformedUser = {
      ...user,
      roles: user.user_roles.map((ur) => ({ name: ur.roles.name })),
      user_roles: undefined,
    };

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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    const { username, email, phone, gender, pob, dob } = body;

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        username,
        email,
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

    // Transform the data
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
