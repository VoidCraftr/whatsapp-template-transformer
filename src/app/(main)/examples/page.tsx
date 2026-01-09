'use client';

import * as React from 'react';
import { Search, Copy, Check } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { CodeBlock } from '@/components/code-block';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const examples = {
  ecommerce: [
    {
      title: 'Order Confirmation',
      description: "Confirm a customer's recent order.",
      template:
        "Hi {{1}}, thank you for your order #{{2}}. We've received it and will notify you once it has shipped. View your order details here: {{3}}",
      tags: ['Utility', 'Post-Purchase'],
    },
    {
      title: 'Shipping Update',
      description: 'Notify customers that their order has shipped.',
      template:
        'Good news, {{1}}! Your order #{{2}} from [Your Brand] has shipped. You can track your package here: {{3}}',
      tags: ['Utility', 'Shipping'],
    },
    {
      title: 'Abandoned Cart Recovery',
      description: 'Gentle nudge to complete a purchase (Marketing).',
      template:
        'Hi {{1}}, we noticed you left some items in your cart. They are selling out fast! Complete your order now and get 5% off: {{2}}',
      tags: ['Marketing', 'Retargeting'],
    },
    {
      title: 'Product Launch Alert',
      description: 'Announce a new product arrival.',
      template:
        'The wait is over, {{1}}! Our new {{2}} collection is finally here. Be the first to shop the drop: {{3}}',
      tags: ['Marketing', 'New Arrival'],
    },
    {
      title: 'Return Status',
      description: 'Inform a customer about the status of their return.',
      template:
        'Hi {{1}}, we have received your return for order #{{2}}. Your refund of {{3}} will be processed within 5-7 business days.',
      tags: ['Utility', 'Support'],
    },
    {
      title: 'Review Request',
      description: 'Ask for feedback after a purchase.',
      template:
        'Hi {{1}}, we hope you are loving your {{2}}. Would you mind taking a moment to rate your experience? It helps us improve: {{3}}',
      tags: ['Marketing', 'Feedback'],
    },
  ],
  finance: [
    {
      title: 'Payment Reminder',
      description: 'Remind a customer of an upcoming payment.',
      template:
        'Hi {{1}}, this is a friendly reminder that your payment of {{2}} for account {{3}} is due on {{4}}. Pay now: {{5}}',
      tags: ['Utility', 'Billing'],
    },
    {
      title: 'Fraud Alert',
      description: 'Alert a customer about suspicious activity.',
      template:
        "Security Alert: We've detected a suspicious login attempt on your account {{1}}. If this was not you, please secure your account immediately: {{2}}",
      tags: ['Authentication', 'Security'],
    },
    {
      title: 'OTP For Login',
      description: 'One-time password code for authentication.',
      template:
        '{{1}} is your verification code for [Your App]. Do not share this code with anyone. Valid for 10 minutes.',
      tags: ['Authentication', 'OTP'],
    },
    {
      title: 'Credit Score Update',
      description: 'Inform user about a change in credit score.',
      template:
        'Hi {{1}}, your credit score has been updated. Log in to your dashboard to view the changes and see personalized offers: {{2}}',
      tags: ['Utility', 'Update'],
    },
  ],
  marketing_utility_mix: [
    {
      title: 'Webinar Invitation',
      description: 'Invite users to an educational event.',
      template: 'Hi {{1}}, join our exclusive masterclass on {{2}}. Learn how to scale your business with expert tips. Register for free: {{3}}',
      tags: ['Marketing', 'Event']
    },
    {
      title: 'Membership Renewal',
      description: 'Remind users to renew their subscription.',
      template: 'Hi {{1}}, your premium membership expires in 3 days. Renew now to keep access to all features: {{2}}',
      tags: ['Utility', 'Retention']
    },
    {
      title: 'Referral Bonus',
      description: 'Encourage users to refer friends.',
      template: 'Love using our app, {{1}}? Refer a friend and you both get {{2}} credits! Share your unique link: {{3}}',
      tags: ['Marketing', 'Referral']
    }
  ],
  logistics: [
    {
      title: 'Delivery Scheduled',
      description: 'Inform the recipient about a scheduled delivery.',
      template:
        'Hi {{1}}, your package with tracking number {{2}} is scheduled for delivery on {{3}} between {{4}} and {{5}}.',
      tags: ['Utility', 'Delivery'],
    },
    {
      title: 'Delivery Attempt Failed',
      description: 'Notify recipient about a failed delivery attempt.',
      template:
        'We missed you! We attempted to deliver your package {{1}} today at {{2}}. Please reschedule your delivery here: {{3}}',
      tags: ['Utility', 'Delivery'],
    },
  ],
  healthcare: [
    {
      title: 'Appointment Reminder',
      description: 'Remind a patient of an upcoming appointment.',
      template:
        'Hi {{1}}, this is a reminder for your upcoming appointment with Dr. {{2}} on {{3}} at {{4}}. Please confirm your attendance: {{5}}',
      tags: ['Utility', 'Appointment'],
    },
  ],
  travel: [
    {
      title: 'Booking Confirmation',
      description: 'Confirm a travel booking with itinerary details.',
      template:
        'Your trip is booked! Hi {{1}}, your booking #{{2}} for a flight to {{3}} on {{4}} is confirmed. View your full itinerary here: {{5}}',
      tags: ['Utility', 'Booking'],
    },
  ],
  education: [
    {
      title: 'Enrollment Confirmation',
      description: "Confirm a student's enrollment in a course.",
      template:
        'Welcome, {{1}}! You are now enrolled in {{2}}. Your classes start on {{3}}. Here is your student portal link: {{4}}',
      tags: ['Utility', 'Education'],
    },
  ],
};

