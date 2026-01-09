'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Check, Copy, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertTemplateAction } from '@/app/actions';
import type { ConvertMarketingTemplateToUtilityOutput } from '@/ai/flows/convert-marketing-to-utility';

import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/code-block';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { ToolGuide } from '@/components/tool-guide';

const formSchema = z.object({
  brand: z.string().min(1, 'Brand name is required.'),
  originalTemplate: z.string().min(10, 'Original template is required.'),
  keyElements: z.string().min(5, 'Key elements are required.'),
});

export default function ConverterPage() {
  const [result, setResult] = React.useState<ConvertMarketingTemplateToUtilityOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasCopiedText, setHasCopiedText] = React.useState(false);
  const { toast } = useToast();
  const { user } = useAuth(); // Get current user

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: '',
      originalTemplate: '',
      keyElements: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const response = await convertTemplateAction(values);

    if (response.success) {
      setResult(response.data);

      // Save to History (Fire-and-forget)
      if (user && db) {
        try {
          const historyRef = collection(db, 'users', user.uid, 'history');
          await addDoc(historyRef, {
            ...values,
            result: response.data,
            timestamp: serverTimestamp(),
            type: 'CONVERSION'
          });
        } catch (err) {
          console.error("Failed to save history:", err);
        }
      }

    } else {
      toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: response.error,
      });
    }
    setIsLoading(false);
  }

  const onCopyText = () => {
    if (!result) return;
    const fullTemplate = [
      result.converted_template.header,
      result.converted_template.body,
      result.converted_template.footer
    ].filter(Boolean).join('\n\n');

    navigator.clipboard.writeText(fullTemplate).then(() => {
      setHasCopiedText(true);
      toast({
        title: "Copied to clipboard!",
        description: "The converted template text has been copied.",
      })
      setTimeout(() => {
        setHasCopiedText(false);
      }, 2000);
    });
  };

  const onPreviewWhatsApp = () => {
    if (!result) return;
    const fullTemplate = [
      result.converted_template.header,
      result.converted_template.body,
      result.converted_template.footer
    ].filter(Boolean).join('\n\n');

    const encodedText = encodeURIComponent(fullTemplate);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="space-y-8">
      <AppHeader
        title="Template Converter"
        description="Convert marketing templates to compliant utility formats. Provide the brand, original template, and key elements to preserve."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="originalTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Marketing Template</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., BIG SALE! Get 50% off on all items. Use code SAVE50."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keyElements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Elements to Preserve</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Mention a discount, provide a code."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What essential information should be in the utility version?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Convert Template
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
                  Converting your template...
                </p>
              </div>
            </div>
          )}
          {result && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Converted Utility Template</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onPreviewWhatsApp}
                      className="gap-2"
                    >
                      <ExternalLink className="size-4" />
                      Preview
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9"
                      onClick={onCopyText}
                    >
                      {hasCopiedText ? (
                        <Check className="size-4 text-accent" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                      <span className="sr-only">Copy template text</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.converted_template.header && (
                    <div>
                      <h4 className="font-semibold text-muted-foreground">Header</h4>
                      <p className="rounded-md border bg-secondary/30 p-3">{result.converted_template.header}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-muted-foreground">Body</h4>
                    <p className="rounded-md border bg-secondary/30 p-3">{result.converted_template.body}</p>
                  </div>
                  {result.converted_template.footer && (
                    <div>
                      <h4 className="font-semibold text-muted-foreground">Footer</h4>
                      <p className="rounded-md border bg-secondary/30 p-3">{result.converted_template.footer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance & Optimization</CardTitle>
                  <CardDescription>
                    Review the compliance status and optimization notes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Compliance Check:</h4>
                    <Badge variant={result.compliance_check === 'PASS' ? 'default' : 'destructive'} className={result.compliance_check === 'PASS' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}>
                      {result.compliance_check}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold">Optimization Notes:</h4>
                    <p className="text-muted-foreground">{result.optimization_notes}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meta Payload</CardTitle>
                  <CardDescription>
                    This JSON payload can be copied to use with the WhatsApp Business API.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={JSON.stringify(result.meta_payload, null, 2)} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <ToolGuide
          title="Marketing to Utility Converter"
          sections={[
            {
              title: "What does this tool do?",
              content: "This tool takes aggressive marketing messages (sales, discounts, offers) and rewrites them into neutral, informational 'Utility' or 'Transactional' templates. This helps you avoid the high costs of Marketing conversations on WhatsApp."
            },
            {
              title: "Why convert to Utility?",
              content: "Marketing conversations are significantly more expensive. Utility conversations are cheaper and often have higher open rates because users trust them as service updates rather than spam."
            }
          ]}
          tips={[
            "Avoid words like 'Sale', 'Discount', 'Offer', 'Free' in the rewritten text.",
            "Focus on the value to the user (e.g., 'Order Update', 'Account Alert').",
            "Use variables {{1}}, {{2}} for personalization to keep the template generic.",
            "Ensure the footer doesn't contain opt-out instructions (that's a marketing trait)."
          ]}
        />
      </div>
    </div>
  );
}
