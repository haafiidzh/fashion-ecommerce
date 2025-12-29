import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: { username, email, password: hashedPassword }
    });

    // Assign customer role to new user
    const customerRole = await prisma.roles.findFirst({
      where: { name: "customer" }
    });

    if (customerRole) {
      await prisma.user_roles.create({
        data: {
          user_id: user.id,
          role_id: customerRole.id
        }
      });
    }

    return NextResponse.json(
      { 
        message: "Registrasi berhasil",
        user: { id: user.id, username: user.username, email: user.email }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat registrasi" }, { status: 500 });
  }
}
