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

import { ToolGuide } from '@/components/tool-guide';

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
    <div className="space-y-8">
      <AppHeader
        title="Template Scorer & Analysis"
        description="Rate templates on compliance, clarity, engagement, and optimization."
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
              <Card className="backdrop-blur-sm bg-card/50 shadow-sm border-muted transition-all hover:shadow-md overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none" />
                <CardHeader className="pb-2">
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Overall Score</CardTitle>
                </CardHeader>
                <CardContent className="flex items-baseline gap-4">
                  <div className="relative">
                    <p className="text-8xl font-black text-primary tracking-tighter">{result.complianceScore}</p>
                  </div>
                  <p className="text-2xl text-muted-foreground font-medium">/ 10</p>
                  <Badge variant={result.complianceStatus === 'PASS' ? 'default' : 'destructive'} className={`text-base py-1 px-4 ml-auto rounded-full ${result.complianceStatus === 'PASS' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                    {result.complianceStatus}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 shadow-sm border-muted transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                      <XAxis type="number" dataKey="score" hide />
                      <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={100} style={{ fontSize: '12px', fontWeight: 500 }} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="score" radius={5} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 shadow-sm border-muted transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>Detailed Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{result.analysis}</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50 shadow-sm border-muted transition-all hover:shadow-md bg-yellow-500/5 border-yellow-500/10">
                <CardHeader>
                  <CardTitle className="text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
                    Optimization Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{result.optimizationNotes}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <ToolGuide
          title="Template Scorer"
          sections={[
            {
              title: "How scoring works",
              content: "Our AI evaluates your template on three key pillars: Clarity (is it easy to understand?), Compliance (does it follow rules?), and Tone (is it professional?). A score above 85/100 is generally safe for submission."
            },
            {
              title: "Improving your score",
              content: "Templates that are short, direct, and use specific variable placeholders score higher. Vague or overly lengthy messages are penalized."
            }
          ]}
          tips={[
            "Keep it under 300 characters for maximum engagement.",
            "Use clear calls-to-action (e.g., 'View details here' instead of just a link).",
            "Proofread for grammar - Meta's automated reviews often reject typos."
          ]}
        />
      </div>
    </div>
  );
}
