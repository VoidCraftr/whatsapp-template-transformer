'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookCopy,
  Gauge,
  LayoutGrid,
  Replace,
  ShieldCheck,
  Tags,
  History as HistoryIcon,
} from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { UserAuthForm } from '@/components/user-auth-form';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/converter', label: 'Converter', icon: Replace },
  { href: '/scorer', label: 'Scorer', icon: Gauge },
  { href: '/policy-checker', label: 'Policy Checker', icon: ShieldCheck },
  { href: '/category-advisor', label: 'Category Advisor', icon: Tags },
  { href: '/history', label: 'History', icon: HistoryIcon },
  { href: '/examples', label: 'Examples', icon: BookCopy },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1 py-1 group-data-[collapsible=icon]:justify-center">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
              <Logo className="size-5 text-white" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">WaGenie</span>
              <span className="truncate text-xs text-muted-foreground">AI Power Tools</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    className: "dark:bg-sidebar-background dark:text-sidebar-foreground dark:border-sidebar-border"
                  }}
                  className="transition-all duration-200 ease-in-out hover:bg-sidebar-accent hover:pl-3"
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-0">
          <div className="group-data-[collapsible=icon]:hidden">
            <UserAuthForm />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {/* Global Grid Pattern for Vibe */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: `url('/grid.svg')`, backgroundSize: '30px 30px' }}
        />

        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/50 backdrop-blur-sm px-4 sticky top-0 z-10 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="mr-2 h-4 w-[1px] bg-border" />
            <span className="text-sm font-medium text-muted-foreground">
              {navItems.find(n => n.href === pathname)?.label || 'Dashboard'}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background/50 p-4 sm:p-6 lg:p-8 relative z-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
