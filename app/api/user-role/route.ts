import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      include: {
        user_roles: {
          include: {
            roles: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roles = user.user_roles.map(ur => ur.roles.name);
    const isAdmin = roles.includes('admin');

    return NextResponse.json({
      success: true,
      roles,
      isAdmin
    });

  } catch (error) {
    console.error("User role check error:", error);
    return NextResponse.json({ error: "Failed to check user role" }, { status: 500 });
  }
}
