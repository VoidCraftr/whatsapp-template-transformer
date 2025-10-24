'use server';

/**
 * @fileOverview A flow to suggest the most appropriate template category based on the template content.
 *
 * - suggestTemplateCategory - A function that suggests the template category.
 * - SuggestTemplateCategoryInput - The input type for the suggestTemplateCategory function.
 * - SuggestTemplateCategoryOutput - The return type for the suggestTemplateCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTemplateCategoryInputSchema = z.object({
  templateText: z.string().describe('The text content of the template.'),
});
export type SuggestTemplateCategoryInput = z.infer<typeof SuggestTemplateCategoryInputSchema>;

const SuggestTemplateCategoryOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe(
      'The suggested template category (UTILITY, TRANSACTIONAL, MARKETING, etc.) based on the content.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the category suggestion, explaining why the suggested category is appropriate.'
    ),
});
export type SuggestTemplateCategoryOutput = z.infer<typeof SuggestTemplateCategoryOutputSchema>;

export async function suggestTemplateCategory(
  input: SuggestTemplateCategoryInput
): Promise<SuggestTemplateCategoryOutput> {
  return suggestTemplateCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTemplateCategoryPrompt',
  input: {schema: SuggestTemplateCategoryInputSchema},
  output: {schema: SuggestTemplateCategoryOutputSchema},
  prompt: `You are an expert in WhatsApp Business API templates. Your task is to suggest the most appropriate category for a given template, and explain your reasoning.

  The available categories are UTILITY, TRANSACTIONAL and MARKETING.

  Template Text: {{{templateText}}}

  Consider the template text and determine the best category. Provide a short explanation of why you chose that category in the reasoning field.
  `,
});

const suggestTemplateCategoryFlow = ai.defineFlow(
  {
    name: 'suggestTemplateCategoryFlow',
    inputSchema: SuggestTemplateCategoryInputSchema,
    outputSchema: SuggestTemplateCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
