'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Tags } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { suggestCategoryAction } from '@/app/actions';
import type { SuggestTemplateCategoryOutput } from '@/ai/flows/suggest-template-category';

import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { ToolGuide } from '@/components/tool-guide';

const formSchema = z.object({
  templateText: z.string().min(10, 'Template text is required.'),
});

export default function CategoryAdvisorPage() {
  const [result, setResult] = React.useState<SuggestTemplateCategoryOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const response = await suggestCategoryAction(values);
    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: response.error,
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <AppHeader
        title="Category Advisor"
        description="Get an AI-powered recommendation for the best template category (UTILITY, TRANSACTIONAL, or MARKETING)."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="templateText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the body of your template here..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Suggest Category
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed bg-card/50 backdrop-blur-sm">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
                <Loader2 className="relative h-12 w-12 animate-spin text-yellow-500" />
              </div>
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                Analyzing category patterns...
              </p>
            </div>
          )}
          {result && (
            <Card className="backdrop-blur-sm bg-card/50 shadow-lg border-muted transition-all hover:shadow-xl overflow-hidden relative border-t-4 border-t-yellow-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5 text-yellow-500" />
                  AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
                  <h3 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">
                    Suggested Category
                  </h3>
                  <Badge className="text-3xl py-2 px-6 rounded-full font-bold bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg shadow-yellow-500/20">
                    {result.suggestedCategory}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Why this category?
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-base">{result.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <ToolGuide
          title="Category Advisor"
          sections={[
            {
              title: "Why does category matter?",
              content: "Meta charges different rates for 'Marketing', 'Utility', and 'Authentication' templates. Selecting the wrong category can lead to either rejection or paying significantly higher fees than necessary."
            },
            {
              title: "Category Definitions",
              content: [
                "Utility: Specific updates about an ongoing transaction (Order shipped, Payment failed).",
                "Authentication: OTPs and login codes.",
                "Marketing: Everything else. Any promotion, cross-sell, or even general brand updates."
              ]
            }
          ]}
          tips={[
            "If your message contains ANY promotional language, it will likely be flagged as Marketing.",
            "Utility templates must be triggered by a user action.",
            "Authentication templates have the strictest formatting rules."
          ]}
        />
      </div>
    </div>
  );
}
