import { auth } from "@/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = async () => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: { user: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "successfully fetched feedbacks",
      data: feedbacks,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

const feedbackSchema = z.object({
  content: z.string().min(1),
  rating: z.number().min(1).max(5),
});

export const POST = async (request: Request) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsedBody = feedbackSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request", errors: parsedBody.error.format() },
        { status: 400 }
      );
    }
    const { content, rating } = parsedBody.data;

    const newFeedback = await prisma.feedback.create({
      data: {
        content,
        rating,
        userId: session.user.id!,
      },
    });

    return NextResponse.json({
      message: "successfull created feedback",
      data: newFeedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
