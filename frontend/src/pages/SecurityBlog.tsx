import React from 'react';
import { ArrowLeft, Calendar, User, Shield, Lock, Eye, Wifi, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/LandingHeader';

interface SecurityBlogPageProps {}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  icon: React.ReactNode;
}

const SecurityBlog: React.FC<SecurityBlogPageProps> = () => {
  const navigate = useNavigate();

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "How Pulse Implements Zero-Knowledge Encryption",
      excerpt: "Deep dive into Pulse's zero-knowledge architecture and how we ensure complete message privacy while maintaining functionality.",
      date: "March 15, 2024",
      author: "Sarah Chen",
      icon: <Lock className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Ghost Mode: How Anonymous Messaging Actually Works",
      excerpt: "Technical breakdown of Pulse's Ghost Mode feature and the methods used to protect user identity and metadata.",
      date: "March 8, 2024",
      author: "Alex Rodriguez",
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 3,
      title: "AI Safety Monitoring Without Compromising Privacy",
      excerpt: "Exploring how Pulse's AI safety layer detects threats while maintaining complete message confidentiality.",
      date: "February 28, 2024",
      author: "Dr. Emily Watson",
      icon: <Eye className="w-5 h-5" />
    },
    {
      id: 4,
      title: "Enterprise Compliance with Pulse Audit Logs",
      excerpt: "How Pulse's immutable audit trails help organizations meet regulatory requirements while maintaining security.",
      date: "February 20, 2024",
      author: "Michael Park",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 5,
      title: "WebSocket Security: Preventing Man-in-the-Middle Attacks",
      excerpt: "Technical overview of Pulse's WebSocket security measures and protection against common attack vectors.",
      date: "February 12, 2024",
      author: "David Kim",
      icon: <Wifi className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Back Navigation */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* ContainerScroll Hero */}
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold text-black dark:text-white">
                  Pulse <br />
                  <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                    Security Blog
                  </span>
                </h1>
              </>
            }
          >
            <div className="w-full h-full bg-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
              <div className="space-y-4 text-white text-center w-full">
                <div className="border-b border-zinc-700 pb-4">
                  <div className="text-xl font-bold text-blue-400">How Pulse Implements Zero-Knowledge Encryption</div>
                  <div className="text-sm text-zinc-400">March 15, 2024</div>
                </div>
                <div className="border-b border-zinc-700 pb-4">
                  <div className="text-xl font-bold text-primary">Ghost Mode: How Anonymous Messaging Actually Works</div>
                  <div className="text-sm text-zinc-400">March 8, 2024</div>
                </div>
                <div className="pb-4">
                  <div className="text-xl font-bold text-primary">AI Safety Monitoring Without Compromising Privacy</div>
                  <div className="text-sm text-zinc-400">February 28, 2024</div>
                </div>
              </div>
            </div>
          </ContainerScroll>

          {/* Blog Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-16">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    {post.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  Read More
                </Button>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="bg-card rounded-lg border p-8 mt-16">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Stay Updated on Security</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get the latest security insights, threat intelligence, and Pulse updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border rounded-md bg-background"
                />
                <Button className="px-6">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8">Security Topics</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-card rounded-lg border p-4 text-center">
                <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium mb-1">Encryption</h3>
                <p className="text-sm text-muted-foreground">AES-256, Zero-Knowledge</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium mb-1">Privacy</h3>
                <p className="text-sm text-muted-foreground">Ghost Mode, Anonymity</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium mb-1">AI Safety</h3>
                <p className="text-sm text-muted-foreground">Monitoring, Detection</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <Wifi className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Network Security</h3>
                <p className="text-sm text-muted-foreground">WebSocket, TLS</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityBlog;