import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

interface ThreadViewProps {
  rootMessageId: string;
  onClose: () => void;
}

const ThreadView: React.FC<ThreadViewProps> = ({ rootMessageId, onClose }) => {
  const { activeChat, messages, sendMessage, setReplyTo } = useChatStore();
  const { user, isGhostMode } = useAuthStore();
  const [replyText, setReplyText] = useState('');

  const rootMessage = messages[activeChat?.id || '']?.find(m => m.id === rootMessageId);
  const replies = messages[activeChat?.id || '']?.filter(m => m.replyToId === rootMessageId);

  const handleSendReply = () => {
    if (!replyText.trim() || !activeChat || !user) return;
    
    setReplyTo(rootMessage || null);
    sendMessage(activeChat.id, replyText, user.name);
    setReplyText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  if (!rootMessage) {
    return null;
  }

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-full w-80 bg-[#0f172a] border-l border-[#2a2a2a] flex flex-col shadow-2xl z-[600]"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
        <h3 className="text-sm font-medium text-white">Thread</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
        >
          <X size={16} className="text-[#8e8e93]" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Root Message */}
        <div className="bg-[#1a1a1a] rounded-lg p-3">
          <p className="text-[10px] text-indigo-400 font-medium mb-1">
            {rootMessage.senderName}
          </p>
          <p className="text-sm text-[#ccc] mb-2">
            {rootMessage.content}
          </p>
          <p className="text-[9px] text-[#555]">
            {rootMessage.timestamp}
          </p>
        </div>

        {/* Replies */}
        {replies.map((reply) => (
          <div key={reply.id} className="bg-[#111] rounded-lg p-3 ml-4 border-l-2 border-indigo-500/30">
            <p className="text-[10px] text-indigo-400 font-medium mb-1">
              {reply.senderName}
            </p>
            <p className="text-sm text-[#ccc] mb-2">
              {reply.content}
            </p>
            <p className="text-[9px] text-[#555]">
              {reply.timestamp}
            </p>
          </div>
        ))}

        {replies.length === 0 && (
          <p className="text-xs text-[#555] text-center py-8">
            No replies yet. Be the first to reply!
          </p>
        )}
      </div>

      {/* Reply Input */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <div className="flex gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Reply in thread..."
            rows={2}
            className="flex-1 bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-white placeholder-[#555] resize-none outline-none focus:border-indigo-500/50"
            disabled={isGhostMode}
          />
          <button
            onClick={handleSendReply}
            disabled={!replyText.trim() || isGhostMode}
            className="px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreadView;
