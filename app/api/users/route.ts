import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

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
    const body = await request.json();
    const { username, email, password, phone, pob, dob, gender } = body;

    if (!username || !email || !password) {
      throw new Error("Username, email and password are required");
    }
    
    const userData: any = {
      username,
      email,
      password: await hash(password, 10),
      phone: phone || null,
      pob: pob || null,
      dob: dob ? new Date(dob) : null,
      gender: gender && gender !== "" ? gender.toLowerCase() : null,
    };
    
    const user = await prisma.users.create({
      data: userData,
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