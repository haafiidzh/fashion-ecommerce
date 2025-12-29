import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updatedAddress = await prisma.addresses.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedAddress);

  } catch (error) {
    console.error("Address update error:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    await prisma.addresses.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Address deleted successfully" });

  } catch (error) {
    console.error("Address deletion error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
