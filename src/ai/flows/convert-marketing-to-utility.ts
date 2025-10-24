// src/ai/flows/convert-marketing-to-utility.ts
'use server';
/**
 * @fileOverview Converts a marketing template to a utility template.
 *
 * - convertMarketingTemplateToUtility - A function that converts a marketing template to a utility template.
 * - ConvertMarketingTemplateToUtilityInput - The input type for the convertMarketingTemplateToUtility function.
 * - ConvertMarketingTemplateToUtilityOutput - The return type for the convertMarketingTemplateToUtility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    category: z.literal('UTILITY').describe('The category of the converted template (UTILITY).'),
  }).describe('The converted template content.'),
  meta_payload: z.object({
    name: z.string().describe('The name of the template.'),
    category: z.literal('UTILITY').describe('The category of the template (UTILITY).'),
    components: z.array(z.object({
      type: z.string(),
      text: z.string(),
      example: z.record(z.array(z.array(z.string()))).optional(),
    })).describe('The components of the template.'),
    language: z.literal('en').describe('The language of the template (en).'),
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
  input: {schema: ConvertMarketingTemplateToUtilityInputSchema},
  output: {schema: ConvertMarketingTemplateToUtilityOutputSchema},
  prompt: `You are an expert in converting marketing templates to WhatsApp Utility templates, ensuring compliance with Meta Business API policies.

  Convert the following marketing template to a utility template, preserving the key elements.
  Ensure that the converted template focuses on transactional updates and avoids promotional language.

  Brand: {{{brand}}}
  Original Template: {{{originalTemplate}}}
  Key Elements to Preserve: {{{keyElements}}}

  Return the converted template, a Meta-ready JSON payload, compliance status, and optimization suggestions.

  Output in the following JSON format:
  {
    "converted_template": {
      "header": "...",
      "body": "...",
      "footer": "...",
      "category": "UTILITY"
    },
    "meta_payload": {
      "name": "template_name",
      "category": "UTILITY",
      "components": [],
      "language": "en"
    },
    "compliance_check": "PASS/FAIL",
    "optimization_notes": "..."
  }`,
});

const convertMarketingTemplateToUtilityFlow = ai.defineFlow(
  {
    name: 'convertMarketingTemplateToUtilityFlow',
    inputSchema: ConvertMarketingTemplateToUtilityInputSchema,
    outputSchema: ConvertMarketingTemplateToUtilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
