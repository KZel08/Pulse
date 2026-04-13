import React from 'react';
import { Shield, MessageSquare, Mail, Phone, MapPin, Github, Twitter, Linkedin, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';

export function EnhancedFooter() {
  const socialLinks = [
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' }
  ];

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Security', href: '#security' },
      { label: 'AI Safety', href: '#ai-safety' },
      { label: 'Ghost Mode', href: '#ghost-mode' },
      { label: 'API', href: '#api' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Press', href: '#press' },
      { label: 'Partners', href: '#partners' }
    ],
    resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'Help Center', href: '#help' },
      { label: 'Community', href: '#community' },
      { label: 'Status', href: '#status' },
      { label: 'Updates', href: '#updates' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'GDPR', href: '#gdpr' },
      { label: 'Security', href: '#security' }
    ]
  };

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Background Styling */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(147,51,234,0.05),transparent)]"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_800px_at_0%_800px,rgba(59,130,246,0.05),transparent)]"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Top Section */}
          <div className="grid lg:grid-cols-5 gap-12 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ 
                    color: '#ffffff', 
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 600
                  }}>
                    Pulse
                  </h3>
                  <p className="text-sm" style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    Next-Gen AI Communication
                  </p>
                </div>
              </div>
              
              <p className="text-base mb-8 max-w-md" style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                lineHeight: '1.5'
              }}>
                Experience secure, intelligent conversations with real-time AI safety monitoring and enterprise-grade encryption. Built for modern teams who value privacy and innovation.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium" style={{ 
                  color: 'rgba(255, 255, 255, 0.6)', 
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Connect with us:
                </span>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110"
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-sm transition-all hover:text-blue-400 flex items-center gap-1"
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                          }}
                        >
                          {link.label}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-t border-white/10 pt-12 mb-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2" style={{ 
                    color: '#ffffff', 
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    Email Support
                  </h4>
                  <p className="text-sm" style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    support@pulsechat.app
                  </p>
                  <p className="text-xs mt-1" style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    24/7 support available
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2" style={{ 
                    color: '#ffffff', 
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    Phone Support
                  </h4>
                  <p className="text-sm" style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    +1 (555) 123-4567
                  </p>
                  <p className="text-xs mt-1" style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    Mon-Fri, 9AM-6PM EST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2" style={{ 
                    color: '#ffffff', 
                    fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    Headquarters
                  </h4>
                  <p className="text-sm" style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    123 Tech Street, Suite 100
                  </p>
                  <p className="text-xs mt-1" style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Resources */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold mb-2" style={{ 
                  color: '#ffffff', 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Need Help?
                </h4>
                <p className="text-sm" style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Check out our comprehensive documentation and community resources
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 rounded-lg font-medium transition-all hover:bg-white/10" style={{ 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  View Documentation
                </button>
                <button className="px-6 py-3 rounded-lg font-medium transition-all hover:opacity-90" style={{ 
                  backgroundColor: '#0071e3',
                  color: '#ffffff',
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                  border: 'none'
                }}>
                  Get Support
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-sm" style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  © 2024 Pulse Chat. All rights reserved.
                </span>
              </div>
              
              <div className="flex items-center gap-6">
                <span className="text-xs" style={{ 
                  color: 'rgba(255, 255, 255, 0.6)', 
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Built with React 19, TypeScript, and lots of security
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs" style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    System Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
