import type { SVGProps } from 'react';

export function BusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 6v6" />
      <path d="M15 6v6" />
      <path d="M2 12h19.6" />
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
      <circle cx="7" cy="18" r="2" />
      <path d="M9 18h5" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}

export function TempoTravellerIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            {...props}
        >
            <rect x="2" y="7" width="20" height="12" rx="2" />
            <path d="M2 13H1v-2a2 2 0 0 1 2-2h2" />
            <path d="M22 13h1v-2a2 2 0 0 0-2-2h-2" />
            <path d="M6 7V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2" />
            <circle cx="7" cy="19" r="2" />
            <circle cx="17" cy="19" r="2" />
            <path d="M9 19h6" />
        </svg>
    );
}


export function OmniIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            {...props}
        >
            <path d="M19 17h2v-5H3v5h2" />
            <path d="M3 12V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5" />
            <path d="M8 7v5" />
            <path d="M16 7v5" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
        </svg>
    );
}
