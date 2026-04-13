import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, MessageSquare, Users, Lock, Zap, Star, HelpCircle, Settings, FileText } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ElementType;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 'security',
    question: 'How secure is Pulse Chat?',
    answer: 'Pulse Chat uses end-to-end encryption for all messages, meaning only you and the intended recipient can read your messages. We also offer Ghost Mode for enhanced anonymity and AI-powered safety monitoring to detect threats in real-time.',
    icon: Shield,
    category: 'Security'
  },
  {
    id: 'ghost-mode',
    question: 'What is Ghost Mode?',
    answer: 'Ghost Mode is our advanced privacy feature that hides your identity completely. When enabled, it masks your name, avatar, last seen status, typing indicators, and all metadata while still allowing you to participate in conversations.',
    icon: Users,
    category: 'Privacy'
  },
  {
    id: 'ai-safety',
    question: 'How does AI safety monitoring work?',
    answer: 'Our 12-node AI grid analyzes every message for toxic content, sentiment spikes, and security threats. It flags potentially harmful content before it reaches you and provides real-time insights for administrators.',
    icon: Zap,
    category: 'Safety'
  },
  {
    id: 'file-sharing',
    question: 'What file types can I share?',
    answer: 'Pulse supports all major file types including images (PNG, JPG, GIF, WebP), documents (PDF, DOC, TXT), archives (ZIP, RAR), and media files (MP4, MP3, WAV). Files are encrypted and stored securely.',
    icon: FileText,
    category: 'Features'
  },
  {
    id: 'group-chat',
    question: 'How do group chats work?',
    answer: 'Create group chats with unlimited members, assign roles and permissions, use admin controls, and manage group settings. Groups support all features including file sharing, reactions, and AI safety monitoring.',
    icon: MessageSquare,
    category: 'Features'
  },
  {
    id: 'data-storage',
    question: 'Where is my data stored?',
    answer: 'All your data is encrypted and stored securely in our cloud infrastructure. We use industry-standard encryption and follow strict data protection regulations. You can export your data at any time.',
    icon: Lock,
    category: 'Privacy'
  },
  {
    id: 'productivity',
    question: 'What productivity features are available?',
    answer: 'Pulse includes keyboard shortcuts, command palette (Ctrl+K), global search, starred messages, scheduled messages, voice messages, bulk operations, and comprehensive search across all your conversations.',
    icon: Star,
    category: 'Features'
  },
  {
    id: 'customization',
    question: 'Can I customize the appearance?',
    answer: 'Yes! Pulse offers 7 different color themes including Dark, Light, Indigo, Teal, Rose, Amber, and Purple. You can also adjust font sizes, enable compact mode, and customize notification settings.',
    icon: Settings,
    category: 'Customization'
  }
];

export function FAQSection() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(faqData.map(item => item.category)))];
  
  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className="py-20 px-6 lg:px-8 relative" style={{ backgroundColor: '#000000' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_800px,rgba(147,51,234,0.05),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(59,130,246,0.05),transparent)]"></div>
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
            Frequently Asked Questions
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
            lineHeight: '1.47',
            letterSpacing: '-0.374px'
          }}>
            Everything you need to know about Pulse Chat's features and security
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-[#0071e3] text-white'
                  : 'bg-[#1a1a1a] text-white border border-[#2a2a2a] hover:bg-[#2a2a2a]'
              }`}
              style={{ 
                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '14px'
              }}
            >
              {category === 'all' ? 'All Topics' : category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFAQs.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.has(item.id);
            
            return (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0071e3]/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#0071e3]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ 
                        color: '#ffffff', 
                        fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
                      }}>
                        {item.question}
                      </h3>
                      <span className="text-sm" style={{ 
                        color: 'rgba(255, 255, 255, 0.6)', 
                        fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                      }}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm" style={{ 
                      color: 'rgba(255, 255, 255, 0.6)', 
                      fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      {isExpanded ? 'Click to collapse' : 'Click to expand'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="pt-4">
                      <p className="text-base leading-relaxed" style={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                        lineHeight: '1.6'
                      }}>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
            <HelpCircle className="w-5 h-5 text-[#0071e3]" />
            <span className="text-white font-medium" style={{ fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Need more help?
            </span>
            <a 
              href="#" 
              className="text-[#0071e3] hover:text-[#2997ff] transition-colors font-medium"
              style={{ fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
