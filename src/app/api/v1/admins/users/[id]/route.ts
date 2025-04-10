import { auth } from "@/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const id = (await params).id;
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Article: true,
      },
    });

    return NextResponse.json(
      { message: "success", data: user },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching user:", error);
    return NextResponse.json(
      { message: "Something went wrong!", error },
      { status: 500 }
    );
  }
};
