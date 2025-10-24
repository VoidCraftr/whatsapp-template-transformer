import Link from 'next/link';
import {
  BookCopy,
  Gauge,
  Replace,
  ShieldCheck,
  Tags,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppHeader } from '@/components/app-header';

const tools = [
  {
    title: 'Template Converter',
    description: 'Convert marketing templates to compliant utility formats.',
    href: '/converter',
    icon: <Replace className="size-8 text-primary" />,
  },
  {
    title: 'Template Scorer',
    description: 'Rate templates on compliance, clarity, and engagement.',
    href: '/scorer',
    icon: <Gauge className="size-8 text-primary" />,
  },
  {
    title: 'Policy Checker',
    description: 'Pre-validate templates against Meta’s guidelines.',
    href: '/policy-checker',
    icon: <ShieldCheck className="size-8 text-primary" />,
  },
  {
    title: 'Category Advisor',
    description: 'Get AI suggestions for the best template category.',
    href: '/category-advisor',
    icon: <Tags className="size-8 text-primary" />,
  },
  {
    title: 'Use-Case Examples',
    description: 'Browse industry-specific, ready-to-use templates.',
    href: '/examples',
    icon: <BookCopy className="size-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <AppHeader
        title="Welcome to Template Transformer"
        description="Your AI assistant for creating, converting, and optimizing WhatsApp Business API templates."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.title} className="group">
            <Card className="h-full transition-all duration-200 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="rounded-lg bg-primary/10 p-3">{tool.icon}</div>
                <CardTitle className="text-xl">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{tool.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
