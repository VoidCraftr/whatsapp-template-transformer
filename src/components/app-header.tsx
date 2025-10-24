import * as React from 'react';

type AppHeaderProps = {
  title: string;
  description: string;
  className?: string;
};

export function AppHeader({ title, description, className }: AppHeaderProps) {
  return (
    <header className={className}>
      <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        {description}
      </p>
    </header>
  );
}
