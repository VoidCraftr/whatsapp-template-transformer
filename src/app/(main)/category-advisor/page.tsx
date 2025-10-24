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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-8">
        <AppHeader
          title="Category Advisor"
          description="Get an AI-powered recommendation for the best template category (UTILITY, TRANSACTIONAL, or MARKETING)."
        />
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
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-card p-8">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium text-muted-foreground">
                Finding the best category...
              </p>
            </div>
          </div>
        )}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Category Suggestion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 rounded-lg border bg-secondary/30 p-4">
                <Tags className="h-8 w-8 shrink-0 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Suggested Category
                  </h3>
                  <Badge className="text-lg" variant="outline">
                    {result.suggestedCategory}
                  </Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Reasoning</h4>
                <p className="text-muted-foreground">{result.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
