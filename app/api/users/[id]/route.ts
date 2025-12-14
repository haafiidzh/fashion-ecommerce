import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { Gender } from "@/app/generated/prisma/enums";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new Error("ID is required");
    }
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return NextResponse.json({
      success: true,
      message: "User fetched successfully",
      data: user,
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      throw new Error(`ID is required`);
    }

    const {
      username,
      email,
      password,
      phone,
      dob,
      pob,
      gender,
    }: {
      username: string;
      email: string;
      password: string;
      phone: string;
      dob: string;
      pob: string;
      gender: Gender;
    } = await request.json();
    
    const user = await prisma.users.findFirst({
      where: { id: parseInt(id), deleted_at: null },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updated = await prisma.users.update({
      where: { id: user.id },
      data: {
        username: username,
        email: email,
        password: await hash(password, 10),
        phone: phone,
        gender: gender,
        dob: new Date(dob),
        pob: pob,
        updated_at: new Date(),
      },
    });

    if (!updated) {
      throw new Error("User not updated");
    }

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: updated,
      },
      { status: 200 }
    );
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id) {
      throw new Error("ID is required");
    }
    const user = await prisma.users.findFirst({
      where: { id: parseInt(id), deleted_at: null },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const deleted = await prisma.users.update({
      where: { id: user.id },
      data: {
        deleted_at: new Date(),
      },
    });
    if (!deleted) {
      throw new Error("User not deleted");
    }
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      data: deleted,
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
}