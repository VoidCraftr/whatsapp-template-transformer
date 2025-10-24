'use server';

/**
 * @fileOverview This file defines a Genkit flow for scoring and analyzing WhatsApp template compliance.
 *
 * The flow assesses templates based on compliance, clarity, engagement, and optimization.
 * - scoreTemplateCompliance - The main function to score and analyze a template.
 * - ScoreTemplateComplianceInput - The input type for the scoring function.
 * - ScoreTemplateComplianceOutput - The output type for the scoring function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  input: {schema: ScoreTemplateComplianceInputSchema},
  output: {schema: ScoreTemplateComplianceOutputSchema},
  prompt: `You are an expert WhatsApp template analyst. You will score the given template based on the following criteria, on a scale of 1-10:

  - Compliance (3 points): Meta policy adherence
  - Clarity (3 points): Message understandability
  - Engagement (2 points): User response likelihood
  - Optimization (2 points): Best practices follow-through

  Provide a detailed analysis of the template, including areas for improvement.  Determine the overall compliance status (PASS/FAIL) and provide optimization suggestions.

  Template: {{{templateText}}}

  Ensure that the complianceScore field reflects the sum of compliancePoints, clarityPoints, engagementPoints, and optimizationPoints.
  Make sure the output is valid JSON.
  `,
});

const scoreTemplateComplianceFlow = ai.defineFlow(
  {
    name: 'scoreTemplateComplianceFlow',
    inputSchema: ScoreTemplateComplianceInputSchema,
    outputSchema: ScoreTemplateComplianceOutputSchema,
  },
  async input => {
    const {output} = await scoreTemplateCompliancePrompt(input);
    return output!;
  }
);
