// src/ai/flows/convert-marketing-to-utility.ts
'use server';
/**
 * @fileOverview Converts a marketing template to a utility template.
 *
 * - convertMarketingTemplateToUtility - A function that converts a marketing template to a utility template.
 * - ConvertMarketingTemplateToUtilityInput - The input type for the convertMarketingTemplateToUtility function.
 * - ConvertMarketingTemplateToUtilityOutput - The return type for the convertMarketingTemplateToUtility function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConvertMarketingTemplateToUtilityInputSchema = z.object({
  brand: z.string().describe('The brand name.'),
  originalTemplate: z.string().describe('The original marketing template text.'),
  keyElements: z.string().describe('The key elements to preserve in the converted template.'),
});
export type ConvertMarketingTemplateToUtilityInput = z.infer<typeof ConvertMarketingTemplateToUtilityInputSchema>;

const ConvertMarketingTemplateToUtilityOutputSchema = z.object({
  converted_template: z.object({
    header: z.string().optional().describe('The header of the converted template.'),
    body: z.string().describe('The body of the converted template.'),
    footer: z.string().optional().describe('The footer of the converted template.'),
    category: z.enum(['UTILITY']).describe('The category of the converted template (UTILITY).'),
  }).describe('The converted template content.'),
  meta_payload: z.object({
    name: z.string().describe('The name of the template.'),
    category: z.enum(['UTILITY']).describe('The category of the template (UTILITY).'),
    components: z.array(z.object({
      type: z.string(),
      text: z.string(),
      example: z.object({
        header_text: z.array(z.string()).optional(),
        body_text: z.array(z.array(z.string())).optional(),
        header_handle: z.array(z.string()).optional(),
      }).optional(),
    })).describe('The components of the template.'),
    language: z.enum(['en']).describe('The language of the template (en).'),
  }).describe('The Meta payload for the template.'),
  compliance_check: z.enum(['PASS', 'FAIL']).describe('The compliance check result (PASS or FAIL).'),
  optimization_notes: z.string().describe('Optimization notes for the template.'),
});
export type ConvertMarketingTemplateToUtilityOutput = z.infer<typeof ConvertMarketingTemplateToUtilityOutputSchema>;

export async function convertMarketingTemplateToUtility(input: ConvertMarketingTemplateToUtilityInput): Promise<ConvertMarketingTemplateToUtilityOutput> {
  return convertMarketingTemplateToUtilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertMarketingTemplateToUtilityPrompt',
  input: { schema: ConvertMarketingTemplateToUtilityInputSchema },
  output: { schema: ConvertMarketingTemplateToUtilityOutputSchema },
  prompt: `You are a specialized WhatsApp Business API Compliance Officer. Your goal is to rewrite high-risk Marketing templates into safe, low-risk UTILITY or TRANSACTIONAL templates that will pass Meta's strict review.

  ### MISSION:
  Convert the user's input (Brand, Original Marketing Template, Key Elements) into a pure Utility message.
  A Utility message serves to confirm or update a user about a specific, existing transaction or account change initiated by them.

  ### STRICT GUIDELINES:
  1. **NO PROMOTIONAL CONTENT**: Completely remove all upsells, cross-sells, "limited time offers", discount codes, or salesy adjectives (e.g., "amazing", "huge", "don't miss out").
  2. **TONE OF VOICE**: Must be neutral, informational, and dry. Not excited.
  3. **STRUCTURE**:
     - Focus strictly on the "Event" (e.g., Order Confirmed, Shipment Delayed, Payment Received).
     - Use variables ({{1}}, {{2}}) for dynamic data like Order IDs, Dates, or specific Item Names.
     - Avoid "Call to Action" buttons that imply new sales (e.g. "Browse Shop"). Use distinct actions like "View Order" or "Track Shipment".
  4. **KEY ELEMENTS**: Preserve the core info required by the user, but strip the sales contexts.

  ### INPUT DATA:
  Brand: {{{brand}}}
  Original Marketing Template: {{{originalTemplate}}}
  Key Elements to Preserve: {{{keyElements}}}

  ### OUTPUT INSTRUCTIONS:
  - **converted_template**: The rewritten, safe text.
  - **meta_payload**: The exact JSON structure for the WhatsApp API.
  - **compliance_check**: "PASS" only if you are 100% sure it meets Utility guidelines. "FAIL" otherwise.
  - **optimization_notes**: Explain *why* you changed certain words (e.g., "Changed 'Buy Now' to 'View Order' to match Utility intent").

  Output strictly in the requested JSON format.`,
});

const convertMarketingTemplateToUtilityFlow = ai.defineFlow(
  {
    name: 'convertMarketingTemplateToUtilityFlow',
    inputSchema: ConvertMarketingTemplateToUtilityInputSchema,
    outputSchema: ConvertMarketingTemplateToUtilityOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
