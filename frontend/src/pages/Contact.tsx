import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

interface ContactPageProps {}

const Contact: React.FC<ContactPageProps> = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, this would send to a backend
    alert('Thank you for your demo request! We will contact you within 24 hours.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
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
                Let's Talk <br />
                <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                  Schedule a Demo
                </span>
              </h1>
            </>
          }
        >
          <div className="w-full h-full bg-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
            <div className="text-white text-center space-y-4">
              <div className="text-2xl font-bold text-green-400">Response within 24 hours</div>
              <div className="text-lg text-zinc-300">Enterprise demos available</div>
              <div className="text-sm text-zinc-400">Free consultation</div>
            </div>
          </div>
        </ContainerScroll>

        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Schedule a Demo
            </h1>
            <p className="text-xl text-muted-foreground">
              See how Pulse's AI-powered secure communication can transform your team's collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Why Choose Pulse for Enterprise?
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">AI Safety Monitoring</h3>
                    <p className="text-sm text-muted-foreground">Real-time content moderation and threat detection powered by advanced AI</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Ghost Mode Privacy</h3>
                    <p className="text-sm text-muted-foreground">Complete anonymity options for sensitive communications</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Enterprise Encryption</h3>
                    <p className="text-sm text-muted-foreground">End-to-end encryption with enterprise-grade key management</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Per-Chat Themes</h3>
                    <p className="text-sm text-muted-foreground">Customizable themes for different teams and projects</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <span>sales@pulsechat.com</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Phone className="h-5 w-5" />
                  <span>1-800-PULSE-AI</span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={cn(
                      "w-full px-3 py-2 border border-input rounded-md bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      "placeholder:text-muted-foreground"
                    )}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={cn(
                      "w-full px-3 py-2 border border-input rounded-md bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      "placeholder:text-muted-foreground"
                    )}
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className={cn(
                      "w-full px-3 py-2 border border-input rounded-md bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      "placeholder:text-muted-foreground"
                    )}
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Tell us about your needs *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={cn(
                      "w-full px-3 py-2 border border-input rounded-md bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      "placeholder:text-muted-foreground resize-none"
                    )}
                    placeholder="Describe your team size, current communication challenges, and what features interest you most..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Schedule Demo
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                By submitting this form, you agree to be contacted by our sales team within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;