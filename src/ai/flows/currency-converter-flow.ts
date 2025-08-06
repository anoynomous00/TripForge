
'use server';

/**
 * @fileOverview An AI-powered flow to convert currencies.
 *
 * - `convert` - A function that handles the currency conversion.
 * - `CurrencyConverterInput` - The input type for the `convert` function.
 * - `CurrencyConverterOutput` - The return type for the `convert` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CurrencyConverterInputSchema = z.object({
  amount: z.number().describe('The amount of money to convert.'),
  from: z.string().describe('The source currency code (e.g., "USD", "EUR").'),
  to: z.string().describe('The target currency code (e.g., "INR", "JPY").'),
});
export type CurrencyConverterInput = z.infer<typeof CurrencyConverterInputSchema>;

const CurrencyConverterOutputSchema = z.object({
  convertedAmount: z.number().describe('The converted amount in the target currency.'),
});
export type CurrencyConverterOutput = z.infer<typeof CurrencyConverterOutputSchema>;

export async function convert(input: CurrencyConverterInput): Promise<CurrencyConverterOutput> {
  return currencyConverterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'currencyConverterPrompt',
  input: { schema: CurrencyConverterInputSchema },
  output: { schema: CurrencyConverterOutputSchema },
  prompt: `Using real-time exchange rates, convert {{{amount}}} {{{from}}} to {{{to}}}. 
  
  Return only the numerical value of the converted amount.`,
});

const currencyConverterFlow = ai.defineFlow(
  {
    name: 'currencyConverterFlow',
    inputSchema: CurrencyConverterInputSchema,
    outputSchema: CurrencyConverterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    