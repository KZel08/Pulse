import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Send, X } from 'lucide-react';

interface VoiceMessagePlayerProps {
  isRecording?: boolean;        // shows recorder UI
  duration?: number;            // seconds, for playback (from ChatWindow)
  audioUrl?: string;            // actual audio URL for playback
  onSend?: (audioBlob: Blob, audioBase64: string) => void;
  onCancel?: () => void;
}

const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({ 
  isRecording = false, 
  duration = 0, 
  audioUrl,
  onSend, 
  onCancel 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-start recording when isRecording prop changes
  useEffect(() => {
    if (isRecording && !isRecordingActive) {
      startRecording();
    } else if (!isRecording && isRecordingActive) {
      stopRecording();
    }
    return () => {
      // Cleanup recording on unmount
      if (mediaRecorderRef.current && isRecordingActive) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  // Cleanup on unmount — ensures mic is ALWAYS released
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Start recording
  const startRecording = async () => {
    if (isRecordingActive) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // Save to localStorage for offline persistence
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          const key = `pulse_voice_${Date.now()}`;
          try { localStorage.setItem(key, base64); } catch {}
          // Pass blob AND base64 url back up
          onSend?.(blob, base64);
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecordingActive(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecordingActive) {
      mediaRecorderRef.current.stop();
    }
    // ALWAYS stop all tracks — this closes mic and removes browser tab indicator
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecordingActive(false);
  };

  // Update handleSend to just call stopRecording (onSend fires from onstop)
  const handleSend = () => {
    stopRecording(); // onstop callback will fire onSend automatically
  };

  // Recording mode - minimal UI
  if (isRecording) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1e293b] rounded-2xl border border-red-500/20">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
        <span className="text-red-300 text-xs font-mono tabular-nums">
          {Math.floor(duration / 60).toString().padStart(2, '0')}:{(duration % 60).toString().padStart(2, '0')}
        </span>
        <button onClick={() => { stopRecording(); onCancel?.(); }}
          className="p-1 rounded-lg hover:bg-red-500/20 transition-colors ml-1">
          <X size={14} className="text-red-400" />
        </button>
        <button onClick={handleSend}
          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 text-xs">
          <Send size={12} /> Send
        </button>
      </div>
    );
  }

  // Playback mode
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isPlaying && duration > 0) {
      interval = setInterval(() => {
        setPlayhead(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / (duration * 10)); // Increment every 100ms
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayhead(Number(e.target.value));
  };

  // Generate fake waveform bars
  const waveformBars = Array.from({ length: 30 }, (_, i) => {
    const seed = duration * 1000 + i; // Seeded from duration
    const height = Math.sin(seed * 0.1) * 20 + 25; // Pseudo-random but stable
    const opacity = 0.3 + (Math.sin(seed * 0.05) + 1) * 0.35;
    
    return (
      <rect
        key={i}
        x={i * 3}
        y={30 - height / 2}
        width="2"
        height={height}
        fill="#6366f1"
        opacity={opacity}
      />
    );
  });

  // Progress overlay bars
  const progressBars = Array.from({ length: 30 }, (_, i) => {
    const barPosition = (i / 30) * 100;
    const isVisible = barPosition <= playhead;
    
    if (!isVisible) return null;
    
    const seed = duration * 1000 + i;
    const height = Math.sin(seed * 0.1) * 20 + 25;
    
    return (
      <rect
        key={i}
        x={i * 3}
        y={30 - height / 2}
        width="2"
        height={height}
        fill="#818cf8"
      />
    );
  });

  return (
    <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => {
          if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setPlayhead(progress);
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        onClick={() => {
          if (audioRef.current) {
            if (isPlaying) {
              audioRef.current.pause();
            } else {
              audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
          }
        }}
        className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center"
      >
        {isPlaying ? (
          <Pause size={16} className="text-white" />
        ) : (
          <Play size={16} className="text-white" />
        )}
      </button>

      {/* Waveform */}
      <div className="flex-1">
        <svg width="90" height="60" className="overflow-visible">
          {/* Background waveform */}
          <g>{waveformBars}</g>
          {/* Progress overlay */}
          <g clipPath="url(#waveform-clip)">
            {progressBars}
          </g>
          <defs>
            <clipPath id="waveform-clip">
              <rect x="0" y="0" width={playhead + '%'} height="60" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Scrubber - Super thin */}
      <input
        type="range"
        min="0"
        max="100"
        value={playhead}
        onChange={(e) => {
          const value = Number(e.target.value);
          setPlayhead(value);
          if (audioRef.current) {
            audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
          }
        }}
        className="accent-indigo-500"
        style={{ 
          width: '1.5rem', 
          height: '1px',
          appearance: 'none',
          background: 'transparent',
          cursor: 'pointer',
          outline: 'none'
        }}
      />

      {/* Duration */}
      <span className="text-[10px] text-[#555] min-w-[40px] text-right">
        {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default VoiceMessagePlayer;
