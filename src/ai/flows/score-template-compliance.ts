'use server';

/**
 * @fileOverview This file defines a Genkit flow for scoring and analyzing WhatsApp template compliance.
 *
 * The flow assesses templates based on compliance, clarity, engagement, and optimization.
 * - scoreTemplateCompliance - The main function to score and analyze a template.
 * - ScoreTemplateComplianceInput - The input type for the scoring function.
 * - ScoreTemplateComplianceOutput - The output type for the scoring function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScoreTemplateComplianceInputSchema = z.object({
  templateText: z.string().describe('The text of the WhatsApp template to score.'),
});
export type ScoreTemplateComplianceInput = z.infer<typeof ScoreTemplateComplianceInputSchema>;

const ScoreTemplateComplianceOutputSchema = z.object({
  complianceScore: z
    .number()
    .min(1)
    .max(10)
    .describe('The overall score of the template (1-10).'),
  compliancePoints: z.number().describe('Compliance score (max 3 points)'),
  clarityPoints: z.number().describe('Clarity score (max 3 points)'),
  engagementPoints: z.number().describe('Engagement score (max 2 points)'),
  optimizationPoints: z.number().describe('Optimization score (max 2 points)'),
  analysis: z.string().describe('Detailed analysis of the template, including areas for improvement.'),
  complianceStatus: z.enum(['PASS', 'FAIL']).describe('Overall compliance status.'),
  optimizationNotes: z.string().describe('Suggestions for optimizing the template.'),
});
export type ScoreTemplateComplianceOutput = z.infer<typeof ScoreTemplateComplianceOutputSchema>;

export async function scoreTemplateCompliance(
  input: ScoreTemplateComplianceInput
): Promise<ScoreTemplateComplianceOutput> {
  return scoreTemplateComplianceFlow(input);
}

const scoreTemplateCompliancePrompt = ai.definePrompt({
  name: 'scoreTemplateCompliancePrompt',
  input: { schema: ScoreTemplateComplianceInputSchema },
  output: { schema: ScoreTemplateComplianceOutputSchema },
  prompt: `You are a senior WhatsApp Template Quality Auditor. Your job is to strictly grade templates before they are sent to Meta for review.

  ### GRADING RUBRIC (Total 10 Points):
  1. **Compliance (Max 3 Points)**:
     - 3: Perfect adherence. Proper variable usage ({{1}}), no abusive language, correct category intent.
     - 1-2: Minor issues (e.g., variable format \`[1]\` instead of \`{{1}}\`, ambiguous category).
     - 0: Major violation (sales words in Utility, non-compliant content).

  2. **Clarity (Max 3 Points)**:
     - 3: Crystal clear purpose. User knows exactly *why* they received it.
     - 1-2: Slightly wordy or ambiguous.
     - 0: Confusing or misleading.

  3. **Engagement (Max 2 Points)**:
     - 2: Clear Call-to-Action (CTA), short & punchy (< 300 chars).
     - 1: Passable but dry.
     - 0: Boring, wall of text, or no clear next step.

  4. **Optimization (Max 2 Points)**:
     - 2: Uses variables for personalization, has a header/footer if needed, correct tone.
     - 0-1: Missed opportunities for variables or media.

  ### INPUT:
  Template: {{{templateText}}}

  ### OUTPUT:
  Analyze rigorously. Be tough but fair.
  Return the scores breakdown, total score, pass/fail status, and actionable advice to improve the score.`,
});

const scoreTemplateComplianceFlow = ai.defineFlow(
  {
    name: 'scoreTemplateComplianceFlow',
    inputSchema: ScoreTemplateComplianceInputSchema,
    outputSchema: ScoreTemplateComplianceOutputSchema,
  },
  async input => {
    const { output } = await scoreTemplateCompliancePrompt(input);
    return output!;
  }
);
