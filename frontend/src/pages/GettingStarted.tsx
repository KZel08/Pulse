import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SplineScene } from '@/components/ui/splite';
import { Card } from '@/components/ui/card';
import { SpotlightAceternity } from '@/components/ui/spotlight-aceternity';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

interface GettingStartedPageProps {}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const GettingStarted: React.FC<GettingStartedPageProps> = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How do I enable Ghost Mode for anonymous messaging?",
      answer: "Ghost Mode can be toggled from the header bar in any conversation. Click the ghost icon to enable anonymous messaging, which removes metadata and sender identity from your messages."
    },
    {
      id: 2,
      question: "Can I import existing contacts from other messaging apps?",
      answer: "Yes! Pulse supports importing contacts from CSV files. Go to Settings > Contacts > Import and select your CSV file to bulk-add contacts to your Pulse account."
    },
    {
      id: 3,
      question: "What's the difference between Pro and Enterprise plans?",
      answer: "Pro includes unlimited messaging, group chats up to 50 members, and priority support. Enterprise adds unlimited group size, advanced admin controls, custom integrations, and compliance features."
    },
    {
      id: 4,
      question: "How secure are my messages in Pulse?",
      answer: "All messages are encrypted end-to-end using AES-256 encryption. We use zero-knowledge architecture, meaning we can't access your messages even if compelled by authorities."
    }
  ];

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Back Navigation */}
          <Button
            variant="ghost"
            onClick={() => navigate('/landing')}
            className={cn(
              'mb-6 flex items-center gap-2 text-sm font-medium',
              'text-muted-foreground hover:text-primary hover:bg-accent',
              'transition-colors duration-200'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pulse
          </Button>

          {/* Hero Section */}
          <div className="mb-16">
            <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
              <SpotlightAceternity
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
              />
              
              <div className="flex h-full">
                {/* Left content */}
                <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                  <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    Get Up and Running with Pulse
                  </h1>
                  <p className="mt-4 text-neutral-300 max-w-lg">
                    Follow our simple setup guide to start secure, real-time communication with your team.
                  </p>
                </div>

                {/* Right content */}
                <div className="flex-1 relative">
                  <SplineScene 
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Setup Steps */}
          <div className="grid gap-8 mb-16">
            {/* Step 1 */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-4">Create Account</h2>
                  <p className="text-muted-foreground mb-4">
                    Register at <span className="font-mono bg-muted px-2 py-1 rounded">/register</span>, verify your email, and complete the onboarding tour to get familiar with Pulse's features.
                  </p>
                  <Button
                    onClick={() => navigate('/register')}
                    variant="outline"
                    className="mb-4"
                  >
                    Go to Registration
                  </Button>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Email verification required</li>
                    <li>• Interactive onboarding tour</li>
                    <li>• Free 14-day Pro trial</li>
                    <li>• No credit card required</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">2</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-4">Set Up Your Profile</h2>
                  <p className="text-muted-foreground mb-4">
                    Upload avatar, set display name, and configure your status. A complete profile helps team members recognize you and improves collaboration.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Profile photo upload (JPG, PNG)</li>
                    <li>• Custom display name</li>
                    <li>• Status message (Available, Busy, Away)</li>
                    <li>• Timezone and language preferences</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-4">Start a Conversation</h2>
                  <p className="text-muted-foreground mb-4">
                    Create a DM or group chat from the sidebar. Pulse makes it easy to start secure conversations with individuals or teams.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Click "New Chat" in sidebar</li>
                    <li>• Search and add participants</li>
                    <li>• Set group name and avatar</li>
                    <li>• Start messaging instantly</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-orange-600 dark:text-orange-400">4</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-4">Enable Ghost Mode</h2>
                  <p className="text-muted-foreground mb-4">
                    Toggle anonymous messaging from the header bar. Ghost Mode provides complete privacy by removing metadata and sender identity.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Click ghost icon in header</li>
                    <li>• Metadata removal enabled</li>
                    <li>• Device fingerprint masking</li>
                    <li>• Temporary identity tokens</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">5</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-4">Explore Settings</h2>
                  <p className="text-muted-foreground mb-4">
                    Customize theme, notification preferences, font size, and AI monitoring toggle. Make Pulse work exactly how you want it.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Light/dark theme options</li>
                    <li>• Notification controls</li>
                    <li>• Font size adjustment</li>
                    <li>• AI safety monitoring toggle</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between text-left hover:text-foreground transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Getting Help */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Need more help? Check out our comprehensive help center.
            </p>
            <Button
              onClick={() => navigate('/help')}
              variant="outline"
            >
              Visit Help Center
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GettingStarted;