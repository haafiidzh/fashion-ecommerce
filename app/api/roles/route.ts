import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const roles = await prisma.roles.findMany();
    if (!roles) {
      throw new Error("Fetching roles failed");
    }
    return NextResponse.json({
      success: true,
      message: "Roles fetched successfully",
      data: roles,
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
    const { name, guard } = await request.json();
    if (!name || !guard) {
      throw new Error("Name and guard are required");
    }
    const role = await prisma.roles.create({
      data: { name, guard },
    });

    if (!role) {
      throw new Error("Creating role failed");
    }

    return NextResponse.json({
      success: true,
      message: "Role created successfully",
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