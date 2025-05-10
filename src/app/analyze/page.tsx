"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import Loader from "@/components/analyze/Loader";
import ErrorAlert from "@/components/analyze/ErrorAlert";
import Result from "@/components/analyze/Result";
import { CgClose } from "react-icons/cg";

export type ResultProps = {
  isLikelyTrue: boolean;
  confidence: number;
  summary: string;
  explanation: string;
  sources: Array<{
    publisher: string;
    url: string;
    rating: "True" | "False" | "Misleading" | "Unverified";
  }>;
};

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<null | ResultProps>(null);
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    setSelectedImage(file);
    setInputValue(file.name); // Set the file name for display purposes

    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);

    try {
      // Create form data to submit to API
      const formData = new FormData();
      
      if (inputType === "text") {
        formData.append("content", inputValue);
      } else if (inputType === "file" && selectedImage) {
        formData.append("content", selectedImage);
      } else {
        setError("Please provide content or select an image to analyze");
        setIsAnalyzing(false);
        return;
      }

      // Submit to API
      const response = await fetch("/api/v1/users/articles", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Parse the AI analysis result from the response
        const analysisResult = result.data.analysedContent;

        // The API returns a JSON string, so we need to parse it
        let parsedAnalysis;
        try {
          // Check if the result is already a string or if it contains the JSON string with backticks
          const jsonContent = analysisResult.includes("```json")
            ? analysisResult.replace(/```json\n|\n```/g, "")
            : analysisResult;

          parsedAnalysis = JSON.parse(jsonContent);

          // Ensure sources is always an array, even if empty
          if (!parsedAnalysis.sources) {
            parsedAnalysis.sources = [];
          }
        } catch (e) {
          console.error("Failed to parse analysis result:", e);
          setError("Failed to parse analysis result");
          setIsAnalyzing(false);
          return;
        }

        // Set the results state with the parsed analysis
        setResults(parsedAnalysis);
      } else {
        console.error("Failed to analyze content:", result);
        setError(result.message || "Failed to analyze content");
      }
    } catch (error) {
      console.error("Error analyzing content:", error);
      setError("An error occurred while analyzing the content");
    } finally {
      setIsAnalyzing(false);
      // Clean up preview URL when done
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setInputValue("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex min-h-screen flex-col relative">
      <main className="flex-1 max-w-5xl mx-auto py-12">
        <Link href="/" className="inline-flex items-center mb-6 text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-6">Analyze Content</h1>

        <ErrorAlert error={error} setError={setError} />

        {!results ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Submit Content for Analysis</CardTitle>
              <CardDescription>
                Paste an article, news snippet, or upload an image to analyze for potential
                misinformation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze}>
                <Tabs
                  defaultValue="text"
                  className="mb-6"
                  onValueChange={(value) => {
                    setInputType(value as "text" | "file");
                    handleReset();
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2 h-12">
                    <TabsTrigger value="text" className="">
                      Paste Text
                    </TabsTrigger>
                    <TabsTrigger value="file" className="">
                      Upload Image
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
                        required={inputType === "text"}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="file" className="mt-4">
                    <div className="grid gap-4">
                      <Label htmlFor="file">Image File</Label>
                      <div className="flex flex-col items-center gap-4">
                        <Input
                          id="file"
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          required={inputType === "file"}
                          className="py-2"
                        />
                        
                        {previewUrl && (
                          <div className="mt-4 relative">
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="max-h-[300px] rounded-md border border-gray-200" 
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="absolute top-2 right-2 h-8 w-8 p-0"
                              onClick={handleReset}
                            >
                              <CgClose className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        {!previewUrl && (
                          <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                               onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  type="submit"
                  className="w-full py-6"
                  disabled={isAnalyzing || (inputType === "text" ? !inputValue.trim() : !selectedImage)}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Content"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Result results={results} setResults={setResults} />
        )}
      </main>
      <Footer />
      {isAnalyzing && <Loader />}
    </div>
  );
}
