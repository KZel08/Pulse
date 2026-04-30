import React from 'react';
import { ArrowLeft, Zap, Activity, Wifi, Clock, BarChart3, MessageCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SplineScene } from '@/components/ui/splite';
import { Card } from '@/components/ui/card';
import { SpotlightAceternity } from '@/components/ui/spotlight-aceternity';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

interface RealtimeMessagingPageProps {}

const RealtimeMessaging: React.FC<RealtimeMessagingPageProps> = () => {
  const navigate = useNavigate();

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
                    Real-Time Messaging
                  </h1>
                  <p className="mt-4 text-neutral-300 max-w-lg">
                    Experience instant message delivery with WebSocket-powered real-time synchronization.
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

          {/* Real-time Features Grid */}
          <div className="grid gap-8 mb-16">
            {/* Socket.IO Architecture */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-6 h-6 text-primary dark:text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Socket.IO Architecture</h2>
                  <p className="text-muted-foreground mb-4">
                    Persistent bidirectional WebSocket connections with automatic reconnection and sub-100ms delivery latency. 
                    Our infrastructure ensures your messages are delivered instantly, even in challenging network conditions.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Persistent WebSocket connections</li>
                    <li>• Automatic reconnection with exponential backoff</li>
                    <li>• Sub-100ms delivery latency</li>
                    <li>• Connection pooling and load balancing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Typing Indicators */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Typing Indicators</h2>
                  <p className="text-muted-foreground mb-4">
                    Real-time presence signals broadcast to all conversation participants via Socket.IO room events. 
                    See when others are typing, online, or away with instant visual feedback.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Real-time typing status</li>
                    <li>• Online/away presence indicators</li>
                    <li>• Room-based presence management</li>
                    <li>• Customizable presence states</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Message Status Pipeline */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary dark:text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Message Status Pipeline</h2>
                  <p className="text-muted-foreground mb-4">
                    Sent → Delivered → Read receipt chain with timestamp precision. 
                    Track every message's journey with detailed delivery confirmation and read receipts.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Sent confirmation</li>
                    <li>• Delivered to server</li>
                    <li>• Delivered to recipient</li>
                    <li>• Read receipt with timestamps</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Group Broadcasting */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Group Broadcasting</h2>
                  <p className="text-muted-foreground mb-4">
                    Fan-out message delivery to all room members simultaneously, optimized for groups up to 500 members. 
                    Our broadcasting system ensures everyone receives messages at the same time.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Simultaneous message delivery</li>
                    <li>• Support for up to 500 members</li>
                    <li>• Efficient fan-out architecture</li>
                    <li>• Message ordering guarantees</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Offline Queue */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Offline Queue</h2>
                  <p className="text-muted-foreground mb-4">
                    Messages queued server-side and flushed on reconnect, ensuring zero message loss. 
                    Never worry about losing important messages during network interruptions.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Server-side message queuing</li>
                    <li>• Automatic flush on reconnect</li>
                    <li>• Zero message loss guarantee</li>
                    <li>• Persistent offline storage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-card rounded-lg border p-8 mb-16">
            <h2 className="text-2xl font-semibold mb-6">Performance Metrics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">&lt;100ms</div>
                <div className="text-sm text-muted-foreground">Average Delivery Latency</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500</div>
                <div className="text-sm text-muted-foreground">Max Group Size</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RealtimeMessaging;