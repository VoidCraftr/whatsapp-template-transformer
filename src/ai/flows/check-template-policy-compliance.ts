'use server';

/**
 * @fileOverview A flow to check if a WhatsApp template is compliant with Meta's policies.
 *
 * - checkTemplatePolicyCompliance - A function that checks template compliance.
 * - CheckTemplatePolicyComplianceInput - The input type for the checkTemplatePolicyCompliance function.
 * - CheckTemplatePolicyComplianceOutput - The return type for the checkTemplatePolicyCompliance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  input: { schema: CheckTemplatePolicyComplianceInputSchema },
  output: { schema: CheckTemplatePolicyComplianceOutputSchema },
  prompt: `You are a Meta Policy Enforcement Agent. Your job is to approve or reject WhatsApp template submissions based on the Commerce and Business Messaging policies.

  ### VIOLATION CHECKLIST:
  1. **Formatting**:
     - Variables must be sequential ({{1}}, {{2}}). Random numbers like {{54}} are rejected.
     - Variables cannot have special characters (e.g. {{$1}}).
     - "Floating parameters" (lines containing *only* variables) are often rejected.

  2. **Content**:
     - **Abusive/Threatening**: Harassment, hate speech.
     - **Deceptive**: "You won a prize!" scams.
     - **Prohibited**: Gambling, alcohol, subscriptions (Netflix-like), health/medical data requests.

  3. **Category Mismatch**:
     - If it sounds like a sale but uses "Utility" phrasing to bypass checks, REJECT it.

  ### INPUT:
  Template Text: {{{templateText}}}

  ### OUTPUT:
  - **isCompliant**: true only if NO violations are found.
  - **complianceNotes**: If REJECTED, cite the specific policy clause. If APPROVED, mention "Clean and compliant."`,
});

const checkTemplatePolicyComplianceFlow = ai.defineFlow(
  {
    name: 'checkTemplatePolicyComplianceFlow',
    inputSchema: CheckTemplatePolicyComplianceInputSchema,
    outputSchema: CheckTemplatePolicyComplianceOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
