import React from 'react';
import { ArrowLeft, Quote, TrendingUp, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

interface StoriesPageProps {}

interface CustomerStory {
  id: number;
  company: string;
  industry: string;
  logo: string;
  quote: string;
  result: string;
  metric: string;
  metricValue: string;
  icon: React.ReactNode;
}

const Stories: React.FC<StoriesPageProps> = () => {
  const navigate = useNavigate();

  const stories: CustomerStory[] = [
    {
      id: 1,
      company: "TechCorp Solutions",
      industry: "Technology",
      logo: "TC",
      quote: "Pulse's AI safety monitoring has transformed how we handle internal communications. We've seen a dramatic reduction in inappropriate content while maintaining team productivity.",
      result: "Reduced security incidents by 60% using Pulse's AI safety monitoring",
      metric: "Security Incidents Reduced",
      metricValue: "60%",
      icon: <Shield className="h-6 w-6" />
    },
    {
      id: 2,
      company: "Global Finance Ltd",
      industry: "Financial Services",
      logo: "GF",
      quote: "The Ghost Mode feature has been revolutionary for our sensitive M&A discussions. Our teams can communicate freely without compromising anonymity.",
      result: "Improved deal confidentiality and team collaboration during sensitive projects",
      metric: "Deal Confidentiality",
      metricValue: "100%",
      icon: <Users className="h-6 w-6" />
    },
    {
      id: 3,
      company: "Healthcare Plus",
      industry: "Healthcare",
      logo: "HP",
      quote: "Real-time messaging with enterprise encryption meets our strict HIPAA requirements. The per-chat themes help different departments maintain their own communication styles.",
      result: "Achieved HIPAA compliance while improving inter-departmental communication efficiency",
      metric: "Communication Efficiency",
      metricValue: "45%",
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

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
                Customer <br />
                <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                  Success Stories
                </span>
              </h1>
            </>
          }
        >
          <div className="w-full h-full bg-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
            <div className="space-y-4 text-white text-center w-full">
              <div className="border-b border-zinc-700 pb-4">
                <div className="text-2xl font-bold text-green-400">60% Security Incidents Reduced</div>
                <div className="text-sm text-zinc-400">TechCorp</div>
              </div>
              <div className="border-b border-zinc-700 pb-4">
                <div className="text-2xl font-bold text-blue-400">100% Deal Confidentiality</div>
                <div className="text-sm text-zinc-400">Global Finance</div>
              </div>
              <div className="pb-4">
                <div className="text-2xl font-bold text-primary">45% Communication Efficiency</div>
                <div className="text-sm text-zinc-400">Healthcare Plus</div>
              </div>
            </div>
          </div>
        </ContainerScroll>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-16 mt-16">
          {stories.map((story) => (
            <div
              key={story.id}
              className={cn(
                "bg-card border border-border rounded-xl p-6 shadow-sm",
                "hover:shadow-md transition-shadow duration-200"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">{story.logo}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{story.company}</h3>
                    <p className="text-sm text-muted-foreground">{story.industry}</p>
                  </div>
                </div>
                <div className="text-primary">
                  {story.icon}
                </div>
              </div>

              <div className="relative mb-6">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                <p className="text-muted-foreground italic pl-6">
                  {story.quote}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Key Result:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {story.result}
                  </p>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">
                    {story.metricValue}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {story.metric}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Your Team's Communication?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of organizations that trust Pulse for secure, AI-powered team collaboration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/contact')} size="lg">
              Schedule a Demo
            </Button>
            <Button variant="outline" onClick={() => navigate('/pricing')} size="lg">
              View Pricing
            </Button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-8">
            Trusted by Industry Leaders
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {['TechCorp', 'Global Finance', 'Healthcare Plus', 'SecureNet', 'DataFlow', 'CloudSync'].map((company) => (
              <div key={company} className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {company.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stories;