import { SeoOptimizerTool } from "@/components/seo/SeoOptimizerTool";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI SEO Optimizer | CelestialGems',
  description: 'Use AI to optimize product descriptions and keywords for better search engine ranking.',
};

export default function SeoOptimizerPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">AI SEO Optimizer</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Select a product to generate AI-powered suggestions for keywords and an optimized description.
        </p>
      </div>
      <SeoOptimizerTool />
    </div>
  );
}
