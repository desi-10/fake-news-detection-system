"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<null | {
    isLikelyTrue: boolean;
    confidence: number;
    summary: string;
    explanation: string;
    sources: Array<{
      publisher: string
      url: string
      rating: "True" | "False" | "Misleading" | "Unverified"
    }>
  }>(null)
  const [inputType, setInputType] = useState<"text" | "url">("text")
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)
    setError(null)

    try {
      // Create form data to submit to API
      const formData = new FormData()
      formData.append("content", inputValue)
      
      // Submit to API
      const response = await fetch("/api/v1/users/articles", {
        method: "POST",
        body: formData,
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Parse the AI analysis result from the response
        const analysisResult = result.data.analysedContent
        
        // The API returns a JSON string, so we need to parse it
        let parsedAnalysis
        try {
          parsedAnalysis = JSON.parse(analysisResult)
        } catch (e) {
          console.error("Failed to parse analysis result:", e)
          setError("Failed to parse analysis result")
          setIsAnalyzing(false)
          return
        }
        
        // Set the results state with the parsed analysis
        setResults(parsedAnalysis)
      } else {
        console.error("Failed to analyze content:", result)
        setError(result.message || "Failed to analyze content")
      }
    } catch (error) {
      console.error("Error analyzing content:", error)
      setError("An error occurred while analyzing the content")
    } finally {
      setIsAnalyzing(false)
    }
  }

  
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 max-w-5xl mx-auto py-12">
        <Link href="/" className="inline-flex items-center mb-6 text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-6">Analyze Content</h1>

        {!results ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Submit Content for Analysis</CardTitle>
              <CardDescription>
                Paste an article, news snippet, or URL to analyze for potential
                misinformation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze}>
                <Tabs
                  defaultValue="text"
                  className="mb-6"
                  onValueChange={(value) =>
                    setInputType(value as "text" | "url")
                  }
                >
                  <TabsList className="grid w-full grid-cols-2 h-12">
                    <TabsTrigger value="text" className="">
                      Paste Text
                    </TabsTrigger>
                    <TabsTrigger value="url" className="">
                      Enter URL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="content">News Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Paste the news article or content here..."
                        className="min-h-[200px]"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="url" className="mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="url">News URL</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://example.com/news-article"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                        className="py-6"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  type="submit"
                  className="w-full py-6"
                  disabled={isAnalyzing || !inputValue.trim()}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Content"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Our AI has analyzed the content for signs of misinformation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium">
                      Reliability Assessment
                    </h3>
                    <p className="text-muted-foreground">
                      Based on fact-checking and source analysis
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-3xl font-bold ${
                        results.isLikelyTrue ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {results.isLikelyTrue ? "Likely True" : "Likely False"}
                    </p>
                    <p className="text-sm">
                      {Math.round(results.confidence)}% confidence
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-medium">Summary</h3>
                  <p>{results.summary}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-medium">Detailed Explanation</h3>
                  <p>{results.explanation}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Source Verification</h3>
                  <div className="space-y-3">
                    {results.sources.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{source.publisher}</p>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View source
                          </a>
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            source.rating === "True"
                              ? "bg-green-100 text-green-800"
                              : source.rating === "False"
                              ? "bg-red-100 text-red-800"
                              : source.rating === "Misleading"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {source.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setResults(null)}>
                  Analyze Another
                </Button>
                <Button>Download Report</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What to do next</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="bg-blue-100 p-2 rounded-full h-8 w-8 flex items-center justify-center text-blue-700">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Verify with multiple sources
                      </h4>
                      <p className="text-muted-foreground">
                        Check if other reputable news outlets are reporting the
                        same information
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-blue-100 p-2 rounded-full h-8 w-8 flex items-center justify-center text-blue-700">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Check the date</h4>
                      <p className="text-muted-foreground">
                        Ensure the content is current and not outdated
                        information being presented as new
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-blue-100 p-2 rounded-full h-8 w-8 flex items-center justify-center text-blue-700">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Research the author and source
                      </h4>
                      <p className="text-muted-foreground">
                        Look into the credibility of who wrote the article and
                        where it was published
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
