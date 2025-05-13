"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, StarHalf } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signIn, useSession } from "next-auth/react";

export default function FeedbackPage() {
  const { status } = useSession();

  const [activeTab, setActiveTab] = useState("view");
  const [feedbacks, setFeedbacks] = useState<
    {
      id: string;
      content: string;
      rating: number;
      userId: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean | null;
        image: string;
        role: string;
        isAtive: boolean;
        createdAt: string;
        updatedAt: string;
      };
    }[]
  >([]);
  const [newFeedback, setNewFeedback] = useState({
    rating: 5,
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("/api/v1/users/feedbacks");
        const data = await response.json();
        setFeedbacks(data.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/v1/users/feedbacks", {
      method: "POST",
      body: JSON.stringify(newFeedback),
    });

    console.log("response", response);
  };

  const handleRatingChange = (rating: number) => {
    setNewFeedback({ ...newFeedback, rating });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="fill-yellow-400 text-yellow-400 h-5 w-5"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="fill-yellow-400 text-yellow-400 h-5 w-5"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300 h-5 w-5" />);
    }

    return stars;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 max-w-5xl w-full mx-auto py-12">
        <Link href="/" className="inline-flex items-center mb-6 text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-6">User Feedback</h1>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-4xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
            <TabsTrigger value="view">View Feedback</TabsTrigger>
            <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-6">
            <p className="text-muted-foreground mb-6">
              {` See what others are saying about FakeNewsGuard and how it's
              helping them identify misinformation.`}
            </p>

            {feedbacks?.map((feedback) => (
              <Card key={feedback.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {feedback.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {feedback.user.name}
                        </CardTitle>
                        <div className="flex mt-1">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{feedback.content}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
                <CardDescription>
                  We value your feedback! Let us know how Fake News Detector has
                  helped you and how we can improve.
                </CardDescription>
              </CardHeader>
              {status !== "authenticated" ? (
                <CardContent>
                  <p>Please sign in to submit feedback.</p>
                  <Button
                    onClick={() => signIn()}
                    className="max-w-[6rem] py-4 w-full mt-2"
                  >
                    Sign In
                  </Button>
                </CardContent>
              ) : (
                <CardContent>
                  {submitSuccess ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                      Thank you for your feedback! Your input helps us improve
                      FakeNewsGuard.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label>Your Rating</Label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => handleRatingChange(rating)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  rating <= newFeedback.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="comment">Your Feedback</Label>
                        <Textarea
                          id="comment"
                          value={newFeedback.content}
                          onChange={(e) =>
                            setNewFeedback({
                              ...newFeedback,
                              content: e.target.value,
                            })
                          }
                          placeholder="Share your experience with FakeNewsGuard..."
                          className="min-h-[150px]"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full py-6"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
