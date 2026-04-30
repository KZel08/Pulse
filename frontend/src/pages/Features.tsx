import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shield, Zap, Brain, Eye, Lock, Code, BarChart3, Github, Slack, Cloud } from 'lucide-react';
import { Header } from '@/components/ui/LandingHeader';

const Features = () => {
  const navigate = useNavigate();

  const featureCategories = [
    {
      title: "Core Features",
      description: "Essential features that make Pulse secure and private",
      items: [
        {
          icon: <Shield className="w-6 h-6" />,
          title: "AI Safety",
          description: "Real-time content monitoring and protection",
          onClick: () => navigate('/features/ai-safety')
        },
        {
          icon: <Eye className="w-6 h-6" />,
          title: "Ghost Mode",
          description: "Complete anonymity and privacy",
          onClick: () => navigate('/features/ghost-mode')
        }
      ]
    },
    {
      title: "Developer Tools",
      description: "Advanced features for developers and integrations",
      items: [
        {
          icon: <Code className="w-6 h-6" />,
          title: "API Documentation",
          description: "Complete API reference and examples",
          onClick: () => navigate('/features/api-docs')
        },
        {
          icon: <Lock className="w-6 h-6" />,
          title: "Security",
          description: "Enterprise-grade security features",
          onClick: () => navigate('/features/security')
        }
      ]
    },
    {
      title: "Analytics & Insights",
      description: "Comprehensive analytics and monitoring tools",
      items: [
        {
          icon: <BarChart3 className="w-6 h-6" />,
          title: "Features Analytics",
          description: "Detailed feature usage analytics",
          onClick: () => navigate('/features/analytics')
        },
        {
          icon: <Cloud className="w-6 h-6" />,
          title: "Integrations",
          description: "Connect with your favorite tools",
          onClick: () => navigate('/features/integrations')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the powerful features that make Pulse the most secure and private messaging platform
          </p>
        </div>

        {/* Feature Categories */}
        <div className="space-y-12">
          {featureCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-3xl font-bold mb-4 text-foreground">{category.title}</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.onClick}
                    className="bg-card border border-border rounded-2xl p-8 hover:shadow-md hover:border-primary/40 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-primary group-hover:text-primary/80 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:underline transition-colors">
                      Explore →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-card border border-border rounded-2xl p-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who trust Pulse for their secure communications.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-card border border-border text-foreground rounded-xl font-semibold hover:bg-accent transition-all duration-200"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;