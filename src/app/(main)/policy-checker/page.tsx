'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkPolicyAction } from '@/app/actions';
import type { CheckTemplatePolicyComplianceOutput } from '@/ai/flows/check-template-policy-compliance';
import { ToolGuide } from '@/components/tool-guide';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  templateText: z.string().min(10, 'Template text is required.'),
});

export default function PolicyCheckerPage() {
  const [result, setResult] = React.useState<CheckTemplatePolicyComplianceOutput | null>(null);
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
    const response = await checkPolicyAction(values);
    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Check Failed',
        description: response.error,
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <AppHeader
        title="Policy Checker"
        description="Pre-validate your template text against Meta's Business API guidelines to increase approval chances."
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
                    <FormLabel>Template to Check</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Is this template compliant? BIG SALE! Get 50% off."
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
                Check Compliance
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed bg-card/50 backdrop-blur-sm">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Loader2 className="relative h-12 w-12 animate-spin text-primary" />
              </div>
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                Running policy validation...
              </p>
            </div>
          )}
          {result && (
            <Card className="backdrop-blur-sm bg-card/50 shadow-lg border-muted transition-all hover:shadow-xl overflow-hidden relative">
              <div className={`absolute top-0 w-full h-2 ${result.isCompliant ? 'bg-green-500' : 'bg-red-500'}`} />
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 ${result.isCompliant ? 'bg-green-500/10' : 'bg-red-500/10'}`} />

              <CardHeader>
                <CardTitle>Compliance Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div
                  className={cn(
                    'flex flex-col items-center justify-center gap-4 rounded-2xl p-8 border transition-colors',
                    result.isCompliant
                      ? 'border-green-500/20 bg-green-500/5'
                      : 'border-destructive/20 bg-destructive/5'
                  )}
                >
                  <div className={cn("p-4 rounded-full", result.isCompliant ? 'bg-green-500/20 text-green-600' : 'bg-destructive/20 text-destructive')}>
                    {result.isCompliant ? (
                      <CheckCircle2 className="h-10 w-10" />
                    ) : (
                      <XCircle className="h-10 w-10" />
                    )}
                  </div>

                  <div className="text-center">
                    <h3
                      className={cn(
                        'text-2xl font-bold mb-1',
                        result.isCompliant ? 'text-green-600 dark:text-green-400' : 'text-destructive'
                      )}
                    >
                      {result.isCompliant ? 'Compliant' : 'Significant Violations Found'}
                    </h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                      {result.isCompliant
                        ? 'This template aligns with current Meta policies.'
                        : 'This template risks rejection by Meta.'}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("w-1.5 h-1.5 rounded-full", result.isCompliant ? 'bg-green-500' : 'bg-red-500')} />
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Compliance Analysis</h4>
                  </div>
                  <p className="text-foreground leading-relaxed bg-background/50 p-4 rounded-xl border border-muted/50">{result.complianceNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}
          <ToolGuide
            title="Policy Checker"
            sections={[
              {
                title: "Common Policy Violations",
                content: [
                  "Aggressive sales language (e.g., 'Buy Now or Miss Out').",
                  "Collecting sensitive data (health info, financial details) insecurely.",
                  "Using WhatsApp for subscription services (Netflix-style) without proper opt-ins.",
                  "Contests, quizzes, or gambling."
                ]
              }
            ]}
            tips={[
              "Keep it neutral and informational.",
              "Ensure you have opt-in consent before sending the message.",
              "Review Meta's Commerce Policy regularly as it changes often."
            ]}
          />
        </div>
      </div>
    </div>
  );
}
