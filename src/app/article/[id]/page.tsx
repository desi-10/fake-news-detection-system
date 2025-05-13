"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
import Result from "@/components/analyze/Result";
import { CgSpinner } from "react-icons/cg";
import WhatToDoNext from "@/components/analyze/WhatToDoNext";

interface Article {
  id: string;
  title: string;
  content: string;
  analysedContent: string;
  createdAt: string;
  updatedAt: string;
}

export default function ArticlePage() {
  const { id } = useParams();
  const { status } = useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedResults, setParsedResults] = useState(null);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/v1/users/articles/${id}`);
        const result = await response.json();

        if (response.ok && result.data) {
          setArticle(result.data);
          
          // Parse the analysis results
          try {
            const analysedContent = result.data.analysedContent;
            const jsonContent = analysedContent.includes("```json")
              ? analysedContent.replace(/```json\n|\n```/g, "")
              : analysedContent;

            const parsedAnalysis = JSON.parse(jsonContent);
            
            // Ensure sources is always an array, even if empty
            if (!parsedAnalysis.sources) {
              parsedAnalysis.sources = [];
            }
            
            setParsedResults(parsedAnalysis);
          } catch (e) {
            console.error("Failed to parse analysis result:", e);
            setError("Failed to parse analysis result");
          }
        } else {
          setError(result.message || "Failed to fetch article");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("An error occurred while fetching the article");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && id) {
      fetchArticle();
    }
  }, [status, id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <CgSpinner className="animate-spin text-6xl text-primary" />
        <p className="mt-4">Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 max-w-5xl py-12 mx-auto px-4">
          <Link href="/account" className="inline-flex items-center mb-6 text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account
          </Link>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 max-w-5xl py-12 mx-auto px-4">
        <Link href="/account" className="inline-flex items-center mb-6 text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Account
        </Link>

        <h1 className="text-3xl font-bold mb-6">
          {article?.title || "Article Analysis"}
        </h1>

        {parsedResults && (
          <div className="space-y-6">
            <Result results={parsedResults} setResults={setParsedResults} />
            <WhatToDoNext />
          </div>
        )}
      </main>
    </div>
  );
}