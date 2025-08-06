'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import TripforgeNavigator from '@/components/tripforge-navigator';
import { cn } from '@/lib/utils';

function WelcomePage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-transparent text-white overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <Image
          src="https://i.imgur.com/kE9o47G.png"
          alt="TRIPFORGE Logo"
          width={150}
          height={150}
          className="mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        />
        <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          TRIPFORGE
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-light max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Where Every Journey Begins with Confidence.
        </p>
        <Button onClick={onEnter} size="lg" className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          Start Planning Your Trip <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default function Home() {
  const [showWelcome, setShowWelcome] = React.useState(true);
  
  if (showWelcome) {
    return <WelcomePage onEnter={() => setShowWelcome(false)} />;
  }

  return <TripforgeNavigator />;
}
