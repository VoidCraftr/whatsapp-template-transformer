'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { CodeBlock } from '@/components/code-block';
import { Input } from '@/components/ui/input';

const examples = {
  ecommerce: [
    {
      title: 'Order Confirmation',
      description: "Confirm a customer's recent order.",
      template:
        "Hi {{1}}, thank you for your order #{{2}}. We've received it and will notify you once it has shipped. View your order details here: {{3}}",
    },
    {
      title: 'Shipping Update',
      description: 'Notify customers that their order has shipped.',
      template:
        'Good news, {{1}}! Your order #{{2}} from [Your Brand] has shipped. You can track your package here: {{3}}',
    },
    {
      title: 'Account Update',
      description: 'Alert user about a change in their account status.',
      template:
        'Hi {{1}}, your password for account {{2}} has been successfully updated. If you did not make this change, please contact support immediately.',
    },
    {
      title: 'Return Status',
      description: 'Inform a customer about the status of their return.',
      template:
        'Hi {{1}}, we have received your return for order #{{2}}. Your refund of {{3}} will be processed within 5-7 business days.',
    },
  ],
  finance: [
    {
      title: 'Payment Reminder',
      description: 'Remind a customer of an upcoming payment.',
      template:
        'Hi {{1}}, this is a friendly reminder that your payment of {{2}} for account {{3}} is due on {{4}}. Pay now: {{5}}',
    },
    {
      title: 'Fraud Alert',
      description: 'Alert a customer about suspicious activity.',
      template:
        "Security Alert: We've detected a suspicious login attempt on your account {{1}}. If this was not you, please secure your account immediately: {{2}}",
    },
    {
      title: 'Transaction Receipt',
      description: 'Confirm a recent transaction.',
      template:
        'Your transaction of {{1}} to {{2}} on {{3}} was successful. Your new balance is {{4}}.',
    },
    {
      title: 'Loan Application Update',
      description: 'Update a customer on their loan application status.',
      template:
        'Hi {{1}}, we have an update on your loan application #{{2}}. Please log in to your portal to view the details: {{3}}',
    },
  ],
  logistics: [
    {
      title: 'Delivery Scheduled',
      description: 'Inform the recipient about a scheduled delivery.',
      template:
        'Hi {{1}}, your package with tracking number {{2}} is scheduled for delivery on {{3}} between {{4}} and {{5}}.',
    },
    {
      title: 'Delivery Attempt Failed',
      description: 'Notify recipient about a failed delivery attempt.',
      template:
        'We missed you! We attempted to deliver your package {{1}} today at {{2}}. Please reschedule your delivery here: {{3}}',
    },
    {
      title: 'Package Out for Delivery',
      description: 'Alert recipient that their package is on its way.',
      template:
        'Great news! Your package {{1}} is out for delivery today. Estimated arrival: {{2}}.',
    },
    {
      title: 'Customs Information Required',
      description: 'Request necessary information for customs clearance.',
      template:
        'Attention {{1}}, your package #{{2}} requires customs information to proceed. Please provide the necessary details here: {{3}}',
    },
  ],
  healthcare: [
    {
      title: 'Appointment Reminder',
      description: 'Remind a patient of an upcoming appointment.',
      template:
        'Hi {{1}}, this is a reminder for your upcoming appointment with Dr. {{2}} on {{3}} at {{4}}. Please confirm your attendance: {{5}}',
    },
    {
      title: 'Test Results Ready',
      description: 'Notify a patient that their test results are available.',
      template:
        'Hi {{1}}, your test results are now available. Please log in to the patient portal to view them securely: {{2}}',
    },
  ],
  travel: [
    {
      title: 'Booking Confirmation',
      description: 'Confirm a travel booking with itinerary details.',
      template:
        'Your trip is booked! Hi {{1}}, your booking #{{2}} for a flight to {{3}} on {{4}} is confirmed. View your full itinerary here: {{5}}',
    },
    {
      title: 'Flight Status Alert',
      description: 'Provide real-time updates on flight status.',
      template:
        'Flight Update: Your flight {{1}} to {{2}} is now scheduled to depart at {{3}}. Gate number is {{4}}.',
    },
  ],
  education: [
    {
      title: 'Enrollment Confirmation',
      description: "Confirm a student's enrollment in a course.",
      template:
        'Welcome, {{1}}! You are now enrolled in {{2}}. Your classes start on {{3}}. Here is your student portal link: {{4}}',
    },
    {
      title: 'Assignment Reminder',
      description: 'Remind students of an upcoming assignment deadline.',
      template:
        "Friendly reminder, {{1}}: Your assignment for {{2}} is due on {{3}}. Don't forget to submit it on time!",
    },
  ],
};

type Industry = keyof typeof examples;

export default function ExamplesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

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

  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Use-Case Examples"
        description="Browse industry-specific, compliant utility templates for inspiration. Copy and adapt them for your own needs."
      />

      <Tabs
        defaultValue={industriesWithExamples[0] || 'ecommerce'}
        className="w-full"
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-auto sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search examples..."
              className="pl-10 w-full sm:max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full overflow-x-auto sm:w-auto">
            <TabsList>
              {industriesWithExamples.map((industry) => (
                <TabsTrigger value={industry} key={industry} className="capitalize">
                  {industry}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {industriesWithExamples.length > 0 ? (
          industriesWithExamples.map((industry) => (
            <TabsContent value={industry} key={industry} className="mt-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {filteredExamples[industry].map((example) => (
                  <Card key={example.title}>
                    <CardHeader>
                      <CardTitle>{example.title}</CardTitle>
                      <CardDescription>{example.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock code={example.template} language="text" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))
        ) : (
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold">No examples found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search term.
            </p>
          </div>
        )}
      </Tabs>
    </div>
  );
}
