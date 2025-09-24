'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Package, Zap, AlertTriangle, BarChart3, ExternalLink, Code } from 'lucide-react';

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
      bg: isActive ? 'bg-midnight/5' : '',
      border: isActive ? 'border-midnight' : '',
      text: isActive ? 'text-midnight' : 'text-gray-600 hover:text-midnight',
      icon: isActive ? 'text-midnight' : 'text-gray-400 group-hover:text-gray-600'
    },
    blue: {
      bg: isActive ? 'bg-blue/5' : '',
      border: isActive ? 'border-blue' : '',
      text: isActive ? 'text-midnight' : 'text-gray-600 hover:text-midnight',
      icon: isActive ? 'text-blue' : 'text-gray-400 group-hover:text-gray-600'
    },
    orange: {
      bg: isActive ? 'bg-orange/5' : '',
      border: isActive ? 'border-orange' : '',
      text: isActive ? 'text-midnight' : 'text-gray-600 hover:text-midnight',
      icon: isActive ? 'text-orange' : 'text-gray-400 group-hover:text-gray-600'
    },
    yellow: {
      bg: isActive ? 'bg-yellow/5' : '',
      border: isActive ? 'border-yellow' : '',
      text: isActive ? 'text-midnight' : 'text-gray-600 hover:text-midnight',
      icon: isActive ? 'text-yellow' : 'text-gray-400 group-hover:text-gray-600'
    }
  };
  
  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-r border-gray-200">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          // Fix pathname matching by removing trailing slash for comparison
          const normalizedPathname = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
          const isActive = normalizedPathname === item.href;
          const colors = getColorClasses(item.color, isActive);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 relative ${
                isActive
                  ? `${colors.text} ${colors.bg} border-l-4 ${colors.border}`
                  : `${colors.text} hover:bg-gray-50`
              }`}
            >
              <Icon className={`mr-3 h-4 w-4 transition-colors ${colors.icon}`} />
              {item.name}
            </Link>
          );
        })}
        
        {/* Links at bottom */}
        <div className="pt-6 mt-6 border-t border-gray-200 space-y-1">
          <a
            href="https://www.npmjs.com/package/@wakeuplabs/op-interop-alerts-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-midnight transition-colors rounded-md hover:bg-gray-50"
          >
            <div className="mr-3 w-8 h-4 flex items-center justify-start">
              <img 
                src="/npm-logo-red.png" 
                alt="NPM" 
                className="h-3 w-auto opacity-70 group-hover:opacity-100"
              />
            </div>
            NPM Package
          </a>
          <a
            href="https://github.com/wakeuplabs-io/op-interop-alerts"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-midnight transition-colors rounded-md hover:bg-gray-50"
          >
            <div className="mr-3 w-8 h-4 flex items-center justify-start">
              <img 
                src="/github-mark.png" 
                alt="GitHub" 
                className="h-4 w-auto opacity-70 group-hover:opacity-100"
              />
            </div>
            GitHub
          </a>
          <a
            href="https://wakeuplabs.io"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-midnight transition-colors rounded-md hover:bg-gray-50"
          >
            <div className="mr-3 w-8 h-4 flex items-center justify-start">
              <img 
                src="/logo-wu-isotype.png" 
                alt="WakeUp Labs" 
                className="h-3 w-auto opacity-70 group-hover:opacity-100"
              />
            </div>
            WakeUp Labs
          </a>
        </div>
      </nav>
    </div>
  );
}