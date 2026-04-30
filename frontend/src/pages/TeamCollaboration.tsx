import React from 'react';
import { ArrowLeft, Users, Upload, Palette, MessageSquare, AtSign, Edit, Pin, Star, Forward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SplineScene } from '@/components/ui/splite';
import { Card } from '@/components/ui/card';
import { SpotlightAceternity } from '@/components/ui/spotlight-aceternity';
import { cn } from '@/lib/utils';
import { Header } from '@/components/ui/LandingHeader';

interface TeamCollaborationPageProps {}

const TeamCollaboration: React.FC<TeamCollaborationPageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
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

          {/* Hero Section */}
          <div className="mb-16">
            <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
              <SpotlightAceternity
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
              />
              
              <div className="flex h-full">
                {/* Left content */}
                <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                  <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    Team Collaboration
                  </h1>
                  <p className="mt-4 text-neutral-300 max-w-lg">
                    Powerful tools for productive team communication and seamless collaboration.
                  </p>
                </div>

                {/* Right content */}
                <div className="flex-1 relative">
                  <SplineScene 
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Collaboration Features Grid */}
          <div className="grid gap-8 mb-16">
            {/* Group Chats */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary dark:text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Group Chats</h2>
                  <p className="text-muted-foreground mb-4">
                    Create topic-based group conversations, assign admins, and manage members dynamically. 
                    Perfect for project teams, departments, or cross-functional collaboration.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Unlimited group creation</li>
                    <li>• Admin and member roles</li>
                    <li>• Dynamic member management</li>
                    <li>• Topic-based organization</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* File Sharing */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">File Sharing</h2>
                  <p className="text-muted-foreground mb-4">
                    Drag-and-drop file upload with preview before send, caption support, and shared media gallery per conversation. 
                    Share documents, images, and media securely with your team.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Drag-and-drop file upload</li>
                    <li>• File preview before sending</li>
                    <li>• Caption and metadata support</li>
                    <li>• Per-conversation media gallery</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Per-Chat Themes */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-6 h-6 text-primary dark:text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Per-Chat Themes</h2>
                  <p className="text-muted-foreground mb-4">
                    Each conversation can have a custom colour theme, making context-switching between projects visually distinct. 
                    Personalize your workspace for better organization and focus.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Custom color themes per chat</li>
                    <li>• Visual context differentiation</li>
                    <li>• Light and dark mode variants</li>
                    <li>• Theme synchronization across devices</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Message Actions */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Message Actions</h2>
                  <p className="text-muted-foreground mb-4">
                    Reply-to-thread, edit, pin, star, forward, and react with emoji — all available per message. 
                    Complete control over your conversations with intuitive message management.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                      Edit messages
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Pin className="w-4 h-4 text-muted-foreground" />
                      Pin important
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      Star messages
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Forward className="w-4 h-4 text-muted-foreground" />
                      Forward content
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      Thread replies
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">😊</span>
                      Emoji reactions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentions & Notifications */}
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <AtSign className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Mentions & Notifications</h2>
                  <p className="text-muted-foreground mb-4">
                    @mention any team member to trigger a priority notification regardless of their current notification settings. 
                    Ensure important messages get the attention they deserve.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Priority @mention notifications</li>
                    <li>• Bypass notification settings</li>
                    <li>• Mention history tracking</li>
                    <li>• Custom notification rules</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-6">Why Teams Choose Pulse</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Unlimited</div>
                <div className="text-sm text-muted-foreground">Group Chats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">10GB</div>
                <div className="text-sm text-muted-foreground">File Storage Per User</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Real-time</div>
                <div className="text-sm text-muted-foreground">Collaboration</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamCollaboration;