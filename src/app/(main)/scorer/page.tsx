'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { scoreTemplateAction } from '@/app/actions';
import type { ScoreTemplateComplianceOutput } from '@/ai/flows/score-template-compliance';

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
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const formSchema = z.object({
  templateText: z.string().min(10, 'Template text is required.'),
});

export default function ScorerPage() {
  const [result, setResult] = React.useState<ScoreTemplateComplianceOutput | null>(null);
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
    const response = await scoreTemplateAction(values);
    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Scoring Failed',
        description: response.error,
      });
    }
    setIsLoading(false);
  }

  const chartData = result ? [
    { name: 'Compliance', score: result.compliancePoints, fill: 'var(--color-compliance)' },
    { name: 'Clarity', score: result.clarityPoints, fill: 'var(--color-clarity)' },
    { name: 'Engagement', score: result.engagementPoints, fill: 'var(--color-engagement)' },
    { name: 'Optimization', score: result.optimizationPoints, fill: 'var(--color-optimization)' },
  ] : [];

  const chartConfig = {
    score: { label: 'Points' },
    compliance: { label: 'Compliance', color: 'hsl(var(--chart-1))' },
    clarity: { label: 'Clarity', color: 'hsl(var(--chart-2))' },
    engagement: { label: 'Engagement', color: 'hsl(var(--chart-3))' },
    optimization: { label: 'Optimization', color: 'hsl(var(--chart-4))' },
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-8">
        <AppHeader
          title="Template Scorer & Analysis"
          description="Rate templates on compliance, clarity, engagement, and optimization."
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="templateText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template to Score</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your order {{1}} has been shipped and will arrive on {{2}}."
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
              Score Template
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
                Analyzing your template...
              </p>
            </div>
          </div>
        )}
        {result && (
          <div className="flex flex-col gap-6">
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Overall Score</CardTitle>
                </CardHeader>
                <CardContent className="flex items-baseline gap-2">
                    <p className="text-7xl font-bold text-primary">{result.complianceScore}</p>
                    <p className="text-2xl text-muted-foreground">/ 10</p>
                     <Badge variant={result.complianceStatus === 'PASS' ? 'default' : 'destructive'} className={`${result.complianceStatus === 'PASS' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''} ml-auto`}>
                    {result.complianceStatus}
                  </Badge>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                            <XAxis type="number" dataKey="score" hide />
                            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={100} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey="score" radius={5} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.analysis}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.optimizationNotes}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
