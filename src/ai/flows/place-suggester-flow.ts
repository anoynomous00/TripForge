
'use server';

/**
 * @fileOverview An AI-powered flow to suggest travel destinations based on season and preferences.
 *
 * - `suggestPlaces` - A function that handles the place suggestion logic.
 * - `PlaceSuggesterInput` - The input type for the `suggestPlaces` function.
 * - `PlaceSuggesterOutput` - The return type for the `suggestPlaces` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PlaceSuggesterInputSchema = z.object({
  season: z.string().describe('The season for travel (e.g., "Summer", "Winter", "Monsoon").'),
  preference: z.string().describe('The user\'s preference for the type of place (e.g., "Beach", "Hill Station", "Historical", "Adventure").'),
});
export type PlaceSuggesterInput = z.infer<typeof PlaceSuggesterInputSchema>;

const PlaceSuggesterOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      name: z.string().describe('The name of the suggested place.'),
      description: z.string().describe('A brief, inviting description of the place, highlighting key attractions.'),
      imageHint: z.string().describe('A one or two-word hint for generating a representative image (e.g., "Goa beach", "Manali mountains").'),
    })
  ).describe('An array of suggested travel destinations.'),
});
export type PlaceSuggesterOutput = z.infer<typeof PlaceSuggesterOutputSchema>;

export async function suggestPlaces(input: PlaceSuggesterInput): Promise<PlaceSuggesterOutput> {
  return placeSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'placeSuggesterPrompt',
  input: { schema: PlaceSuggesterInputSchema },
  output: { schema: PlaceSuggesterOutputSchema },
  prompt: `You are a travel expert specializing in Indian destinations.

  Based on the user's desired season and preference, suggest 4 travel destinations in India.
  
  For each destination, provide:
  1. The name of the place.
  2. A compelling, one-paragraph description highlighting why it's a great choice for that season and preference. Mention key attractions or experiences.
  3. A simple two-word hint for generating a relevant image (e.g., "Goa beach", "Ooty hills").

  Season: {{{season}}}
  Preference: {{{preference}}}
  
  Format the response as a JSON object adhering to the PlaceSuggesterOutputSchema.`,
});

const placeSuggesterFlow = ai.defineFlow(
  {
    name: 'placeSuggesterFlow',
    inputSchema: PlaceSuggesterInputSchema,
    outputSchema: PlaceSuggesterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
