'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import TripforgeNavigator from '@/components/tripforge-navigator';

function WelcomePage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="flex justify-end py-4 px-8">
        <h1
          className="text-2xl font-bold"
          style={{
            backgroundImage: 'linear-gradient(to right, #f87171, #fb923c, #facc15)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          tripforge
        </h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4 -mt-16">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter">
            TRIPFORGE
          </h2>
          <p className="mt-4 text-xl md:text-2xl text-neutral-300 max-w-2xl">
            Where Every Journey Begins with Confidence.
          </p>
        </div>
        <Button
          onClick={onEnter}
          size="lg"
          className="mt-8 animate-fade-in-up bg-blue-600 hover:bg-blue-700"
          style={{ animationDelay: '0.4s' }}
        >
          Start Planning Your Trip <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </main>
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
