import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/Footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 max-w-5xl py-12 mx-auto">
        <Link href="/" className="inline-flex items-center mb-6 text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About Fake News Detector</h1>

          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              Fake News Detector is a tool designed to help people identify potential misinformation and fake news online. In
              today's digital landscape, misleading information can spread rapidly, making it increasingly important to
              have tools that can help verify the credibility of news content.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Our Technology</h2>

            <p className="mb-4">
              Our system uses a combination of natural language processing (NLP) and machine learning algorithms to
              analyze news content for various indicators of potential misinformation:
            </p>

            <div className="grid gap-6 md:grid-cols-2 my-6">
              <Card>
                <CardHeader>
                  <CardTitle>Linguistic Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We analyze the language patterns, emotional tone, and rhetorical devices used in the content that
                    might indicate manipulation or bias.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Source Credibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We evaluate the reputation and reliability of the source, author, and publisher based on historical
                    accuracy and journalistic standards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fact Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We cross-reference claims with established facts from trusted databases and sources to identify
                    inconsistencies or falsehoods.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contextual Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    We examine how information is presented in context, looking for cherry-picking of data, missing
                    context, or misleading framing.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Limitations</h2>

            <p className="mb-4">
              While our tool provides valuable insights, it's important to understand its limitations:
            </p>

            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>No automated system can replace critical thinking and human judgment</li>
              <li>Our analysis provides probabilities, not definitive verdicts on truth</li>
              <li>The tool works best with English-language content from mainstream sources</li>
              <li>Some nuanced forms of misinformation may not be detected</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>

            <p className="mb-6">
              We believe that access to reliable information is essential for a healthy democracy and society. Our
              mission is to empower individuals with tools to make more informed decisions about the content they
              consume and share online.
            </p>

            <p className="mb-6">
              By providing an accessible way to evaluate news content, we hope to contribute to a more
              information-literate public and reduce the spread of harmful misinformation.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>

            <p>
              If you have questions, feedback, or suggestions about Fake News Detector, please contact us at
              <a href="mailto:info@Fake News Detector.com" className="text-blue-600 hover:underline ml-1">
                info@Fake News Detector.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
