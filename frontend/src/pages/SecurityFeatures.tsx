import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText, AlertTriangle, CheckCircle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SplineScene } from '@/components/ui/splite';
import { Card } from '@/components/ui/card';
import { SpotlightAceternity } from '@/components/ui/spotlight-aceternity';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

interface SecurityFeaturesPageProps {}

const SecurityFeatures: React.FC<SecurityFeaturesPageProps> = () => {
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
                    Enterprise-Grade Security
                  </h1>
                  <p className="mt-4 text-neutral-300 max-w-lg">
                    Pulse combines cutting-edge encryption with AI-powered threat detection to keep your communications secure.
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

          {/* Security Features Grid */}
          <div className="grid gap-8 mb-16">
            {/* End-to-End Encryption */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-primary dark:text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">End-to-End Encryption</h2>
                  <p className="text-muted-foreground mb-4">
                    All messages in Pulse are encrypted in transit and at rest using AES-256 encryption with per-session key rotation. 
                    This ensures that even if our servers were compromised, your messages would remain completely unreadable.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• AES-256 encryption for all message content</li>
                    <li>• Per-session key rotation every 24 hours</li>
                    <li>• Perfect forward secrecy</li>
                    <li>• Zero-access architecture</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Safety Monitoring */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">AI Safety Monitoring Without Compromising Privacy</div>
                  <p className="text-muted-foreground mb-4">
                    Real-time content moderation layer that flags anomalous patterns without reading message content. 
                    Our privacy-preserving AI analyzes metadata and patterns to detect potential threats while maintaining message confidentiality.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Privacy-preserving pattern analysis</li>
                    <li>• Real-time threat detection</li>
                    <li>• Zero-content access monitoring</li>
                    <li>• Customizable safety thresholds</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ghost Mode Security */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary dark:text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Ghost Mode Security</h2>
                  <p className="text-muted-foreground mb-4">
                    Anonymous messaging sessions that strip metadata, sender identity, and device fingerprints from the message payload. 
                    Ghost Mode provides complete anonymity for sensitive communications.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Complete metadata removal</li>
                    <li>• Device fingerprint masking</li>
                    <li>• IP address obfuscation</li>
                    <li>• Temporary identity tokens</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Audit Logs</h2>
                  <p className="text-muted-foreground mb-4">
                    Every administrative action, member change, and file share is immutably logged per conversation for compliance. 
                    Our tamper-proof audit trails ensure complete transparency and accountability.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Immutable blockchain-based logging</li>
                    <li>• Complete action traceability</li>
                    <li>• Compliance-ready reports</li>
                    <li>• Real-time audit monitoring</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Zero-Knowledge Architecture */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <Key className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Zero-Knowledge Architecture</h2>
                  <p className="text-muted-foreground mb-4">
                    Pulse's backend never stores decryption keys alongside message ciphertext. 
                    This means we cannot access your messages even if compelled by legal authorities.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Client-side encryption only</li>
                    <li>• Server never sees plaintext</li>
                    <li>• Keys stored client-side only</li>
                    <li>• End-to-end encrypted backups</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-card rounded-lg border p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to secure your team?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact our security team to learn how Pulse can protect your organization's communications with enterprise-grade security.
            </p>
            <Button
              onClick={() => navigate('/contact')}
              className="px-8 py-3 text-lg"
            >
              Schedule a Security Demo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityFeatures;