import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find admin role
    const adminRole = await prisma.roles.findFirst({ where: { name: "admin" } });
    if (!adminRole) {
      return NextResponse.json({ error: "Admin role not found" }, { status: 404 });
    }

    // Check if user already has admin role
    const existingRole = await prisma.user_roles.findFirst({
      where: {
        user_id: user.id,
        role_id: adminRole.id
      }
    });

    if (!existingRole) {
      // Assign admin role to user
      await prisma.user_roles.create({
        data: {
          user_id: user.id,
          role_id: adminRole.id
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `User ${email} has been assigned admin role`
    });

  } catch (error) {
    console.error("Make admin error:", error);
    return NextResponse.json({ error: "Failed to assign admin role" }, { status: 500 });
  }
}
