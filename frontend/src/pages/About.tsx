import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

const AboutPage: React.FC = () => {
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

          {/* ContainerScroll Hero */}
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold text-black dark:text-white">
                  The Future of <br />
                  <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                    Secure Communication
                  </span>
                </h1>
              </>
            }
          >
            <div className="w-full h-full bg-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
              <div className="grid grid-cols-2 gap-6 text-white text-center">
                <div className="bg-zinc-800 rounded-lg p-4">
                  <div className="text-2xl font-bold">500K+</div>
                  <div className="text-sm text-zinc-400">Users</div>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-zinc-400">Uptime</div>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <div className="text-2xl font-bold">Zero</div>
                  <div className="text-sm text-zinc-400">Breaches</div>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <div className="text-2xl font-bold">AES-256</div>
                  <div className="text-sm text-zinc-400">Encrypted</div>
                </div>
              </div>
            </div>
          </ContainerScroll>

          <div className="grid gap-8 mt-16">
            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                PULSE is dedicated to providing secure, private, and reliable communication solutions for everyone. 
                We believe that privacy is a fundamental right, and our platform is built on the principles of 
                security, transparency, and user empowerment.
              </p>
            </section>

            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">🔒 End-to-End Encryption</h3>
                  <p className="text-sm text-muted-foreground">Military-grade encryption for all communications</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">⚡ Real-Time Messaging</h3>
                  <p className="text-sm text-muted-foreground">Instant message delivery with WebSocket technology</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">🛡️ Zero-Knowledge Architecture</h3>
                  <p className="text-sm text-muted-foreground">We can't access your messages, even if we wanted to</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">🌍 Global Infrastructure</h3>
                  <p className="text-sm text-muted-foreground">Distributed servers for reliability and speed</p>
                </div>
              </div>
            </section>

            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
              <p className="text-muted-foreground mb-4">
                Built with modern, secure technologies:
              </p>
              <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li>• React & TypeScript for the frontend</li>
                <li>• Node.js for backend services</li>
                <li>• WebSocket for real-time communication</li>
                <li>• Advanced encryption algorithms</li>
                <li>• Cloud-native architecture</li>
                <li>• AI-powered safety features</li>
              </ul>
            </section>

            <section className="bg-card rounded-lg border p-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                Have questions or feedback? We'd love to hear from you.
              </p>
              <div className="space-y-2 text-sm">
                <p>📧 support@pulse.com</p>
                <p>💬 Discord Community</p>
                <p>🐦 Twitter @pulse_secure</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;