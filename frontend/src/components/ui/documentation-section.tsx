import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Book, Code, Shield, Users, Zap, MessageSquare, Settings, FileText, Cpu } from 'lucide-react';

interface DocItem {
  id: string;
  title: string;
  icon: React.ElementType;
  content: string[];
  codeExample?: string;
}

const documentationData: DocItem[] = [
  {
    id: 'overview',
    title: 'Project Overview',
    icon: Book,
    content: [
      'Pulse is a next-generation AI-powered chat application built with modern web technologies.',
      'The application features real-time messaging, AI safety monitoring, and advanced privacy controls.',
      'Built with React 19, TypeScript, and Tailwind CSS for a premium user experience.',
      'State management handled by Zustand, with real-time communication via Socket.IO.'
    ]
  },
  {
    id: 'tech-stack',
    title: 'Technology Stack',
    icon: Code,
    content: [
      'Frontend: React 19 with TypeScript for type-safe development',
      'Build Tool: Vite for lightning-fast development and building',
      'Styling: Tailwind CSS with custom dark theme system',
      'State Management: Zustand for lightweight, performant state handling',
      'Routing: React Router DOM for seamless navigation',
      'API Communication: Axios for HTTP requests',
      'Real-time: Socket.IO for live messaging',
      'Icons: Lucide React for consistent iconography'
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication System',
    icon: Shield,
    content: [
      'Secure login system with dummy credentials for demo purposes',
      'State persistence using localStorage for session management',
      'Ghost mode feature for enhanced privacy and anonymity',
      'Type-safe authentication store with Zustand',
      'Protected routes and user session validation',
      'Login credentials: username "abh" with password "123"'
    ],
    codeExample: `// Authentication Store
const { login, logout, user, isGhostMode } = useAuthStore();

// Login with credentials
await login('abh', '123');

// Toggle ghost mode
toggleGhostMode();`
  },
  {
    id: 'chat-system',
    title: 'Real-time Chat System',
    icon: MessageSquare,
    content: [
      'WebSocket-based real-time messaging with Socket.IO',
      'Message history and conversation persistence',
      'Typing indicators and read receipts',
      'File attachment support with preview functionality',
      'Group chat creation and management',
      'Message search and filtering capabilities',
      'Responsive chat interface optimized for all devices'
    ],
    codeExample: `// Chat Store Usage
const { messages, sendMessage, activeChat } = useChatStore();

// Send a message
await sendMessage({
  content: 'Hello, world!',
  chatId: activeChat?.id,
  type: 'text'
});`
  },
  {
    id: 'ghost-mode',
    title: 'Ghost Mode Features',
    icon: Users,
    content: [
      'Advanced anonymity system for privacy-conscious users',
      'AI-powered insights and safety monitoring panel',
      'Purple-themed UI when ghost mode is active',
      'Identity masking and metadata hiding',
      'Enhanced encryption in ghost mode',
      'Safety analytics and threat detection',
      'Real-time AI insights for chat safety'
    ]
  },
  {
    id: 'file-system',
    title: 'File Management',
    icon: FileText,
    content: [
      'Drag-and-drop file upload functionality',
      'Multiple file format support (images, documents, media)',
      'File preview modal with zoom capabilities',
      'File sharing in chat conversations',
      'Download and save functionality',
      'File size validation and error handling',
      'Progress indicators for file uploads'
    ]
  },
  {
    id: 'group-chat',
    title: 'Group Conversations',
    icon: Users,
    content: [
      'Create and manage group conversations',
      'Add/remove participants dynamically',
      'Group permissions and admin controls',
      'Group chat history and search',
      'Mention notifications and @mentions',
      'Group settings and customization',
      'Leave or delete group conversations'
    ]
  },
  {
    id: 'ai-safety',
    title: 'AI Safety Monitoring',
    icon: Shield,
    content: [
      'Real-time content analysis and safety checks',
      'AI-powered threat detection and prevention',
      'Safety insights dashboard with analytics',
      'Automated content moderation',
      'User behavior analysis and reporting',
      'Safety alerts and notifications',
      'Configurable safety rules and filters'
    ]
  },
  {
    id: 'core-architecture',
    title: 'Core Architecture',
    icon: Cpu,
    content: [
      'Component-based architecture for maintainability',
      'Type-safe development with full TypeScript integration',
      'Modular service layer for API communications',
      'WebSocket service for real-time updates',
      'Error handling and loading states throughout',
      'Responsive design with smooth transitions',
      'Theme switching between normal and ghost modes'
    ]
  },
  {
    id: 'ui-features',
    title: 'UI/UX Features',
    icon: Settings,
    content: [
      'Modern interface with Apple-inspired design system',
      'Smooth animations and micro-interactions',
      'Dark theme with purple accent for ghost mode',
      'Responsive design optimized for all screen sizes',
      'Loading states and skeleton screens',
      'Toast notifications and user feedback',
      'Keyboard shortcuts and accessibility features'
    ]
  }
];

export function DocumentationSection() {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const toggleDoc = (docId: string) => {
    setExpandedDoc(expandedDoc === docId ? null : docId);
  };

  return (
    <section className="py-20 px-6 lg:px-8 relative" style={{ backgroundColor: '#000000' }}>
      {/* Dotted Surface Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(147,51,234,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-semibold mb-6" style={{ 
            color: '#ffffff', 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600,
            lineHeight: '1.07',
            letterSpacing: '-0.28px'
          }}>
            Documentation & Resources
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
            lineHeight: '1.47',
            letterSpacing: '-0.374px'
          }}>
            Explore the technical details and features that make Pulse a next-generation communication platform
          </p>
        </div>

        {/* Documentation Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentationData.map((doc) => {
            const Icon = doc.icon;
            const isExpanded = expandedDoc === doc.id;
            
            return (
              <div
                key={doc.id}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Header */}
                <div
                  className="p-6 cursor-pointer transition-all hover:bg-white/5"
                  onClick={() => toggleDoc(doc.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold" style={{ 
                        color: '#ffffff', 
                        fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: 600
                      }}>
                        {doc.title}
                      </h3>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm" style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    Click to {isExpanded ? 'collapse' : 'expand'} documentation
                  </p>
                </div>

                {/* Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="pt-4 space-y-3">
                      {doc.content.map((paragraph, index) => (
                        <p key={index} className="text-sm leading-relaxed" style={{ 
                          color: 'rgba(255, 255, 255, 0.8)', 
                          fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                          lineHeight: '1.5'
                        }}>
                          {paragraph}
                        </p>
                      ))}
                      
                      {doc.codeExample && (
                        <div className="mt-4">
                          <h4 className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ 
                            color: 'rgba(255, 255, 255, 0.6)', 
                            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                          }}>
                            Code Example:
                          </h4>
                          <pre className="p-3 rounded-lg text-xs overflow-x-auto" style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                            color: '#a5f3fc',
                            fontFamily: 'SF Mono, Monaco, monospace',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <code>{doc.codeExample}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-8" style={{ 
            color: '#ffffff', 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600
          }}>
            Quick Resources
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'API Reference', icon: Code },
              { label: 'Getting Started', icon: Book },
              { label: 'Security Guide', icon: Shield },
              { label: 'Best Practices', icon: Zap }
            ].map((resource, index) => {
              const Icon = resource.icon;
              return (
                <button
                  key={index}
                  className="flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:bg-white/10"
                  style={{ 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{resource.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
