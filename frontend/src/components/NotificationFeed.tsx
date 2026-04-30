import React from 'react';
import { motion } from 'framer-motion';
import { Bell, X, AtSign, Heart } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

interface NotificationFeedProps {
  onClose: () => void;
}

const NotificationFeed: React.FC<NotificationFeedProps> = ({ onClose }) => {
  const { 
    notificationHistory, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useChatStore();

  const unreadCount = notificationHistory.filter(n => !n.isRead).length;

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mention':
        return <AtSign size={20} className="text-indigo-400" />;
      case 'reaction':
        return <Heart size={20} className="text-pink-400" />;
      case 'system':
      default:
        return <Bell size={20} className="text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-80 bg-[#0f172a] border-l border-[#2a2a2a] z-[700] flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-[#8e8e93]" />
          <h3 className="text-sm font-medium text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[9px] rounded-full px-1.5 py-0.5">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
          >
            <X size={16} className="text-[#8e8e93]" />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {notificationHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16">
            <Bell size={48} className="text-[#555] mb-4" />
            <p className="text-[#555]">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#2a2a2a]">
            {notificationHistory.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-indigo-500/5' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#ccc] font-medium mb-1">
                      {notification.fromName}
                    </p>
                    <p className="text-[10px] text-[#555] truncate mb-1">
                      {notification.preview}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-[#555]">
                      <span>{notification.chatName}</span>
                      <span>•</span>
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationFeed;
