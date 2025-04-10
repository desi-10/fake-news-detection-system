import { auth } from "@/auth";
import { articleSchema } from "@/schema/article";
import { uploadFile } from "@/utils/cloudinary";
import { prisma } from "@/utils/db";
import { analyzeFactCheckResults, checkFacts } from "@/utils/fact-check";
import { analyzeContentAI } from "@/utils/open-ai";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const articles = await prisma.article.findMany({
      where: { userId: session?.user?.id },
    });

    return NextResponse.json(
      { message: "success", data: articles },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching articles", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsedBody = articleSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { message: "Invalid request:", errors: parsedBody.error.format() },
        { status: 400 }
      );
    }

    const { content } = parsedBody.data;

    let uploadedImage = null;

    if (content as File) {
      uploadedImage = await uploadFile("fake-news-detector", content as File);
    }

    const aiResult = await analyzeContentAI(content as File | string);

    let factCheckResult = null;
    if (typeof content === "string") {
      const factCheckResults = await checkFacts(content);
      factCheckResult = analyzeFactCheckResults(factCheckResults);
    }

    console.log(factCheckResult);

    const article = await prisma.article.create({
      data: {
        userId: session.user?.id as string,
        contentText: uploadedImage ? "" : (content as string),
        contentFile: uploadedImage || undefined,
        analysedContent: aiResult,
        factCheckingContent: "",
      },
    });
    return NextResponse.json(
      { message: "success", data: article },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error creating article:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
