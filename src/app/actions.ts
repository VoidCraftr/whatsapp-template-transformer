'use server';

import {
  convertMarketingTemplateToUtility,
  ConvertMarketingToUtilityInput,
  ConvertMarketingToUtilityOutput,
} from '@/ai/flows/convert-marketing-to-utility';
import {
  scoreTemplateCompliance,
  ScoreTemplateComplianceInput,
  ScoreTemplateComplianceOutput,
} from '@/ai/flows/score-template-compliance';
import {
  checkTemplatePolicyCompliance,
  CheckTemplatePolicyComplianceInput,
  CheckTemplatePolicyComplianceOutput,
} from '@/ai/flows/check-template-policy-compliance';
import {
  suggestTemplateCategory,
  SuggestTemplateCategoryInput,
  SuggestTemplateCategoryOutput,
} from '@/ai/flows/suggest-template-category';

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function convertTemplateAction(
  input: ConvertMarketingToUtilityInput
): Promise<ActionResult<ConvertMarketingToUtilityOutput>> {
  try {
    const result = await convertMarketingTemplateToUtility(input);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to convert template. Please check the input and try again.' };
  }
}

export async function scoreTemplateAction(
  input: ScoreTemplateComplianceInput
): Promise<ActionResult<ScoreTemplateComplianceOutput>> {
  try {
    const result = await scoreTemplateCompliance(input);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to score template. Please check the input and try again.' };
  }
}

export async function checkPolicyAction(
  input: CheckTemplatePolicyComplianceInput
): Promise<ActionResult<CheckTemplatePolicyComplianceOutput>> {
  try {
    const result = await checkTemplatePolicyCompliance(input);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to check policy compliance. Please check the input and try again.' };
  }
}

export async function suggestCategoryAction(
  input: SuggestTemplateCategoryInput
): Promise<ActionResult<SuggestTemplateCategoryOutput>> {
  try {
    const result = await suggestTemplateCategory(input);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to suggest category. Please check the input and try again.' };
  }
}
