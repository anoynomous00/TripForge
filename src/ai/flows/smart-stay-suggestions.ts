'use server';

/**
 * @fileOverview AI-powered flow to suggest optimal stay locations and timings during a trip.
 *
 * - `getSmartStaySuggestions` - A function that handles the retrieval of smart stay suggestions.
 * - `SmartStaySuggestionsInput` - The input type for the `getSmartStaySuggestions` function.
 * - `SmartStaySuggestionsOutput` - The return type for the `getSmartStaySuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartStaySuggestionsInputSchema = z.object({
  destination: z.string().describe('The final destination of the trip.'),
  travelers: z.number().describe('The number of travelers in the group.'),
  budget: z.string().describe('The budget for lodging (e.g., "budget", "moderate", "luxury").'),
  preferences: z.string().describe('Specific lodging preferences (e.g., "near beach", "family-friendly", "pet-friendly", "eco-stay", "hidden gem").'),
  currentLocation: z.string().describe('The current location of the travelers.'),
  tripStartDate: z.string().describe('The start date of the trip (YYYY-MM-DD).'),
  dailyTravelDistance: z.number().describe('The approximate number of miles to travel each day.'),
});
export type SmartStaySuggestionsInput = z.infer<typeof SmartStaySuggestionsInputSchema>;

const SmartStaySuggestionsOutputSchema = z.object({
  suggestedStops: z.array(
    z.object({
      location: z.string().describe('The city or town where the overnight stay is recommended.'),
      estimatedArrivalTime: z.string().describe('The estimated time of arrival (YYYY-MM-DD HH:mm).'),
      reason: z.string().describe('Explanation of why this location is a good choice based on the inputs. Mention if it\'s a hidden gem or eco-friendly if applicable.'),
    })
  ).describe('An array of suggested overnight stay locations and arrival times along the route.'),
  routeCities: z.array(z.string()).describe('An array of major cities or towns the vehicle will pass through from the current location to the destination.'),
});
export type SmartStaySuggestionsOutput = z.infer<typeof SmartStaySuggestionsOutputSchema>;

export async function getSmartStaySuggestions(input: SmartStaySuggestionsInput): Promise<SmartStaySuggestionsOutput> {
  return smartStaySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartStaySuggestionsPrompt',
  input: {schema: SmartStaySuggestionsInputSchema},
  output: {schema: SmartStaySuggestionsOutputSchema},
  prompt: `You are a trip planning expert specializing in suggesting optimal overnight stay locations and listing the route.

  Given the following information about a trip, do two things:
  1. Suggest one or more locations for overnight stays along the route. Prioritize "hidden gems" and "eco-friendly" options if mentioned in the preferences. Consider the traveler's other preferences, budget, and group size when making your recommendations. Estimate arrival times assuming dailyTravelDistance miles of travel from the tripStartDate.
  2. List the major cities and towns the vehicle will pass through sequentially from the current location to the destination.

  Destination: {{{destination}}}
  Number of Travelers: {{{travelers}}}
  Budget: {{{budget}}}
  Lodging Preferences: {{{preferences}}}
  Current Location: {{{currentLocation}}}
  Trip Start Date: {{{tripStartDate}}}
  Daily Travel Distance: {{{dailyTravelDistance}}} miles

  Format your response as a JSON object with a "suggestedStops" array and a "routeCities" array. Each object in the "suggestedStops" array should include the "location", "estimatedArrivalTime", and "reason" for the suggestion. The "routeCities" array should be a list of strings. Adhere to the SmartStaySuggestionsOutputSchema Zod descriptions.`, 
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
