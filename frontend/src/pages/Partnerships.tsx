import React from 'react';
import { ArrowLeft, Handshake, Code, Users, TrendingUp, Award, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

interface PartnershipsPageProps {}

interface PartnershipTier {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  cta: string;
}

const Partnerships: React.FC<PartnershipsPageProps> = () => {
  const navigate = useNavigate();

  const partnershipTiers: PartnershipTier[] = [
    {
      title: "Technology Partners",
      description: "Integrate your technology with Pulse's secure communication platform",
      icon: <Code className="h-8 w-8" />,
      benefits: [
        "API access and development support",
        "Co-marketing opportunities",
        "Joint go-to-market programs",
        "Technical training and certification",
        "Revenue sharing opportunities",
        "Priority support channel"
      ],
      cta: "Become a Technology Partner"
    },
    {
      title: "Reseller Partners",
      description: "Sell Pulse to your customers and earn recurring revenue",
      icon: <Users className="h-8 w-8" />,
      benefits: [
        "Competitive reseller margins",
        "Sales training and enablement",
        "Lead generation support",
        "Marketing collateral and resources",
        "Deal registration and protection",
        "Partner portal access"
      ],
      cta: "Become a Reseller Partner"
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
                Grow Together <br />
                <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                  with Pulse
                </span>
              </h1>
            </>
          }
        >
          <div className="w-full h-full bg-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
            <div className="grid grid-cols-2 gap-8 text-white w-full">
              <div className="bg-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Code className="h-6 w-6 text-blue-400" />
                  <h3 className="text-xl font-bold">Technology Partners</h3>
                </div>
                <ul className="text-sm text-zinc-300 space-y-1">
                  <li>• API access & development support</li>
                  <li>• Co-marketing opportunities</li>
                  <li>• Joint go-to-market programs</li>
                  <li>• Revenue sharing opportunities</li>
                </ul>
              </div>
              <div className="bg-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-6 w-6 text-green-400" />
                  <h3 className="text-xl font-bold">Reseller Partners</h3>
                </div>
                <ul className="text-sm text-zinc-300 space-y-1">
                  <li>• Competitive reseller margins</li>
                  <li>• Sales training & enablement</li>
                  <li>• Lead generation support</li>
                  <li>• Deal registration & protection</li>
                </ul>
              </div>
            </div>
          </div>
        </ContainerScroll>

        <div className="grid md:grid-cols-2 gap-8 mb-16 mt-16">
          {partnershipTiers.map((tier, index) => (
            <div
              key={index}
              className={cn(
                "bg-card border border-border rounded-xl p-8 shadow-sm",
                "hover:shadow-md transition-shadow duration-200"
              )}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {tier.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{tier.title}</h3>
                  <p className="text-muted-foreground">{tier.description}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {tier.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => navigate('/contact')}
                className="w-full"
                size="lg"
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-muted/50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Why Partner with Pulse?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Growing Market</h3>
              <p className="text-sm text-muted-foreground">
                Tap into the rapidly growing secure communications market with AI-powered solutions
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Proven Technology</h3>
              <p className="text-sm text-muted-foreground">
                Partner with industry-leading AI safety monitoring and enterprise encryption technology
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Global Reach</h3>
              <p className="text-sm text-muted-foreground">
                Serve customers worldwide with our scalable and compliant communication platform
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contact our partnerships team to learn more about how you can join the Pulse partner ecosystem
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/contact')} size="lg">
              Contact Partnerships Team
            </Button>
            <Button variant="outline" onClick={() => navigate('/pricing')} size="lg">
              View Pricing Plans
            </Button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-8">
            Trusted by Leading Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {['CloudTech', 'SecureNet', 'DataFlow', 'IntegrateAI', 'SyncSoft', 'ConnectPro'].map((partner) => (
              <div key={partner} className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {partner.slice(0, 2).toUpperCase()}
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

export default Partnerships;