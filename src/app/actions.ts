
'use server';

import { getSmartStaySuggestions, type SmartStaySuggestionsInput, type SmartStaySuggestionsOutput } from '@/ai/flows/smart-stay-suggestions';
import { translate, type TranslateInput, type TranslateOutput } from '@/ai/flows/translate-text-flow';
import { convert, type CurrencyConverterInput, type CurrencyConverterOutput } from '@/ai/flows/currency-converter-flow';
import { suggestPlaces, type PlaceSuggesterInput, type PlaceSuggesterOutput } from '@/ai/flows/place-suggester-flow';
import { getRouteDetails, type RouteDetailsInput, type RouteDetailsOutput } from '@/ai/flows/route-details-flow';


export async function generateSuggestions(
  input: SmartStaySuggestionsInput
): Promise<{ success: boolean; data?: SmartStaySuggestionsOutput; error?: string }> {
  try {
    const result = await getSmartStaySuggestions(input);
    if (!result || !result.suggestedRoutes) {
      return { success: false, error: 'Could not generate suggestions. The model returned an unexpected response.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in generateSuggestions action:', error);
    return { success: false, error: 'An unexpected error occurred while generating suggestions.' };
  }
}

export async function translateText(
  input: TranslateInput
): Promise<{ success: boolean; data?: TranslateOutput; error?: string }> {
  try {
    const result = await translate(input);
    if (!result || !result.translatedText) {
      return { success: false, error: 'Could not translate text. The model returned an unexpected response.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in translateText action:', error);
    return { success: false, error: 'An unexpected error occurred while translating text.' };
  }
}

export async function convertCurrency(
  input: CurrencyConverterInput
): Promise<{ success: boolean; data?: CurrencyConverterOutput; error?: string }> {
  try {
    const result = await convert(input);
    // The Zod schema ensures convertedAmount is a number, so we can check for its presence.
    if (!result || typeof result.convertedAmount !== 'number') {
      return { success: false, error: 'Could not convert currency. The model returned an unexpected response.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in convertCurrency action:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `An unexpected error occurred during conversion: ${errorMessage}` };
  }
}

export async function generatePlaceSuggestions(
    input: PlaceSuggesterInput
  ): Promise<{ success: boolean; data?: PlaceSuggesterOutput; error?: string }> {
    try {
      const result = await suggestPlaces(input);
      if (!result || !result.suggestions) {
        return { success: false, error: 'Could not generate place suggestions. The model returned an unexpected response.' };
      }
      return { success: true, data: result };
    } catch (error) {
      console.error('Error in generatePlaceSuggestions action:', error);
      return { success: false, error: 'An unexpected error occurred while generating place suggestions.' };
    }
  }

  export async function fetchRouteDetails(
    input: RouteDetailsInput
  ): Promise<{ success: boolean; data?: RouteDetailsOutput; error?: string }> {
    try {
      const result = await getRouteDetails(input);
      if (!result) {
        return { success: false, error: 'Could not fetch route details. The model returned an unexpected response.' };
      }
      return { success: true, data: result };
    } catch (error) {
      console.error('Error in fetchRouteDetails action:', error);
      return { success: false, error: 'An unexpected error occurred while fetching route details.' };
    }
  }
    
