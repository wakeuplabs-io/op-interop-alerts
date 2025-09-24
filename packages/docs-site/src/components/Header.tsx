'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Package, Zap, AlertTriangle, BarChart3, Code } from 'lucide-react';

const navigation = [
  { name: 'Getting Started', href: '/', icon: BookOpen, color: 'blue' },
  { name: 'Installation', href: '/installation', icon: Package, color: 'midnight' },
  { name: 'Tracking Module', href: '/tracking', icon: Zap, color: 'blue' },
  { name: 'Metrics Module', href: '/metrics', icon: BarChart3, color: 'orange' },
  { name: 'Alerts Module', href: '/alerts', icon: AlertTriangle, color: 'yellow' },
  { name: 'Examples', href: '/examples', icon: Code, color: 'orange' },
];

// Function to get color classes based on color name
const getColorClasses = (color: string, isActive: boolean) => {
  const colorMap = {
    midnight: {
      text: isActive ? 'text-midnight bg-midnight/5' : 'text-gray-600',
      icon: isActive ? 'text-midnight' : 'text-gray-400'
    },
    blue: {
      text: isActive ? 'text-midnight bg-blue/5' : 'text-gray-600',
      icon: isActive ? 'text-blue' : 'text-gray-400'
    },
    orange: {
      text: isActive ? 'text-midnight bg-orange/5' : 'text-gray-600',
      icon: isActive ? 'text-orange' : 'text-gray-400'
    },
    yellow: {
      text: isActive ? 'text-midnight bg-yellow/5' : 'text-gray-600',
      icon: isActive ? 'text-yellow' : 'text-gray-400'
    }
  };
  
  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-4">
            {/* Logo principal de WakeUp Labs */}
            <img 
              src="/logo-wu.png" 
              alt="WakeUp Labs" 
              className="h-8 w-auto"
            />
            {/* Título del sitio - oculto en mobile */}
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-midnight">OP Interop Alerts SDK</span>
              <span className="text-xs text-gray-500">Cross-chain monitoring documentation</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* Desktop links */}
            <div className="hidden md:flex items-center space-x-4">
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

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-midnight hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <nav className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const normalizedPathname = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
              const isActive = normalizedPathname === item.href;
              const colors = getColorClasses(item.color, isActive);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${colors.text}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile links */}
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
              <a
                href="https://www.npmjs.com/package/@wakeuplabs/op-interop-alerts-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-sm text-gray-600"
              >
                <div className="mr-3 w-8 h-4 flex items-center justify-start">
                  <img 
                    src="/npm-logo-red.png" 
                    alt="NPM" 
                    className="h-3 w-auto"
                  />
                </div>
                <span>NPM Package</span>
              </a>
              <a
                href="https://github.com/wakeuplabs-io/op-interop-alerts"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-sm text-gray-600"
              >
                <div className="mr-3 w-8 h-4 flex items-center justify-start">
                  <img 
                    src="/github-mark.png" 
                    alt="GitHub" 
                    className="h-4 w-auto"
                  />
                </div>
                <span>GitHub</span>
              </a>
              <a
                href="https://wakeuplabs.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-sm text-gray-600"
              >
                <div className="mr-3 w-8 h-4 flex items-center justify-start">
                  <img 
                    src="/logo-wu-isotype.png" 
                    alt="WakeUp Labs" 
                    className="h-3 w-auto"
                  />
                </div>
                <span>WakeUp Labs</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}