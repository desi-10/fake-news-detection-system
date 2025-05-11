"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();

  const handleAnalyzeClick = () => {
    router.push("/analyze");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Detect Fake News with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-blue-200 md:text-xl">
                  Our advanced AI analyzes news articles to help you identify
                  potentially misleading information.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <Button
                  onClick={handleAnalyzeClick}
                  className="w-full bg-white text-primary font-bold text-lg py-6 hover:bg-white/90"
                >
                  Start Analyzing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Advanced AI Analysis
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our system uses natural language processing and machine
                  learning to analyze news content for signs of misinformation.
                </p>
              </div>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Analysis</CardTitle>
                    <CardDescription>
                      We analyze the language, tone, and claims made in the
                      article.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Source Verification</CardTitle>
                    <CardDescription>
                      We check the credibility of the source and author.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Fact Checking</CardTitle>
                    <CardDescription>
                      We compare claims against verified facts and trusted
                      sources.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
