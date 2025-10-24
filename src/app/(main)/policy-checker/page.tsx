'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkPolicyAction } from '@/app/actions';
import type { CheckTemplatePolicyComplianceOutput } from '@/ai/flows/check-template-policy-compliance';

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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-8">
        <AppHeader
          title="Policy Checker"
          description="Pre-validate your template text against Meta's Business API guidelines to increase approval chances."
        />
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
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-card p-8">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium text-muted-foreground">
                Checking for compliance...
              </p>
            </div>
          </div>
        )}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Compliance Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={cn(
                  'flex items-center gap-4 rounded-lg border p-4',
                  result.isCompliant
                    ? 'border-accent/50 bg-accent/10'
                    : 'border-destructive/50 bg-destructive/10'
                )}
              >
                {result.isCompliant ? (
                  <CheckCircle2 className="h-10 w-10 shrink-0 text-accent" />
                ) : (
                  <XCircle className="h-10 w-10 shrink-0 text-destructive" />
                )}
                <div>
                  <h3
                    className={cn(
                      'text-xl font-bold',
                      result.isCompliant ? 'text-accent-foreground' : 'text-destructive-foreground'
                    )}
                  >
                    {result.isCompliant ? 'Compliant' : 'Not Compliant'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {result.isCompliant
                      ? 'This template appears to be compliant with Meta policies.'
                      : 'This template has potential policy violations.'}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Compliance Notes</h4>
                <p className="text-muted-foreground">{result.complianceNotes}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
