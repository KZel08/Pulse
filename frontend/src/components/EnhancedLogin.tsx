import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Shield, Eye, EyeOff, Loader2, Search, Rocket, Home, File, Cog } from 'lucide-react';
import { SpiralAnimation } from './ui/spiral-animation';
import { OmniCommandPalette, type OmniSource, type OmniItem } from './ui/omni-command-palette';
import { Features } from './ui/features-6';
import { DocumentationSection } from './ui/documentation-section';
import { FAQSection } from './ui/faq-section';
import { VideoDemoSection } from './ui/video-demo-section';
import { EnhancedFooter } from './ui/enhanced-footer';

const EnhancedLogin: React.FC = () => {
  const { login, register, user } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Auto-focus first field when switching modes
  useEffect(() => {
    if (isLoginMode) {
      setFocusedField('email');
    } else {
      setFocusedField('name');
    }
  }, [isLoginMode]);

  // Handle smooth scroll to auth section
  const scrollToAuth = () => {
    const authSection = document.getElementById('auth-section');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth' });
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Command palette sources
  const commandsSource: OmniSource = {
    id: 'commands',
    label: 'Commands',
    async fetch(query: string) {
      const base: OmniItem[] = [
        {
          id: 'new-project',
          label: 'Create Project',
          subtitle: 'Start a new workspace',
          groupId: 'commands',
          icon: <Rocket className="size-4" />,
          pinned: true,
          onAction: () => alert('Project created!'),
          keywords: ['start', 'init', 'workspace'],
        },
        {
          id: 'settings',
          label: 'Open Settings',
          subtitle: 'Profile, notifications, billing',
          groupId: 'commands',
          icon: <Cog className="size-4" />,
          shortcut: ['\u2318', ','],
          onAction: () => alert('Opening settings...'),
          keywords: ['preferences'],
        },
        {
          id: 'home',
          label: 'Go to Dashboard',
          groupId: 'commands',
          icon: <Home className="size-4" />,
          href: '/',
          keywords: ['start', 'main', 'root'],
        },
      ];
      return base.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) || 
        (item.keywords && item.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())))
      );
    },
  };

  const pagesSource: OmniSource = {
    id: 'pages',
    label: 'Pages',
    async fetch(query: string) {
      const base: OmniItem[] = [
        {
          id: 'docs-1',
          label: 'Getting Started',
          subtitle: 'Documentation',
          groupId: 'pages',
          icon: <File className="size-4" />,
          href: '/docs/getting-started',
          keywords: ['docs', 'guide'],
        },
        {
          id: 'docs-2',
          label: 'API Reference',
          subtitle: 'Technical documentation',
          groupId: 'pages',
          icon: <File className="size-4" />,
          href: '/docs/api',
          keywords: ['api', 'reference'],
        },
      ];
      return base.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) || 
        (item.keywords && item.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())))
      );
    },
  };

  // Global hotkey for command palette
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commandPaletteOpen]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        // Handle registration
        await register(email, password, name);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is authenticated, redirect to main app
  useEffect(() => {
    if (user) {
      window.location.href = '/app';
    }
  }, [user]);

  return (
    <div className="min-h-screen dark" style={{ backgroundColor: '#000000' }}>
      {/* Navigation Bar - Premium Dark Glass with Apple styling */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" style={{ color: '#ffffff' }} />
              <span className="text-lg font-semibold" style={{ 
                color: '#ffffff', 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' 
              }}>Pulse</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium transition-all hover:opacity-80" style={{ 
                color: '#ffffff', 
                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400
              }}>
                Features
              </a>
              <a href="#video" className="text-sm font-medium transition-all hover:opacity-80" style={{ 
                color: '#ffffff', 
                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400
              }}>
                Demo
              </a>
              <a href="#faq" className="text-sm font-medium transition-all hover:opacity-80" style={{ 
                color: '#ffffff', 
                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400
              }}>
                FAQ
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCommandPaletteOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-all" style={{ 
                  transform: 'scale(1)',
                  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Search className="w-4 h-4" style={{ color: '#ffffff' }} />
              </button>
              <button 
                onClick={() => {
                  setIsLoginMode(true);
                  scrollToAuth();
                }}
                className="px-6 py-2 text-sm font-medium rounded-full transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: '#0071e3', 
                  color: '#ffffff',
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  border: 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Log In
              </button>
              <button 
                onClick={() => {
                  setIsLoginMode(false);
                  scrollToAuth();
                }}
                className="px-6 py-2 text-sm font-medium rounded-full transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  border: '1px solid #ffffff',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Try Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium Dark with Spiral Animation */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        {/* Spiral Animation Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <SpiralAnimation />
        </div>
        
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Hero Image with Animation */}
          <div className="mb-12" style={{
            transform: `translateY(${isTransitioning ? '20px' : '0'})`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isTransitioning ? 0.8 : 1
          }}>
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm"
              style={{ 
                boxShadow: 'rgba(0, 0, 0, 0.4) 0px 4px 20px 0px',
                transform: 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: '#0071e3'
              }}
            >
              <div className="text-center">
                <Shield className="w-20 h-20 text-white mb-2" />
              </div>
            </div>
          </div>
          
          {/* Hero Headline */}
          <h1 className="text-6xl lg:text-[72px] font-semibold mb-6" style={{ 
            color: '#ffffff', 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600,
            lineHeight: '1.07',
            letterSpacing: '-0.28px'
          }}>
            Next-Generation
            <br />
            AI Communication
          </h1>
          
          {/* Hero Subtitle */}
          <p className="text-xl lg:text-2xl mb-12 max-w-3xl mx-auto" style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
            lineHeight: '1.47',
            letterSpacing: '-0.374px'
          }}>
            Experience secure, intelligent conversations with real-time AI safety monitoring and enterprise-grade encryption.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => {
                setIsLoginMode(false);
                scrollToAuth();
              }}
              className="px-8 py-4 text-lg font-medium rounded-full transition-all hover:opacity-90"
              style={{ 
                backgroundColor: '#0071e3', 
                color: '#ffffff',
                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400,
                border: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Try Now
            </button>
            <button 
              onClick={() => {
                setIsLoginMode(true);
                scrollToAuth();
              }}
              className="px-8 py-4 text-lg font-medium rounded-full transition-all hover:opacity-90"
              style={{ 
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400,
                border: '1px solid #ffffff',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section - Using the new Features Component */}
      <Features />

      {/* Documentation Section */}
      <DocumentationSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Video Demo Section */}
      <VideoDemoSection />

      {/* Authentication Section */}
      <section id="auth-section" className="py-20 px-6 lg:px-8" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Login Form */}
            <div className="order-2 lg:order-1">
              <div className="max-w-md mx-auto lg:mx-0">
                <h2 className="text-4xl lg:text-5xl font-semibold mb-6" style={{ 
                  color: '#ffffff', 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 600,
                  lineHeight: '1.10',
                  letterSpacing: '-0.28px'
                }}>
                  {isLoginMode ? 'Welcome Back' : 'Get Started'}
                </h2>
                <p className="text-xl text-center mb-12 max-w-2xl mx-auto" style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.47',
                  letterSpacing: '-0.374px'
                }}>
                  {isLoginMode ? 'Log in to your account to continue your secure conversations' : 'Create your account and start experiencing next-generation AI-powered communication'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLoginMode && (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 rounded-lg transition-all ${focusedField === 'name' ? 'ring-2' : ''}`}
                        style={{ 
                          backgroundColor: '#1a1a1a',
                          color: '#ffffff',
                          border: focusedField === 'name' ? '2px solid #0071e3' : '1px solid rgba(255, 255, 255, 0.1)',
                          fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                          fontWeight: 400,
                          outline: 'none',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-lg transition-all ${focusedField === 'email' ? 'ring-2' : ''}`}
                      style={{ 
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                        border: focusedField === 'email' ? '2px solid #0071e3' : '1px solid rgba(255, 255, 255, 0.1)',
                        fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: 400,
                        outline: 'none',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-lg transition-all ${focusedField === 'password' ? 'ring-2' : ''}`}
                      style={{ 
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                        border: focusedField === 'password' ? '2px solid #0071e3' : '1px solid rgba(255, 255, 255, 0.2)',
                        fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: 400,
                        outline: 'none',
                        borderRadius: '8px',
                        minHeight: '48px',
                        fontSize: '16px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      style={{ zIndex: 10 }}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {!isLoginMode && (
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 rounded-lg transition-all ${focusedField === 'confirmPassword' ? 'ring-2' : ''}`}
                        style={{ 
                          backgroundColor: '#1a1a1a',
                          color: '#ffffff',
                          border: focusedField === 'confirmPassword' ? '2px solid #0071e3' : '1px solid rgba(255, 255, 255, 0.1)',
                          fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                          fontWeight: 400,
                          outline: 'none',
                          borderRadius: '8px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-base font-medium transition-all disabled:opacity-50 flex items-center justify-center space-x-2 hover:opacity-90"
                    style={{ 
                      backgroundColor: '#0071e3', 
                      color: '#ffffff',
                      fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                      borderRadius: '8px',
                      fontWeight: 600,
                      border: 'none'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isLoginMode ? 'Logging in...' : 'Creating account...'}</span>
                      </>
                    ) : (
                      <span>{isLoginMode ? 'Log In' : 'Create account'}</span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-sm hover:underline transition-all"
                    style={{ 
                      color: '#2997ff', 
                      fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontWeight: 400
                    }}
                  >
                    {isLoginMode ? "Don't have an account? Try now" : "Already have an account? Log In"}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Side - Hero Content */}
            <div className="order-1 lg:order-2">
              <div className="text-center lg:text-left">
                <h3 className="text-3xl lg:text-4xl font-semibold mb-4" style={{ 
                  color: '#ffffff', 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 600,
                  lineHeight: '1.10',
                  letterSpacing: '-0.28px'
                }}>
                  Secure. Smart. Simple.
                </h3>
                
                <p className="text-lg mb-8" style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.47',
                  letterSpacing: '-0.374px'
                }}>
                  Experience the future of secure communication with our AI-powered platform designed for modern teams. Real-time safety monitoring, enterprise-grade encryption, and intelligent insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Footer */}
      <EnhancedFooter />

      {/* Command Palette */}
      <OmniCommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        sources={[commandsSource, pagesSource]}
        storageKey="pulse:omni:recents"
        showRecents
        showPinnedFirst
        onItemExecuted={(item) => console.log('Executed:', item)}
      />
    </div>
  );
};

export default EnhancedLogin;
