'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  filename?: string;
  inTabs?: boolean;
}

export default function CodeBlock({ children, language = 'typescript', title, filename, inTabs = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (inTabs) {
    return (
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            background: '#14141A',
            borderRadius: 0,
          }}
          className="code-block-mobile"
          showLineNumbers={false}
          wrapLines={true}
          wrapLongLines={true}
        >
          {children.trim()}
        </SyntaxHighlighter>
        
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
          ) : (
            <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="relative my-4 sm:my-6 rounded-lg overflow-hidden">
      {(title || filename) && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {filename && (
              <span className="text-xs sm:text-sm font-mono text-gray-300 truncate">{filename}</span>
            )}
            {title && (
              <span className="text-xs sm:text-sm text-gray-400 truncate">{title}</span>
            )}
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-xs text-gray-500 uppercase tracking-wide">{language}</span>
          </div>
        </div>
      )}
      
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            background: '#14141A',
            borderRadius: 0,
          }}
          className="code-block-mobile"
          showLineNumbers={false}
          wrapLines={true}
          wrapLongLines={true}
        >
          {children.trim()}
        </SyntaxHighlighter>
        
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
          ) : (
            <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
          )}
        </button>
      </div>
    </div>
  );
}

interface TabsProps {
  children: React.ReactNode;
}

export function CodeTabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = React.Children.toArray(children) as React.ReactElement[];
  
  return (
    <div className="my-4 sm:my-6 rounded-lg overflow-hidden bg-midnight">
      <div className="flex bg-gray-800">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === index
                ? 'text-white bg-midnight'
                : 'text-gray-300 hover:text-white bg-gray-800'
            }`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="bg-midnight">
        {tabs[activeTab]}
      </div>
    </div>
  );
}

interface TabPanelProps {
  label: string;
  children: React.ReactNode;
}

export function TabPanel({ children }: TabPanelProps) {
  // Clone children and add inTabs prop to CodeBlock components
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === CodeBlock) {
      return React.cloneElement(child as React.ReactElement<CodeBlockProps>, { inTabs: true });
    }
    return child;
  });

  return <div>{childrenWithProps}</div>;
}
