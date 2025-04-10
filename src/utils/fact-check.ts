const FACT_CHECK_API_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

interface FactCheckResult {
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
      throw new Error('Google Fact Check API key is not configured');
    }

    const response = await fetch(
      `${FACT_CHECK_API_URL}?key=${apiKey}&query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.claims || [];
  } catch (error) {
    console.error('Fact check error:', error);
    throw error;
  }
}

export function analyzeFactCheckResults(results: FactCheckResult[]): {
  isFactual: boolean;
  confidence: number;
  summary: string;
} {
  if (!results.length) {
    return {
      isFactual: false,
      confidence: 0,
      summary: 'No fact-checking information found.',
    };
  }

  let factualCount = 0;
  let totalRatings = 0;

  const ratings = results.flatMap(result => 
    result.claimReview.map(review => review.textualRating?.toLowerCase() || '')
  );

  ratings.forEach(rating => {
    if (rating.includes('true') || rating.includes('fact') || rating.includes('accurate')) {
      factualCount++;
    }
    totalRatings++;
  });

  const confidence = totalRatings > 0 ? (factualCount / totalRatings) : 0;
  const isFactual = confidence > 0.5;

  return {
    isFactual,
    confidence,
    summary: `Based on ${totalRatings} fact checks, this claim appears to be ${
      isFactual ? 'likely true' : 'potentially false'
    } with ${(confidence * 100).toFixed(1)}% confidence.`,
  };
}