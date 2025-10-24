'use server';

/**
 * @fileOverview A flow to check if a WhatsApp template is compliant with Meta's policies.
 *
 * - checkTemplatePolicyCompliance - A function that checks template compliance.
 * - CheckTemplatePolicyComplianceInput - The input type for the checkTemplatePolicyCompliance function.
 * - CheckTemplatePolicyComplianceOutput - The return type for the checkTemplatePolicyCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckTemplatePolicyComplianceInputSchema = z.object({
  templateText: z
    .string()
    .describe('The text of the WhatsApp template to check for policy compliance.'),
});
export type CheckTemplatePolicyComplianceInput = z.infer<
  typeof CheckTemplatePolicyComplianceInputSchema
>;

const CheckTemplatePolicyComplianceOutputSchema = z.object({
  isCompliant: z
    .boolean()
    .describe('Whether the template is compliant with Meta policies.'),
  complianceNotes: z
    .string()
    .describe('Notes on why the template is or is not compliant.'),
});
export type CheckTemplatePolicyComplianceOutput = z.infer<
  typeof CheckTemplatePolicyComplianceOutputSchema
>;

export async function checkTemplatePolicyCompliance(
  input: CheckTemplatePolicyComplianceInput
): Promise<CheckTemplatePolicyComplianceOutput> {
  return checkTemplatePolicyComplianceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkTemplatePolicyCompliancePrompt',
  input: {schema: CheckTemplatePolicyComplianceInputSchema},
  output: {schema: CheckTemplatePolicyComplianceOutputSchema},
  prompt: `You are an expert in WhatsApp Business API template policies.

  Analyze the following WhatsApp template text and determine if it is compliant with Meta's policies. Provide a boolean value for compliance, and detailed notes explaining the compliance status, referencing specific policy violations if any.

  Template Text: {{{templateText}}}

  Consider these compliance rules:
  - Utility Templates: No promotional language, focus on transactional updates
  - Variable Format: {{'{'}{'{'}1{'}'}{'}'}}, {{'{'}{'{'}2{'}'}{'}'}} sequential, not at start/end
  - Content Rules: No spam, prohibited items, or misleading claims
  - Category Matching: Use correct category (UTILITY, TRANSACTIONAL, etc.)
  - Clear Purpose: Single, obvious template intention

  Output in JSON format:
  {
    "isCompliant": true/false,
    "complianceNotes": "Detailed notes on compliance status."
  }`,
});

const checkTemplatePolicyComplianceFlow = ai.defineFlow(
  {
    name: 'checkTemplatePolicyComplianceFlow',
    inputSchema: CheckTemplatePolicyComplianceInputSchema,
    outputSchema: CheckTemplatePolicyComplianceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
