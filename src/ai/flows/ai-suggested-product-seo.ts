'use server';
/**
 * @fileOverview An AI-powered tool that suggests SEO improvements for product listings.
 *
 * - suggestSeoImprovements - A function that suggests SEO improvements for a given product description.
 * - SuggestSeoImprovementsInput - The input type for the suggestSeoImprovements function.
 * - SuggestSeoImprovementsOutput - The return type for the suggestSeoImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSeoImprovementsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  currentDescription: z.string().describe('The current description of the product.'),
});
export type SuggestSeoImprovementsInput = z.infer<typeof SuggestSeoImprovementsInputSchema>;

const SuggestSeoImprovementsOutputSchema = z.object({
  suggestedKeywords: z.string().describe('A comma-separated list of suggested keywords for the product.'),
  optimizedDescription: z.string().describe('An optimized description of the product that incorporates the suggested keywords.'),
});
export type SuggestSeoImprovementsOutput = z.infer<typeof SuggestSeoImprovementsOutputSchema>;

export async function suggestSeoImprovements(input: SuggestSeoImprovementsInput): Promise<SuggestSeoImprovementsOutput> {
  return suggestSeoImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSeoImprovementsPrompt',
  input: {schema: SuggestSeoImprovementsInputSchema},
  output: {schema: SuggestSeoImprovementsOutputSchema},
  prompt: `You are an SEO expert specializing in e-commerce product listings. Your goal is to provide keyword suggestions and an optimized product description to improve search engine visibility.

  Product Name: {{{productName}}}
  Current Description: {{{currentDescription}}}

  Provide a comma-separated list of suggested keywords that are relevant to the product and would improve its search engine ranking. Also, create an optimized product description that incorporates the suggested keywords naturally.

  Ensure that the optimized description is engaging, informative, and accurately reflects the product. Focus on benefits and features that would appeal to potential customers.

  Output the suggested keywords and the optimized description in the specified format.
  `,
});

const suggestSeoImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestSeoImprovementsFlow',
    inputSchema: SuggestSeoImprovementsInputSchema,
    outputSchema: SuggestSeoImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
