import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { AppHeader } from '@/components/app-header';

export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Optional Header for landing page if needed, or keeping it clean */}
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
