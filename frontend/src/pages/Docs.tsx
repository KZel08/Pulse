import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

const DocsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive guides and API references for building with PULSE.
            </p>
          </div>

          <div className="grid gap-8">
            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <p className="text-muted-foreground mb-4">
                Learn the basics of PULSE and how to set up your first secure messaging application.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Installation and setup</li>
                <li>• Basic configuration</li>
                <li>• Your first message</li>
                <li>• Security best practices</li>
              </ul>
            </section>

            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
              <p className="text-muted-foreground mb-4">
                Complete API documentation for all PULSE endpoints and features.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Authentication endpoints</li>
                <li>• Messaging API</li>
                <li>• Real-time WebSocket connections</li>
                <li>• File sharing protocols</li>
              </ul>
            </section>

            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">Security Features</h2>
              <p className="text-muted-foreground mb-4">
                Understanding PULSE's security architecture and encryption methods.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• End-to-end encryption</li>
                <li>• Zero-knowledge architecture</li>
                <li>• Secure key management</li>
                <li>• Privacy controls</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocsPage;