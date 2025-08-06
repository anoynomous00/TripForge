'use server';

/**
 * @fileOverview AI-powered flow to suggest optimal stay locations and timings during a trip.
 *
 * - `getSmartStaySuggestions` - A function that handles the retrieval of smart stay suggestions.
 * - `SmartStaySuggestionsInput` - The input type for the `getSmartStaySuggestions` function.
 * - `SmartStaySuggestionsOutput` - The return type for the `getSmartStaySuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SmartStaySuggestionsInputSchema = z.object({
  destination: z.string().describe('The final destination of the trip.'),
  travelers: z.number().describe('The number of travelers in the group.'),
  budget: z.string().describe('The budget for lodging (e.g., "budget", "moderate", "luxury").'),
  preferences: z.string().describe('Specific lodging preferences (e.g., "near beach", "family-friendly", "pet-friendly", "eco-stay", "hidden gem").'),
  currentLocation: z.string().describe('The current location of the travelers.'),
  tripStartDate: z.string().describe('The start date of the trip (YYYY-MM-DD).'),
  tripEndDate: z.string().describe('The end date of the trip (YYYY-MM-DD).'),
});
export type SmartStaySuggestionsInput = z.infer<typeof SmartStaySuggestionsInputSchema>;

const SmartStaySuggestionsOutputSchema = z.object({
  suggestedRoutes: z.array(z.object({
    routeName: z.string().describe('A descriptive name for the route (e.g., "The Coastal Route", "The Mountain Pass").'),
    routeCities: z.array(z.string()).describe('An array of major cities or towns the vehicle will pass through sequentially from the current location to the destination for this route.'),
    suggestedStops: z.array(
      z.object({
        location: z.string().describe('The city or town where the overnight stay is recommended.'),
        estimatedArrivalTime: z.string().describe('The estimated time of arrival (YYYY-MM-DD HH:mm).'),
        reason: z.string().describe('Explanation of why this location is a good choice. Mention any special hotels, temples, or points of interest. Mention if it\'s a hidden gem or eco-friendly if applicable.'),
      })
    ).describe('An array of suggested overnight stay locations and arrival times along this specific route.'),
  })).describe('An array of different suggested routes from the current location to the destination.')
});
export type SmartStaySuggestionsOutput = z.infer<typeof SmartStaySuggestionsOutputSchema>;

export async function getSmartStaySuggestions(input: SmartStaySuggestionsInput): Promise<SmartStaySuggestionsOutput> {
  return smartStaySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartStaySuggestionsPrompt',
  input: {schema: SmartStaySuggestionsInputSchema},
  output: {schema: SmartStaySuggestionsOutputSchema},
  prompt: `You are a trip planning expert specializing in suggesting multiple alternative routes and optimal overnight stay locations.

  Given the following information about a trip, do two things:
  1. Suggest 2-3 different routes from the current location to the destination. For each route, provide a descriptive name (e.g., "The Scenic Route", "The Direct Path").
  2. For each route, list the major cities and towns the vehicle will pass through sequentially.
  3. For each route, suggest one or more locations for overnight stays. For each stop, provide a reason. In the reason, you MUST mention specific points of interest like special hotels or famous temples in or near that city. Prioritize "hidden gems" and "eco-friendly" options if mentioned in the preferences. Consider the traveler's other preferences, budget, and group size. Estimate arrival times assuming a reasonable daily travel distance (around 300-400 miles or 500-650 km) from the tripStartDate, taking into account the tripEndDate for the total duration.

  Destination: {{{destination}}}
  Number of Travelers: {{{travelers}}}
  Budget: {{{budget}}}
  Lodging Preferences: {{{preferences}}}
  Current Location: {{{currentLocation}}}
  Trip Start Date: {{{tripStartDate}}}
  Trip End Date: {{{tripEndDate}}}

  Format your response as a JSON object with a "suggestedRoutes" array. Each object in the array should represent a different route and contain "routeName", "routeCities", and "suggestedStops". Adhere to the SmartStaySuggestionsOutputSchema Zod descriptions.`, 
});

const smartStaySuggestionsFlow = ai.defineFlow(
  {
    name: 'smartStaySuggestionsFlow',
    inputSchema: SmartStaySuggestionsInputSchema,
    outputSchema: SmartStaySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
