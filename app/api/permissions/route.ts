import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const permissions = await prisma.permissions.findMany();
  
    if (!permissions) {
      throw new Error("Permissions not found");
    }
  
    return NextResponse.json({
      success: true,
      message: "Permissions fetched successfully",
      data: permissions
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, guard } = await request.json()

    if (!name || !guard) {
      throw new Error("Name and guard are required");
    }

    const permission = await prisma.permissions.create({
      data: { name, guard },
    });

    if (!permission) {
      throw new Error("Creating permission failed");
    }

    return NextResponse.json({
      success: true,
      message: "Permission created successfully",
      data: permission
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, guard } = await request.json()

    if (!id || !name || !guard) {
      throw new Error("Id, name and guard are required");
    }

    const permission = await prisma.permissions.update({
      where: { id },
      data: { name, guard },
    });

    if (!permission) {
      throw new Error("Updating permission failed");
    }

    return NextResponse.json({
      success: true,
      message: "Permission updated successfully",
      data: permission
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      throw new Error("Id is required");
    }

    const permission = await prisma.permissions.delete({
      where: { id },
    })

    if (!permission) {
      throw new Error("Deleting permission failed");
    }

    return NextResponse.json({
      success: true,
      message: "Permission deleted successfully",
      data: permission
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      data: null
    }, { status: 500 });
  }
}