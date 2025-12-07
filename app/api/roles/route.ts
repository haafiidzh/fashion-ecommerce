import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        data: null,
      },
      { status: 500 }
    );
  }
}

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

export async function PUT(request: Request) {
  try {
    const { id, name, guard } = await request.json();

    if (!id || !name || !guard) {
      throw new Error("Id, name and guard are required");
    }

    const role = await prisma.roles.update({
      where: { id },
      data: { name, guard },
    });

    if (!role) {
      throw new Error("Updating role failed");
    }

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
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

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      throw new Error("Id is required");
    }
    const role = await prisma.roles.delete({
      where: { id },
    });

    if (!role) {
      throw new Error("Deleting role failed");
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
