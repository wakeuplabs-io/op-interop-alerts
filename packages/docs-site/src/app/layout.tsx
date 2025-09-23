import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'OP Interop Alerts SDK',
    template: '%s | OP Interop Alerts SDK'
  },
  description: 'TypeScript SDK for monitoring cross-chain interoperability across Optimism Superchain',
  keywords: ['optimism', 'superchain', 'cross-chain', 'interoperability', 'monitoring', 'alerts', 'l2', 'ethereum'],
  authors: [{ name: 'WakeUp Labs' }],
  creator: 'WakeUp Labs',
  metadataBase: new URL('https://wakeuplabs-io.github.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wakeuplabs-io.github.io/op-interop-alerts',
    title: 'OP Interop Alerts SDK',
    description: 'TypeScript SDK for monitoring cross-chain interoperability across Optimism Superchain',
    siteName: 'OP Interop Alerts SDK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OP Interop Alerts SDK',
    description: 'TypeScript SDK for monitoring cross-chain interoperability across Optimism Superchain',
  },
  icons: {
    icon: '/favicon-wu.svg',
    shortcut: '/favicon-wu.svg',
    apple: '/favicon-wu.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-white">
          <Header />
          <div className="flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-16 h-screen overflow-y-auto">
                <Sidebar />
              </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 max-w-none">
              <div className="pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8 py-8">
                {children}
              </div>
            </main>
          </div>
          <footer className="bg-gray-50 border-t border-gray-300">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-4 mb-6 md:mb-0">
                  <img 
                    src="/logo-wu.png" 
                    alt="WakeUp Labs" 
                    className="h-8 w-auto"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-midnight">
                      OP Interop Alerts SDK
                    </span>
                    <span className="text-xs text-gray-500">
                      Cross-chain monitoring documentation
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <a
                    href="https://www.npmjs.com/package/@wakeuplabs/op-interop-alerts-sdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity p-2"
                    title="NPM Package"
                  >
                    <img 
                      src="/npm-logo-red.png" 
                      alt="NPM" 
                      className="h-4 w-auto"
                    />
                  </a>
                  <a
                    href="https://github.com/wakeuplabs-io/op-interop-alerts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity p-2"
                    title="GitHub Repository"
                  >
                    <img 
                      src="/github-mark.png" 
                      alt="GitHub" 
                      className="h-5 w-auto"
                    />
                  </a>
                  <a
                    href="https://wakeuplabs.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity p-2"
                    title="WakeUp Labs"
                  >
                    <img 
                      src="/logo-wu-isotype.png" 
                      alt="WakeUp Labs" 
                      className="h-4 w-auto"
                    />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
