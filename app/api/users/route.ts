import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const users = await prisma.users.findMany();
    if (!users) {
      throw new Error("Fetching users failed");
    }
    return NextResponse.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
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

export const POST = async (request: Request) => {
  try {
    const { username, email, password, phone, pob, dob, gender } =
      await request.json();

    if (!username || !email || !password) {
      throw new Error("Username, email and password are required");
    }
    const user = await prisma.users.create({
      data: { username, email, password, phone, pob, dob, gender },
    });

    if (!user) {
      throw new Error("Creating user failed");
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: user,
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

export const PUT = async (request: Request) => {
  try {
    const { id, username, email, password, phone, pob, dob, gender } =
      await request.json();

    if (!id || !username || !email || !password) {
      throw new Error("Id, username, email and password are required");
    }

    const user = await prisma.users.update({
      where: { id },
      data: { username, email, password, phone, pob, dob, gender },
    });
    if (!user) {
      throw new Error("Updating user failed");
    }
    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: user,
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

export const DELETE = async (request: Request) => {
  try {
    const { id } = await request.json();
    if (!id) {
      throw new Error("Id is required");
    }
    const user = await prisma.users.delete({
      where: { id },
    });
    if (!user) {
      throw new Error("Deleting user failed");
    }
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      data: user,
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
