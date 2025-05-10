import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import WhatToDoNext from "./WhatToDoNext";
import { ResultProps } from "@/app/analyze/page";

const Result = ({
  results,
  setResults,
}: {
  results: ResultProps;
  setResults: (param: any) => void;
}) => {
  return (
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
              <h3 className="text-lg font-medium">Reliability Assessment</h3>
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
                {Math.round(results.confidence) * 100}% confidence
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
              {results.sources && results.sources.length > 0 ? (
                results.sources.map((source, index) => (
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
                ))
              ) : (
                <div className="p-3 border rounded-lg text-center text-gray-500">
                  No external sources were found for verification.
                </div>
              )}
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

      <WhatToDoNext />
    </div>
  );
};

export default Result;
