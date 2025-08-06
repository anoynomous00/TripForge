'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import WorldTourNavigator from '@/components/world-tour-navigator';

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
      <div className="absolute inset-0 z-0">
        <div className="grid grid-cols-3 grid-rows-2 h-full w-full">
          {karnatakaPlaces.map((place, index) => (
            <div key={index} className="relative h-full w-full">
              <Image
                src={place.src}
                alt={place.alt}
                layout="fill"
                objectFit="cover"
                className="opacity-40"
                data-ai-hint={place.hint}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight">
          WorldTour
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-light max-w-2xl">
          Where Every Journey Begins with Confidence.
        </p>
        <Button onClick={onEnter} size="lg" className="mt-8">
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

  return <WorldTourNavigator />;
}
