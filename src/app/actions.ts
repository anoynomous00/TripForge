'use server';

import { getSmartStaySuggestions, type SmartStaySuggestionsInput, type SmartStaySuggestionsOutput } from '@/ai/flows/smart-stay-suggestions';

export async function generateSuggestions(
  input: SmartStaySuggestionsInput
): Promise<{ success: boolean; data?: SmartStaySuggestionsOutput; error?: string }> {
  try {
    const result = await getSmartStaySuggestions(input);
    if (!result || !result.suggestedStops) {
      return { success: false, error: 'Could not generate suggestions. The model returned an unexpected response.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in generateSuggestions action:', error);
    return { success: false, error: 'An unexpected error occurred while generating suggestions.' };
  }
}
