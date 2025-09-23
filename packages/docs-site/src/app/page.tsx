import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, BarChart3, AlertTriangle, Package, Github, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-none sm:max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue" />
            </div>
            <h1 className="text-3xl font-bold text-midnight">Getting Started</h1>
          </div>
          <p className="text-lg text-gray-600">
            TypeScript SDK for monitoring cross-chain interoperability across Optimism Superchain. 
            Track messages, generate metrics, and set up intelligent alerts.
          </p>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/installation"
              className="inline-flex items-center px-6 py-3 bg-midnight text-white font-medium rounded-lg hover:bg-black transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <div className="flex gap-3">
              <a
                href="https://www.npmjs.com/package/@wakeuplabs/op-interop-alerts-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img 
                  src="/npm-logo-red.png" 
                  alt="NPM" 
                  className="h-3 w-auto mr-2"
                />
                NPM
              </a>
              <a
                href="https://github.com/wakeuplabs-io/op-interop-alerts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img 
                  src="/github-mark.png" 
                  alt="GitHub" 
                  className="h-4 w-auto mr-2"
                />
                GitHub
              </a>
            </div>
          </div>
        </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="w-10 h-10 bg-blue/10 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-blue" />
          </div>
          <h3 className="text-lg font-semibold text-midnight mb-2">Message Tracking</h3>
          <p className="text-gray-600 mb-4">
            Track cross-chain messages in real-time across Optimism Superchain networks. 
            Monitor send and relay events with detailed timing information.
          </p>
          <Link 
            href="/tracking" 
            className="text-blue hover:text-blue/80 font-medium inline-flex items-center"
          >
            Learn more <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="w-5 h-5 text-orange" />
          </div>
          <h3 className="text-lg font-semibold text-midnight mb-2">Metrics Generation</h3>
          <p className="text-gray-600 mb-4">
            Generate comprehensive metrics including latency, throughput, gas usage, 
            and system health indicators from tracking data.
          </p>
          <Link 
            href="/metrics" 
            className="text-orange hover:text-orange/80 font-medium inline-flex items-center"
          >
            Learn more <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="w-10 h-10 bg-yellow/10 rounded-lg flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow" />
          </div>
          <h3 className="text-lg font-semibold text-midnight mb-2">Smart Alerts</h3>
          <p className="text-gray-600 mb-4">
            Set up intelligent alerts with configurable rules, cooldown periods, 
            and multi-channel notifications (Slack, Discord, webhooks).
          </p>
          <Link 
            href="/alerts" 
            className="text-yellow hover:text-yellow/80 font-medium inline-flex items-center"
          >
            Learn more <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-midnight mb-4">Quick Start</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-midnight text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <h3 className="font-medium text-midnight">Install the SDK</h3>
              <p className="text-gray-600">Add the package to your project using npm or yarn</p>
              <code className="block mt-2 bg-gray-900 text-gray-100 px-3 py-2 rounded text-sm">
                npm install @wakeuplabs/op-interop-alerts-sdk
              </code>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-midnight text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <h3 className="font-medium text-midnight">Import and Configure</h3>
              <p className="text-gray-600">Import the modules you need and configure your chains</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-midnight text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <h3 className="font-medium text-midnight">Start Monitoring</h3>
              <p className="text-gray-600">Begin tracking cross-chain messages and generating insights</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Link
            href="/installation"
            className="inline-flex items-center px-4 py-2 bg-midnight text-white font-medium rounded-lg hover:bg-black transition-colors"
          >
            View Installation Guide
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-midnight mb-6">Why Choose OP Interop Alerts?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-midnight mb-1">Production Ready</h3>
              <p className="text-gray-600">
                Built for production environments with robust error handling, 
                retry mechanisms, and comprehensive logging.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Package className="w-5 h-5 text-orange mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-midnight mb-1">TypeScript First</h3>
              <p className="text-gray-600">
                Full TypeScript support with comprehensive type definitions 
                for better developer experience and code safety.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <BarChart3 className="w-5 h-5 text-yellow mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-midnight mb-1">Rich Metrics</h3>
              <p className="text-gray-600">
                Detailed performance metrics including latency percentiles, 
                throughput analysis, and health indicators.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-midnight mb-1">Flexible Alerting</h3>
              <p className="text-gray-600">
                Configurable alert rules with multiple notification channels 
                and intelligent cooldown periods to prevent spam.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-midnight mb-4">Ready to Get Started?</h2>
        <p className="text-gray-700 mb-6">
          Follow our comprehensive guides to integrate OP Interop Alerts into your application 
          and start monitoring your cross-chain operations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/installation"
            className="inline-flex items-center px-6 py-3 bg-midnight text-white font-medium rounded-lg hover:bg-black transition-colors"
          >
            Installation Guide
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/examples"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Examples
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
