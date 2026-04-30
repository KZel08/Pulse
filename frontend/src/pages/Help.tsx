import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, MessageSquare, Users, Settings, Shield, Upload, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/LandingHeader';

interface HelpPageProps {}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: string;
}

const Help: React.FC<HelpPageProps> = () => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How do I enable Ghost Mode?",
      answer: "To enable Ghost Mode, click the Ghost toggle button in the main header. When enabled, your identity will be masked from other participants in your conversations. Ghost Mode provides enhanced privacy while still maintaining AI safety monitoring. You can toggle it off at any time to return to normal mode.",
      icon: <Ghost className="h-5 w-5" />,
      category: "Privacy"
    },
    {
      id: 2,
      question: "How do I create group chats?",
      answer: "Creating a group chat is easy. Click the 'New Group' button in the sidebar, or use the keyboard shortcut Ctrl+G. Add participants by searching for their usernames or emails, give your group a name, and optionally set a custom theme. Group chats support all features including file sharing and Ghost Mode.",
      icon: <Users className="h-5 w-5" />,
      category: "Chat Features"
    },
    {
      id: 3,
      question: "How do I set per-chat themes?",
      answer: "Each chat can have its own unique theme. Open the chat you want to customize, click the settings icon in the chat header, and select 'Theme'. Choose from preset themes or create custom themes with your preferred colors, fonts, and backgrounds. Themes are saved per chat and sync across all your devices.",
      icon: <Settings className="h-5 w-5" />,
      category: "Customization"
    },
    {
      id: 4,
      question: "How does AI safety monitoring work?",
      answer: "Pulse uses advanced AI to monitor content in real-time for safety and compliance. The system automatically detects harmful content, policy violations, and potential security threats. When issues are detected, appropriate actions are taken based on your organization's policies. All monitoring is designed to respect privacy while maintaining a safe environment.",
      icon: <Shield className="h-5 w-5" />,
      category: "Safety"
    },
    {
      id: 5,
      question: "How do I share files?",
      answer: "File sharing is simple and secure. Click the attachment icon in any chat, select your file, and it will be uploaded with end-to-end encryption. Supported file types include documents, images, videos, and more. Files are automatically scanned for security and can be up to 100MB in size for Pro users.",
      icon: <Upload className="h-5 w-5" />,
      category: "File Sharing"
    },
    {
      id: 6,
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address, and we'll send you a password reset link. The link expires after 24 hours for security. Follow the instructions in the email to create a new password. If you don't receive the email, check your spam folder.",
      icon: <Lock className="h-5 w-5" />,
      category: "Account"
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleExpand = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleCategory = (category: string) => {
    const categoryIds = faqs.filter(faq => faq.category === category).map(faq => faq.id);
    const allExpanded = categoryIds.every(id => expandedItems.includes(id));
    
    if (allExpanded) {
      setExpandedItems(prev => prev.filter(id => !categoryIds.includes(id)));
    } else {
      setExpandedItems(prev => [...new Set([...prev, ...categoryIds])]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* ContainerScroll Hero */}
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                We're Here <br />
                <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                  to Help
                </span>
              </h1>
            </>
          }
        >
          <div className="w-full h-full bg-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
            <div className="grid grid-cols-3 gap-6 text-white w-full">
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-green-400">&lt; 2hr</div>
                <div className="text-sm text-zinc-400">Response Time</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-blue-400">98%</div>
                <div className="text-sm text-zinc-400">Resolution Rate</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-zinc-400">AI Support</div>
              </div>
            </div>
          </div>
        </ContainerScroll>

        <div className="max-w-4xl mx-auto mt-16">

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 mt-16">
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our support team
              </p>
              <Button variant="outline" size="sm">Start Chat</Button>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our comprehensive docs
              </p>
              <Button variant="outline" size="sm" onClick={() => navigate('/docs')}>View Docs</Button>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Community</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join our user community
              </p>
              <Button variant="outline" size="sm">Join Forum</Button>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {faq.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground">{faq.category}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  
                  {expandedItems.includes(faq.id) && (
                    <div className="px-6 pb-4 pt-0">
                      <div className="pl-13 pr-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-muted/50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our support team is here to help you get the most out of Pulse. Reach out through any of these channels.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Get help via email
                </p>
                <a href="mailto:support@pulsechat.com" className="text-primary hover:underline">
                  support@pulsechat.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Mon-Fri, 9 AM - 6 PM PST
                </p>
                <a href="tel:18007853723" className="text-primary hover:underline">
                  1-800-PULSE-AI
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Available 24/7 for Pro users
                </p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/contact')}>
                Contact Support Team
              </Button>
              <Button variant="outline" onClick={() => navigate('/docs')}>
                Browse Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ghost icon component since it's used in the FAQ
const Ghost = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default Help;