import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Download, Share2, Eye, MessageSquare, Shield, Zap } from 'lucide-react';

export function VideoDemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    {
      id: 1,
      title: 'Getting Started with Pulse',
      description: 'Learn the basics of Pulse Chat - from setting up your account to your first secure conversation.',
      thumbnail: 'https://picsum.photos/seed/pulse-demo-1/800/450',
      duration: '3:45',
      category: 'Getting Started'
    },
    {
      id: 2,
      title: 'Ghost Mode Privacy Features',
      description: 'Discover how Ghost Mode protects your identity and provides enhanced anonymity in conversations.',
      thumbnail: 'https://picsum.photos/seed/pulse-demo-2/800/450',
      duration: '5:12',
      category: 'Privacy'
    },
    {
      id: 3,
      title: 'AI Safety Monitoring',
      description: 'See how our 12-node AI grid keeps your conversations safe with real-time threat detection.',
      thumbnail: 'https://picsum.photos/seed/pulse-demo-3/800/450',
      duration: '4:30',
      category: 'Security'
    },
    {
      id: 4,
      title: 'Advanced Features & Productivity',
      description: 'Master keyboard shortcuts, command palette, and productivity features for power users.',
      thumbnail: 'https://picsum.photos/seed/pulse-demo-4/800/450',
      duration: '6:15',
      category: 'Features'
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'End-to-End Encryption',
      description: 'Military-grade encryption for all your messages'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Ghost Mode',
      description: 'Complete anonymity when you need it most'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI Safety',
      description: 'Real-time threat detection and content monitoring'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Rich Messaging',
      description: 'Files, reactions, voice notes, and more'
    }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideo(index);
    setIsPlaying(false);
  };

  return (
    <section className="py-20 px-6 lg:px-8 relative" style={{ backgroundColor: '#000000' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,rgba(0,113,227,0.05),transparent)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-semibold mb-6" style={{ 
            color: '#ffffff', 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600,
            lineHeight: '1.07',
            letterSpacing: '-0.28px'
          }}>
            See Pulse in Action
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
            lineHeight: '1.47',
            letterSpacing: '-0.374px'
          }}>
            Watch our demos to discover how Pulse Chat revolutionizes secure communication
          </p>
        </div>

        {/* Main Video Player */}
        <div className="mb-16">
          <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a]">
            {/* Video Thumbnail/Player */}
            <div className="relative aspect-video">
              <img 
                src={videos[currentVideo].thumbnail} 
                alt={videos[currentVideo].title}
                className="w-full h-full object-cover"
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-2" style={{ 
                        fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
                      }}>
                        {videos[currentVideo].title}
                      </h3>
                      <p className="text-gray-300" style={{ 
                        fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                      }}>
                        {videos[currentVideo].description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handlePlayPause}
                        className="w-16 h-16 rounded-full bg-[#0071e3] hover:bg-[#0051cc] transition-colors flex items-center justify-center text-white"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm font-mono">0:00</span>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-[#0071e3] rounded-full"></div>
                    </div>
                    <span className="text-white text-sm font-mono">{videos[currentVideo].duration}</span>
                  </div>
                </div>
              </div>
              
              {/* Top Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Playlist */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-center" style={{ 
            color: '#ffffff', 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            More Demo Videos
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => handleVideoSelect(index)}
                className={`relative rounded-xl overflow-hidden border transition-all hover:scale-105 ${
                  currentVideo === index 
                    ? 'border-[#0071e3] shadow-lg shadow-[#0071e3]/20' 
                    : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                }`}
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-semibold text-sm mb-1" style={{ 
                      fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-xs">{video.category}</span>
                      <span className="text-gray-300 text-xs font-mono">{video.duration}</span>
                    </div>
                  </div>
                </div>
                {currentVideo === index && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0071e3]"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-center" style={{ 
            color: '#ffffff', 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            Key Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
                  {feature.icon}
                </div>
                <h4 className="text-white font-semibold text-lg mb-2" style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  {feature.title}
                </h4>
                <p className="text-gray-400 text-sm" style={{ 
                  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4">
            <button className="px-8 py-4 rounded-full bg-[#0071e3] hover:bg-[#0051cc] transition-colors text-white font-semibold flex items-center gap-2" style={{ 
              fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              <Play className="w-5 h-5" />
              Start Free Trial
            </button>
            <button className="px-8 py-4 rounded-full border border-[#2a2a2a] text-white font-semibold hover:bg-[#1a1a1a] transition-colors flex items-center gap-2" style={{ 
              fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              <Download className="w-5 h-5" />
              Download Demo
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4" style={{ 
            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            No credit card required · Free forever for personal use
          </p>
        </div>
      </div>
    </section>
  );
}
