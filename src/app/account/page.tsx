"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CgSpinner } from "react-icons/cg";

// Define the article type based on your API response
interface Article {
  id: string;
  title: string;
  content: string;
  analysedContent: string;
  createdAt: string;
  updatedAt: string;
}

const Account = () => {
  const { data: session, status } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/v1/users/articles");
        const result = await response.json();

        if (response.ok) {
          setArticles(result.data || []);
        } else {
          setError(result.message || "Failed to fetch articles");
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("An error occurred while fetching your articles");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchArticles();
    }
  }, [status]);

  // Function to format date
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    });
  };

  // Function to get summary from analyzed content
  const getAnalysisSummary = (analysedContent: string) => {
    try {
      // The API returns a JSON string, so we need to parse it
      const jsonContent = analysedContent.includes("```json")
        ? analysedContent.replace(/```json\n|\n```/g, "")
        : analysedContent;

      const parsedAnalysis = JSON.parse(jsonContent);
      return {
        isLikelyTrue: parsedAnalysis.isLikelyTrue,
        summary: parsedAnalysis.summary,
        confidence: parsedAnalysis.confidence,
      };
    } catch (e) {
      console.error("Failed to parse analysis result:", e);
      return {
        isLikelyTrue: false,
        summary: "Unable to parse analysis",
        confidence: 0,
      };
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 max-w-5xl w-full py-12 mx-auto px-4">
        <Link href="/" className="inline-flex items-center mb-6 text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Analyzed Articles</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <CgSpinner className="animate-spin text-4xl text-primary" />
            </div>
          ) : error ? (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="py-4">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          ) : articles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">You haven't analyzed any articles yet.</p>
                <Link href="/analyze">
                  <Button>Analyze Your First Article</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => {
                const analysis = getAnalysisSummary(article.analysedContent);
                return (
                  <Card key={article.id} className="flex flex-col h-full">
                    <CardHeader>
                      <CardDescription>
                        Analyzed on {formatDateTime(article.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="mb-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            analysis.isLikelyTrue
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {analysis.isLikelyTrue ? "Likely True" : "Likely False"}
                          {analysis.confidence && ` (${Math.round(analysis.confidence * 100)}%)`}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-3">{analysis.summary}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/article/${article.id}`}>
                        <Button variant="outline">View Full Analysis</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Account;
