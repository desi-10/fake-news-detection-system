import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Define the type for analysis results
interface AnalysisResult {
  isLikelyTrue: boolean;
  confidence: number;
  summary: string;
  explanation: string;
  sources: Array<{
    publisher: string;
    url: string;
    rating: "True" | "False" | "Misleading" | "Unverified";
  }>;
}

/**
 * Generates a PDF report from the analysis results
 * @param results The analysis results to include in the PDF
 * @returns Blob containing the generated PDF
 */
export const generatePdfReport = (results: AnalysisResult): Blob => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Fake News Analysis Report', 105, 20, { align: 'center' });
  doc.setDrawColor(0, 0, 0);
  doc.line(20, 25, 190, 25);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  
  // Add reliability assessment
  doc.setFontSize(16);
  doc.text('Reliability Assessment', 20, 45);
  
  doc.setFontSize(14);
  // Fix the setTextColor call by using separate conditional logic
  if (results.isLikelyTrue) {
    doc.setTextColor(0, 128, 0); // Green for true
  } else {
    doc.setTextColor(255, 0, 0); // Red for false
  }
  
  doc.text(
    `${results.isLikelyTrue ? 'Likely True' : 'Likely False'} (${Math.round(results.confidence * 100)}% confidence)`, 
    20, 
    55
  );
  
  // Add summary
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary', 20, 70);
  
  doc.setFontSize(12);
  const summaryLines = doc.splitTextToSize(results.summary, 170);
  doc.text(summaryLines, 20, 80);
  
  // Add explanation
  doc.setFontSize(16);
  doc.text('Detailed Explanation', 20, 110);
  
  doc.setFontSize(12);
  const explanationLines = doc.splitTextToSize(results.explanation, 170);
  doc.text(explanationLines, 20, 120);
  
  // Add sources
  doc.setFontSize(16);
  doc.text('Source Verification', 20, 160);
  
  if (results.sources && results.sources.length > 0) {
    // @ts-ignore - jspdf-autotable types
    doc.autoTable({
      startY: 170,
      head: [['Publisher', 'Rating', 'URL']],
      body: results.sources.map(source => [
        source.publisher,
        source.rating,
        source.url
      ]),
      theme: 'striped',
      headStyles: { fillColor: [66, 133, 244] },
      margin: { top: 170 },
    });
  } else {
    doc.setFontSize(12);
    doc.text('No external sources were found for verification.', 20, 170);
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      'Fake News Detector - AI-powered analysis',
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Return the PDF as a blob
  return doc.output('blob');
};

/**
 * Downloads the generated PDF report
 * @param results The analysis results to include in the PDF
 */
export const downloadPdfReport = (results: AnalysisResult): void => {
  const pdfBlob = generatePdfReport(results);
  const url = URL.createObjectURL(pdfBlob);
  
  // Create a link element and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `fake-news-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};