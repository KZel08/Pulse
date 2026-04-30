import React from 'react';
import { ArrowLeft, Shield, BarChart3, FileText, Activity, TrendingUp, Users, MessageSquare, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SplineScene } from '@/components/ui/splite';
import { Card } from '@/components/ui/card';
import { SpotlightAceternity } from '@/components/ui/spotlight-aceternity';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

interface AnalyticsPageProps {}

const Analytics: React.FC<AnalyticsPageProps> = () => {
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
                    Analytics Dashboard
                  </h1>
                  <p className="mt-4 text-neutral-300 max-w-lg">
                    Comprehensive insights into your team's communication patterns and security metrics.
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

          {/* Analytics Dashboard Grid */}
          <div className="grid gap-8 mb-16">
            {/* Safety Dashboard */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Safety Dashboard</h2>
                  <p className="text-muted-foreground mb-4">
                    Real-time AI safety score per conversation, flagged message count, and threat-level heatmap. 
                    Monitor security metrics and respond to potential threats instantly.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">98.5%</div>
                      <div className="text-sm text-muted-foreground">Safety Score</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">12</div>
                      <div className="text-sm text-muted-foreground">Flagged Messages</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">Low</div>
                      <div className="text-sm text-muted-foreground">Threat Level</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Metrics */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Usage Metrics</h2>
                  <p className="text-muted-foreground mb-4">
                    Messages sent per day, active users, peak hours chart with comprehensive usage analytics. 
                    Understand how your team communicates and identify patterns.
                  </p>
                  <div className="grid md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">2,847</div>
                      <div className="text-sm text-muted-foreground">Messages Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">142</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">2:30 PM</div>
                      <div className="text-sm text-muted-foreground">Peak Hour</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">89%</div>
                      <div className="text-sm text-muted-foreground">Engagement Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Reports */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Audit Reports</h2>
                  <p className="text-muted-foreground mb-4">
                    Exportable compliance logs, per-user message activity, and admin action history. 
                    Complete audit trail for regulatory compliance and internal governance.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Exportable CSV/PDF reports</li>
                    <li>• Per-user activity tracking</li>
                    <li>• Admin action logging</li>
                    <li>• Compliance-ready documentation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Monitoring Nodes */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">AI Monitoring Nodes</h2>
                  <p className="text-muted-foreground mb-4">
                    Visualize the live status of AI safety nodes attached to each chat room. 
                    Monitor AI performance, response times, and detection accuracy in real-time.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Node Alpha</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Status: Active | Latency: 45ms | Accuracy: 99.2%</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Node Beta</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Status: Active | Latency: 52ms | Accuracy: 98.8%</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium">Node Gamma</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Status: Maintenance | Latency: -- | Accuracy: --</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-6">Key Performance Indicators</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">+24%</div>
                <div className="text-sm text-muted-foreground">Message Growth</div>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">3.2K</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">45K</div>
                <div className="text-sm text-muted-foreground">Messages/Week</div>
              </div>
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">0.3%</div>
                <div className="text-sm text-muted-foreground">Alert Rate</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;