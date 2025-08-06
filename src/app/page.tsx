'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import TripforgeNavigator from '@/components/tripforge-navigator';
import { cn } from '@/lib/utils';

const karnatakaPlaces = [
  { src: 'https://placehold.co/600x401.png', alt: 'Hampi', hint: 'ancient ruins Hampi' },
  { src: 'https://placehold.co/600x402.png', alt: 'Mysore Palace', hint: 'Mysore Palace night' },
  { src: 'https://placehold.co/600x403.png', alt: 'Coorg', hint: 'Coorg coffee plantation' },
  { src: 'https://placehold.co/600x404.png', alt: 'Gokarna Beach', hint: 'Gokarna beach sunset' },
  { src: 'https://placehold.co/600x405.png', alt: 'Jog Falls', hint: 'Jog Falls waterfall' },
  { src: 'https://placehold.co/600x406.png', alt: 'Badami Caves', hint: 'Badami cave temples' },
];

function WelcomePage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black text-white overflow-hidden">
      <div className="absolute top-4 right-6 z-20">
        <p 
          className="font-headline text-2xl font-bold lowercase animate-long-fade-in"
          style={{
            backgroundImage: 'linear-gradient(to right, #fde047, #f87171, #fca5a5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animationDelay: '1.5s',
            animationDuration: '1s'
          }}
        >
          TRIPFORGE
        </p>
      </div>
      <div className="absolute inset-0 z-0">
        <div className="grid grid-cols-3 grid-rows-2 h-full w-full">
          {karnatakaPlaces.map((place, index) => (
            <div key={index} className="relative h-full w-full">
              <Image
                src={place.src}
                alt={place.alt}
                fill
                className="object-cover opacity-40 transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={place.hint}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
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
  
  React.useEffect(() => {
    if (showWelcome) {
      document.documentElement.classList.add('hide-global-background');
    } else {
      document.documentElement.classList.remove('hide-global-background');
    }
  }, [showWelcome]);

  if (showWelcome) {
    return <WelcomePage onEnter={() => setShowWelcome(false)} />;
  }

  return <TripforgeNavigator />;
}
