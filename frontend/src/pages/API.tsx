import React from 'react';
import { ArrowLeft, Code, Zap, Shield, Users, FileText, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SplineScene } from '@/components/ui/splite';
import { Card } from '@/components/ui/card';
import { SpotlightAceternity } from '@/components/ui/spotlight-aceternity';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

const APIPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
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
                    API Reference
                  </h1>
                  <p className="mt-4 text-neutral-300 max-w-lg">
                    Detailed API documentation for all PULSE endpoints and features.
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

          <div className="grid gap-8">
            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
              <p className="text-muted-foreground mb-4">
                Secure authentication endpoints for user management.
              </p>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-mono text-sm mb-2">POST /api/auth/login</h3>
                  <p className="text-sm text-muted-foreground">Authenticate user and return JWT token</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-mono text-sm mb-2">POST /api/auth/register</h3>
                  <p className="text-sm text-muted-foreground">Create new user account</p>
                </div>
              </div>
            </section>

            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">Messaging</h2>
              <p className="text-muted-foreground mb-4">
                Real-time messaging API endpoints.
              </p>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-mono text-sm mb-2">GET /api/messages/:chatId</h3>
                  <p className="text-sm text-muted-foreground">Retrieve chat messages</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-mono text-sm mb-2">POST /api/messages/send</h3>
                  <p className="text-sm text-muted-foreground">Send encrypted message</p>
                </div>
              </div>
            </section>

            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">WebSocket Events</h2>
              <p className="text-muted-foreground mb-4">
                Real-time event handling for live updates.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• message:new - New message received</li>
                <li>• user:typing - User is typing indicator</li>
                <li>• user:online - User online status change</li>
                <li>• chat:updated - Chat metadata updated</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default APIPage;