type Industry = keyof typeof examples;

export default function ExamplesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<Industry>('ecommerce');
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Template copied to clipboard.',
      duration: 2000,
    });
  };

  const filteredExamples = React.useMemo(() => {
    if (!searchTerm) {
      return examples;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = {} as typeof examples;

    for (const industry in examples) {
      const industryKey = industry as Industry;
      const matchingExamples = examples[industryKey].filter(
        (example) =>
          example.title.toLowerCase().includes(lowercasedFilter) ||
          example.description.toLowerCase().includes(lowercasedFilter) ||
          example.template.toLowerCase().includes(lowercasedFilter)
      );

      if (matchingExamples.length > 0) {
        filtered[industryKey] = matchingExamples;
      }
    }

    return filtered;
  }, [searchTerm]);

  const industriesWithExamples = Object.keys(filteredExamples) as Industry[];

  // Update active tab if current one disappears from search results
  React.useEffect(() => {
    if (industriesWithExamples.length > 0 && !industriesWithExamples.includes(activeTab)) {
      setActiveTab(industriesWithExamples[0]);
    }
  }, [industriesWithExamples, activeTab]);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AppHeader
        title="Use-Case Examples"
        description="Browse industry-specific, compliant utility templates for inspiration. Copy and adapt them for your own needs."
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4 border-b">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as Industry)}
            className="w-full sm:w-auto overflow-x-auto"
          >
            <TabsList className="h-10 p-1 bg-muted/20">
              {industriesWithExamples.map((industry) => (
                <TabsTrigger
                  value={industry}
                  key={industry}
                  className="capitalize data-[state=active]:bg-background/90 data-[state=active]:shadow-sm"
                >
                  {industry}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-9 bg-background/50 border-muted-foreground/20 focus:border-primary/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {industriesWithExamples.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-500">
            {filteredExamples[activeTab]?.map((example, idx) => (
              <Card
                key={example.title + idx}
                className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-semibold tracking-tight text-foreground/90">
                      {example.title}
                    </CardTitle>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {example.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0 h-5 font-normal bg-secondary/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-sm line-clamp-2">
                    {example.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative rounded-md bg-muted/30 border border-border/10 p-3 group-hover:bg-muted/40 transition-colors">
                    <p className="text-sm font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {example.template}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background"
                      onClick={() => handleCopy(example.template)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No examples found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We couldn't find any templates matching "{searchTerm}". Try different keywords like "shipping", "reminder", or "alert".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
