const FACT_CHECK_API_URL =
  "https://factchecktools.googleapis.com/v1alpha1/claims:search";

export interface FactCheckResult {
  text: string;
  claimant?: string;
  claimDate?: string;
  claimReview: {
    publisher: {
      name: string;
      site?: string;
    };
    url: string;
    title: string;
    reviewDate?: string;
    textualRating?: string;
    languageCode: string;
  }[];
}

export async function checkFacts(query: string): Promise<FactCheckResult[]> {
  try {
    const apiKey = process.env.GOOGLE_FACT_CHECK_API_KEY;
    if (!apiKey) {
      throw new Error("Google Fact Check API key is not configured");
    }

    const response = await fetch(
      `${FACT_CHECK_API_URL}?key=${apiKey}&query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.claims || [];
  } catch (error) {
    console.error("Fact check error:", error);
    throw error;
  }
}

export function analyzeFactCheckResults(results: FactCheckResult[]): {
  isFactual: boolean;
  confidence: number;
  summary: string;
  explanation: string;
  sources: { publisher: string; url: string; rating: string }[];
} {
  if (!results.length) {
    return {
      isFactual: false,
      confidence: 0,
      summary: "No fact-checking information found.",
      explanation:
        "This claim could not be cross-referenced with any reliable fact-check databases. It may be too new, too broad, or widely accepted as common knowledge.",
      sources: [],
    };
  }

  const RATING_CONFIDENCE_MAP: Record<string, number> = {
    true: 1.0,
    "mostly true": 0.9,
    "half true": 0.6,
    "partly true": 0.6,
    mixture: 0.5,
    "partly false": 0.4,
    "mostly false": 0.2,
    false: 0.0,
    "pants on fire": 0.0,
    misleading: 0.2,
    inaccurate: 0.2,
    unsupported: 0.3,
    "no evidence": 0.3,
  };

  let totalConfidence = 0;
  let totalRatings = 0;
  const sources: { publisher: string; url: string; rating: string }[] = [];

  console.log(JSON.stringify(results, null, 2), "fact check results");

  results.forEach((result) => {
    result.claimReview.forEach((review) => {
      const rating = (review.textualRating || "").toLowerCase();
      const match = Object.entries(RATING_CONFIDENCE_MAP).find(([key]) =>
        rating.includes(key)
      );
      const score = match ? match[1] : 0.5; // neutral default
      totalConfidence += score;
      totalRatings++;

      sources.push({
        publisher: review.publisher.name,
        url: review.url,
        rating: review.textualRating || "Unknown",
      });
    });
  });

  const avgConfidence = totalConfidence / totalRatings;
  const isFactual = avgConfidence >= 0.6;

  const summary = `Based on ${totalRatings} fact checks from ${
    new Set(sources.map((s) => s.publisher)).size
  } sources, this claim appears to be ${
    isFactual ? "likely true" : "potentially false"
  } with ${(avgConfidence * 100).toFixed(1)}% confidence.`;

  const explanation = isFactual
    ? "The majority of sources have labeled this claim as true, mostly true, or supported by facts."
    : "Most fact-checking sources have labeled this claim as false, misleading, or lacking evidence.";

  return {
    isFactual,
    confidence: parseFloat(avgConfidence.toFixed(2)),
    summary,
    explanation,
    sources,
  };
}
