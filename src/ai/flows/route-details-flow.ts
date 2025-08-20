
'use server';

/**
 * @fileOverview An AI-powered flow to provide detailed route information.
 *
 * - `getRouteDetails` - A function that fetches details for a given route.
 * - `RouteDetailsInput` - The input type for the `getRouteDetails` function.
 * - `RouteDetailsOutput` - The return type for the `getRouteDetails` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RouteDetailsInputSchema = z.object({
  source: z.string().describe('The starting point of the journey.'),
  destination: z.string().describe('The final destination of the journey.'),
});
export type RouteDetailsInput = z.infer<typeof RouteDetailsInputSchema>;

const RouteDetailsOutputSchema = z.object({
  timeTaken: z.string().describe('The estimated time to reach the destination (e.g., "approx. 8 hours 30 minutes").'),
  weatherReport: z.string().describe('A brief weather forecast for the route (e.g., "Clear skies with a slight chance of rain near the destination.").'),
  numberOfTolls: z.number().describe('The estimated number of tolls along the route.'),
  tollPrice: z.string().describe('The estimated total price for all tolls, including currency (e.g., "approx. Rs.450").'),
});
export type RouteDetailsOutput = z.infer<typeof RouteDetailsOutputSchema>;

export async function getRouteDetails(input: RouteDetailsInput): Promise<RouteDetailsOutput> {
  return routeDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'routeDetailsPrompt',
  input: { schema: RouteDetailsInputSchema },
  output: { schema: RouteDetailsOutputSchema },
  prompt: `You are a route planning assistant. For the journey from {{{source}}} to {{{destination}}}, provide the following details based on typical conditions:

1.  **Estimated Time Taken**: A realistic travel time estimate.
2.  **Weather Report**: A general weather forecast for the journey.
3.  **Number of Tolls**: An approximate count of toll booths.
4.  **Toll Price**: An estimated total cost for tolls in Indian Rupees (using the 'Rs.' symbol).

Return the response in a structured JSON format.`,
});

const routeDetailsFlow = ai.defineFlow(
  {
    name: 'routeDetailsFlow',
    inputSchema: RouteDetailsInputSchema,
    outputSchema: RouteDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
