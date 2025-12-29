import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const addresses = await prisma.addresses.findMany({
      where: { user_id: parseInt(userId) },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(addresses);

  } catch (error) {
    console.error("Addresses fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, phone, province, region, district, village, post_code, note } = body;

    if (!user_id || !phone || !province || !region || !district || !village || !post_code) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const newAddress = await prisma.addresses.create({
      data: {
        user_id: parseInt(user_id),
        phone,
        province,
        region,
        district,
        village,
        post_code,
        note: note || "",
      },
    });

    return NextResponse.json(newAddress, { status: 201 });

  } catch (error) {
    console.error("Address creation error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}
