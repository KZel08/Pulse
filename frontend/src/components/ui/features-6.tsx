import { Cpu, Lock, Sparkles, Zap, Shield, MessageSquare, Users } from 'lucide-react'

export function Features() {
    return (
        <section className="py-20 md:py-32 bg-black">
            <div className="mx-auto max-w-5xl space-y-16 px-6">
                {/* Hero Section */}
                <div className="relative z-10 grid items-center gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl md:text-5xl font-semibold text-white" style={{ 
                        fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: 600,
                        lineHeight: '1.07',
                        letterSpacing: '-0.28px'
                    }}>
                        The Pulse ecosystem brings together our advanced AI models
                    </h2>
                    <p className="max-w-sm sm:ml-auto text-gray-400" style={{ 
                        fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: 400,
                        lineHeight: '1.47',
                        letterSpacing: '-0.374px'
                    }}>
                        Empower your team with workflows that adapt to your needs, whether you prefer git synchronization or AI Agents interface.
                    </p>
                </div>
                
                {/* Hero Image */}
                <div className="relative rounded-3xl p-3 md:-mx-8">
                    <div className="aspect-[88/36] relative overflow-hidden rounded-2xl">
                        <div className="bg-gradient-to-t from-black/50 to-transparent absolute inset-0 z-10"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=2797&h=1137&fit=crop&auto=format" 
                            className="absolute inset-0 z-0 w-full h-full object-cover" 
                            alt="AI Security illustration" 
                            width={2797} 
                            height={1137} 
                        />
                    </div>
                </div>
                
                {/* Features Grid */}
                <div className="relative mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-medium text-white" style={{ 
                                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                                fontWeight: 600
                            }}>
                                Lightning Fast
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm" style={{ 
                            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                            lineHeight: '1.47'
                        }}>
                            Messages delivered in under 50ms with real-time synchronization across all devices.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                                <Cpu className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-medium text-white" style={{ 
                                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                                fontWeight: 600
                            }}>
                                AI Powered
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm" style={{ 
                            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                            lineHeight: '1.47'
                        }}>
                            Advanced AI safety monitoring with 12-node validation grid for secure communications.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-medium text-white" style={{ 
                                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                                fontWeight: 600
                            }}>
                                End-to-End Security
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm" style={{ 
                            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                            lineHeight: '1.47'
                        }}>
                            Military-grade encryption with zero-trust architecture and complete identity control.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-medium text-white" style={{ 
                                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                                fontWeight: 600
                            }}>
                                Ghost Mode
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm" style={{ 
                            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                            lineHeight: '1.47'
                        }}>
                            Complete privacy protection with identity masking and metadata hiding when needed.
                        </p>
                    </div>
                </div>
                
                {/* Additional Features */}
                <div className="relative mx-auto grid grid-cols-1 gap-8 pt-16 border-t border-gray-800">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-sm font-medium text-white" style={{ 
                                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                                    fontWeight: 600
                                }}>
                                    AI Safety Monitoring
                                </h3>
                            </div>
                            <p className="text-gray-400 text-sm" style={{ 
                                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                                lineHeight: '1.47'
                            }}>
                                Real-time content validation and protection with neural network validation ensuring secure communications.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-sm font-medium text-white" style={{ 
                                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                                    fontWeight: 600
                                }}>
                                    Smart Chat
                                </h3>
                            </div>
                            <p className="text-gray-400 text-sm" style={{ 
                                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                                lineHeight: '1.47'
                            }}>
                                Intelligent chat system with context awareness and automated response suggestions for better productivity.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-sm font-medium text-white" style={{ 
                                    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                                    fontWeight: 600
                                }}>
                                    Team Collaboration
                                </h3>
                            </div>
                            <p className="text-gray-400 text-sm" style={{ 
                                fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                                lineHeight: '1.47'
                            }}>
                                Seamless team collaboration with role-based permissions, shared workspaces, and real-time synchronization.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
