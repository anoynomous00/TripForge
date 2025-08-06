import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from '@/components/ui/sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'TRIPFORGE',
  description: 'Your ultimate travel planning companion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="relative z-10">
          <SidebarProvider>
            {children}
          </SidebarProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
