'use server';

/**
 * @fileOverview An AI-powered flow to translate text between languages.
 *
 * - `translate` - A function that handles the text translation.
 * - `TranslateInput` - The input type for the `translate` function.
 * - `TranslateOutput` - The return type for the `translate` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  sourceLanguage: z.string().describe('The source language of the text (e.g., "English", "Kannada").'),
  targetLanguage: z.string().describe('The target language for the translation (e.g., "Spanish", "French").'),
});
export type TranslateInput = z.infer<typeof TranslateInputSchema>;

const TranslateOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateOutput = z.infer<typeof TranslateOutputSchema>;

export async function translate(input: TranslateInput): Promise<TranslateOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: { schema: TranslateInputSchema },
  output: { schema: TranslateOutputSchema },
  prompt: `Translate the following text from {{{sourceLanguage}}} to {{{targetLanguage}}}.

Text: {{{text}}}

Return only the translated text.`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateInputSchema,
    outputSchema: TranslateOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
