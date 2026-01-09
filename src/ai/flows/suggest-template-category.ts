'use server';

/**
 * @fileOverview A flow to suggest the most appropriate template category based on the template content.
 *
 * - suggestTemplateCategory - A function that suggests the template category.
 * - SuggestTemplateCategoryInput - The input type for the suggestTemplateCategory function.
 * - SuggestTemplateCategoryOutput - The return type for the suggestTemplateCategory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  input: { schema: SuggestTemplateCategoryInputSchema },
  output: { schema: SuggestTemplateCategoryOutputSchema },
  prompt: `You are a Meta Template Allocator. Your task is to assign the CORRECT billing category to a template message.

  ### DEFINITIONS:
  1. **AUTHENTICATION**: Contains a one-time password (OTP) or code. *Keywords: code, verification, reset.*
  2. **UTILITY**: relates to a *specific* transaction or active recurring billing cycle. *Keywords: order #, shipment, payment failed, statement.*
  3. **MARKETING**: PROMOTIONS, offers, upsells, OR general brand awareness that isn't tied to a specific recent transaction. *Keywords: sale, off, buy, check out, new arrival, feedback survey.*

  ### IMPORTANT RULE:
  If a message is mixed (e.g., an order update that *also* suggests a new product), it defaults to **MARKETING**. This is the "Mixed Category" rule.

  ### INPUT:
  Template Text: {{{templateText}}}

  ### OUTPUT:
  - **suggestedCategory**: One of [UTILITY, AUTHENTICATION, MARKETING].
  - **reasoning**: Explain why. If it's a "Mixed" case, explicitly mention that the promotional content forced it into Marketing.`,
});

const suggestTemplateCategoryFlow = ai.defineFlow(
  {
    name: 'suggestTemplateCategoryFlow',
    inputSchema: SuggestTemplateCategoryInputSchema,
    outputSchema: SuggestTemplateCategoryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
