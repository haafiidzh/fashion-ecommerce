import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const GET = async (request: Request  ) => {
  const user = await prisma.users.create({
    data: {
      username: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
      phone: '1234567890',
      pob: 'New York',
      dob: new Date('1990-01-01'),
      gender: 'male',
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
  });

  return NextResponse.json({
    message: "User created successfully",
    data: user,
  })
}