import React from 'react';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

interface BlogPageProps {}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  tags: string[];
}

const Blog: React.FC<BlogPageProps> = () => {
  const navigate = useNavigate();

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Future of AI Safety in Enterprise Messaging",
      excerpt: "Explore how artificial intelligence is revolutionizing content moderation and safety monitoring in workplace communication platforms, ensuring secure and compliant messaging environments.",
      date: "2024-01-15",
      author: "Sarah Chen",
      category: "AI Safety",
      readTime: "5 min read",
      tags: ["AI", "Safety", "Enterprise", "Compliance"]
    },
    {
      id: 2,
      title: "Ghost Mode: Redefining Privacy in Digital Communication",
      excerpt: "Learn how Ghost Mode technology is enabling truly private conversations in an increasingly connected world, balancing anonymity with security requirements.",
      date: "2024-01-10",
      author: "Michael Rodriguez",
      category: "Privacy",
      readTime: "4 min read",
      tags: ["Privacy", "Ghost Mode", "Security", "Anonymity"]
    },
    {
      id: 3,
      title: "Enterprise Chat Compliance: Navigating Regulatory Requirements",
      excerpt: "A comprehensive guide to maintaining compliance in enterprise communications, from HIPAA to GDPR, and how modern platforms automate these requirements.",
      date: "2024-01-05",
      author: "Emily Watson",
      category: "Compliance",
      readTime: "7 min read",
      tags: ["Compliance", "Enterprise", "Regulation", "Security"]
    },
    {
      id: 4,
      title: "Real-Time Encryption: The Technology Behind Secure Messaging",
      excerpt: "Deep dive into the cryptographic principles and implementation strategies that power real-time encrypted messaging systems in modern communication platforms.",
      date: "2023-12-28",
      author: "David Kim",
      category: "Technology",
      readTime: "6 min read",
      tags: ["Encryption", "Security", "Technology", "Real-time"]
    }
  ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/landing')}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Landing
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Pulse Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights, updates, and thought leadership on secure communication, AI safety, and the future of workplace collaboration
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  Featured
                </span>
                <span className="text-sm text-muted-foreground">
                  {featuredPost.category}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{featuredPost.readTime}</span>
                  </div>
                </div>
                <Button variant="outline">
                  Read More
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {featuredPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full flex items-center space-x-1"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {regularPosts.map((post) => (
            <article
              key={post.id}
              className={cn(
                "bg-card border border-border rounded-xl p-6 shadow-sm",
                "hover:shadow-md transition-shadow duration-200"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-muted text-muted-foreground text-sm font-medium rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-muted-foreground">{post.readTime}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                Read More
              </Button>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-muted/50 rounded-xl p-8 text-center mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest insights on secure communication, AI safety, and workplace collaboration delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button>Subscribe</Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['AI Safety', 'Privacy', 'Compliance', 'Technology', 'Security', 'Enterprise', 'Innovation', 'Best Practices'].map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center space-y-2"
              >
                <span className="font-medium">{category}</span>
                <span className="text-xs text-muted-foreground">
                  {Math.floor(Math.random() * 20) + 5} articles
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Popular Tags */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Popular Topics
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {['AI Safety', 'Ghost Mode', 'Enterprise', 'Encryption', 'Compliance', 'Real-time', 'Security', 'Privacy', 'Innovation', 'Best Practices'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-muted text-muted-foreground text-sm rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;