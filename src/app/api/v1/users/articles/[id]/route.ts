import { auth } from "@/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const id = (await params).id;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const articles = await prisma.article.findUnique({
      where: { id, userId: session.user?.id },
    });

    return NextResponse.json(
      { message: "success", data: articles },
      { status: 200 }
    );
  } catch (error) {
    console.log("", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
