import { auth } from "@/auth";
import { articleSchema } from "@/schema/article";
import { uploadFile } from "@/utils/cloudinary";
import { prisma } from "@/utils/db";
import { extractTextFromFile } from "@/utils/extra-from-file";
import { checkFacts } from "@/utils/fact-check";
import analyzeContentAI from "@/utils/google-ai";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await auth();
    // const session = { user: { id: "cm9btj2l00000gdikgbur8xt4" } };
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const articles = await prisma.article.findMany({
      where: { userId: session.user.id },
    });

    const parsedArticles = articles.map((article) => {
      return {
        ...article,
        factCheckingContent: JSON.parse(article.factCheckingContent),
      };
    });

    return NextResponse.json(
      {
        message: "success",
        data: parsedArticles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const session = await auth();
    // For testing, uncomment below
    // const session = { user: { id: "cm9frbyk20000l804x02mhebn" } };

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.formData();

    const parsedBody = articleSchema.safeParse({
      content: body.get("content") as File | string,
    });

    if (!parsedBody.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: parsedBody.error.format() },
        { status: 400 }
      );
    }

    const { content } = parsedBody.data;

    let extractedText: string | null | undefined = null;
    let uploadedImage = null;

    if (content instanceof File) {
      uploadedImage = await uploadFile("fake-news-detector", content);
      extractedText = await extractTextFromFile(content);
    } else {
      extractedText = content;
    }

    if (!extractedText) {
      return NextResponse.json(
        { message: "Failed to extract text from the file" },
        { status: 400 }
      );
    }

    const factCheckResults = await checkFacts(extractedText);

    if (factCheckResults.length === 0) {
      return NextResponse.json(
        { message: "No facts found in the text" },
        { status: 200 }
      );
    }

    const aiResult = await analyzeContentAI(extractedText, factCheckResults);

    const article = await prisma.article.create({
      data: {
        userId: session.user.id as string,
        contentText: extractedText as string,
        contentFile: uploadedImage
          ? { url: uploadedImage.url, id: uploadedImage.id }
          : undefined,
        analysedContent: aiResult || "",
        factCheckingContent: JSON.stringify(factCheckResults),
      },
    });

    console.log(article);

    return NextResponse.json(
      {
        message: "success",
        data: {
          ...article,
          factCheckingContent: JSON.parse(article.factCheckingContent),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
