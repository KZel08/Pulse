import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pricing } from '@/components/ui/single-pricing-card-1';
import { Header } from '@/components/ui/LandingHeader';

export default function PricingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 pt-6">
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
      </div>
      <Pricing />
    </div>
  );
}