'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';
import {
  BookCopy,
  Gauge,
  Replace,
  ShieldCheck,
  Tags,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';

const tools = [
  {
    title: 'Template Converter',
    description: 'Transform marketing chaos into compliant utility templates.',
    href: '/converter',
    icon: Replace,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Template Scorer',
    description: 'AI-powered rating for compliance and engagement.',
    href: '/scorer',
    icon: Gauge,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Policy Checker',
    description: 'Validate against strict Meta guidelines instantly.',
    href: '/policy-checker',
    icon: ShieldCheck,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    title: 'Category Advisor',
    description: 'Ensure your templates land in the right inbox bucket.',
    href: '/category-advisor',
    icon: Tags,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalConversions, setTotalConversions] = React.useState<number | null>(null);
  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Creator';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  React.useEffect(() => {
    async function fetchStats() {
      if (!user || !db) return;
      try {
        const coll = collection(db, 'users', user.uid, 'history');
        const snapshot = await getCountFromServer(coll);
        setTotalConversions(snapshot.data().count);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 p-8 md:p-16 text-white shadow-2xl">
        {/* Abstract Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-200 mb-4">
              <Zap className="h-3 w-3 fill-blue-200" /> AI-Powered V 2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">WaGenie</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              Transforming your WhatsApp communication with the power of <span className="text-white font-medium">VoidCraftr AI</span>. Create, check, and optimize compliant templates in seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link href="/converter">
              <Button size="lg" className="rounded-full bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/10 px-8 h-12 text-base">
                Start Creating Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~{totalConversions ? totalConversions * 5 : 0}m</div>
            <p className="text-xs text-muted-foreground">Est. manual work saved</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Compliance</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Based on AI optimization</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Templates</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions !== null ? totalConversions : '-'}</div>
            <p className="text-xs text-muted-foreground">Converted to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Tools Grid using Framer Motion */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Quick Access</h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {tools.map((tool) => (
            <motion.div key={tool.title} variants={item}>
              <Link href={tool.href} className="block group h-full">
                <Card className="h-full transition-all duration-300 border-transparent bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${tool.color.replace('text-', 'bg-')}`} />
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-3 rounded-xl ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                      <tool.icon className="size-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{tool.title}</CardTitle>
                      <CardDescription className="line-clamp-1 mt-1">{tool.description}</CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Use-Cases Section */}
      <div className="pt-4">
        <Link href="/examples" className="group block">
          <div className="relative rounded-2xl bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 p-8 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <BookCopy className="h-5 w-5 text-neutral-500" />
                  Inspiration Gallery
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Browse industry-standard templates for E-commerce, Finance, and more to jumpstart your workflow.
                </p>
              </div>
              <Button variant="ghost" className="hidden md:flex group-hover:bg-background">
                Explore <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
