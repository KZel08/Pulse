import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, CheckCircle, AlertTriangle, Activity, X, MessageSquare, VolumeX, UserPlus, Download, SortAsc, Shield, PenLine, Ban, Archive, Star, MoreVertical, Trash2 } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import CreateGroupModal from './CreateGroupModal';

const ONLINE_IDS = ['1'];

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const {
    chats, setActiveChat, activeChat, searchTerm, setSearchTerm,
    activeFilter, setFilter, messages, mutedChats, availableUsers,
    addDirectChat, typingChats, // F9/F18
    // Contact management functions
    blockContact, unblockContact, archiveChat, unarchiveChat,
    starContact, unstarContact, deleteChat
  } = useChatStore();
  const { isGhostMode } = useAuthStore();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNewDM, setShowNewDM] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');
  const [dmSearch, setDmSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'unread'>('recent');
  
  // Contact management state
  const [showContactMenu, setShowContactMenu] = useState<string | null>(null);

  const getUnreadCount = (chatId: string) => {
    const chatMessages = messages[chatId] || [];
    return chatMessages.filter(m => m.senderId !== 'me' && !m.isDeleted && !m.isAIValidated).length;
  };

  const getLastMessage = (chatId: string) => {
    const chatMessages = messages[chatId] || [];
    if (chatMessages.length === 0) return null;
    const last = chatMessages[chatMessages.length - 1];
    if (last.isDeleted) return 'Message deleted';
    if (last.file) return `📎 ${last.file.name}`;
    return last.content?.slice(0, 35) + (last.content && last.content.length > 35 ? '...' : '');
  };

  const isOnline = (chatId: string) => ONLINE_IDS.includes(chatId);

  let filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Verified' && chat.status === 'Verified') ||
      (activeFilter === 'Flagged' && chat.status === 'Flagged');
    return matchesSearch && matchesFilter;
  });

  if (sortBy === 'unread') {
    filteredChats = [...filteredChats].sort((a, b) => getUnreadCount(b.id) - getUnreadCount(a.id));
  }

  const globalResults = globalQuery.trim().length > 1
    ? Object.entries(messages).flatMap(([chatId, msgs]) =>
        msgs.filter(m => !m.isDeleted && m.content?.toLowerCase().includes(globalQuery.toLowerCase()))
          .map(m => ({ ...m, chatId }))
      ).slice(0, 15)
    : [];

  const totalMessages = Object.values(messages).reduce((acc, msgs) => acc + msgs.filter(m => !m.isDeleted).length, 0);

  const handleExportChat = (chatId: string, chatName: string) => {
    const msgs = messages[chatId] || [];
    const text = msgs.filter(m => !m.isDeleted).map(m => `[${m.timestamp}] ${m.senderName}: ${m.content}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${chatName}-chat.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === '/') { e.preventDefault(); setShowSearch(true); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') { e.preventDefault(); setShowCreateGroup(true); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); setShowNewDM(true); }
    if (e.key === 'Escape') { setShowSearch(false); setGlobalQuery(''); setShowNewDM(false); }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showContactMenu) {
        const target = event.target as Element;
        const isClickInsideDropdown = target.closest('.contact-dropdown');
        const isClickOnMenuButton = target.closest('.contact-menu-button');
        
        if (!isClickInsideDropdown && !isClickOnMenuButton) {
          setShowContactMenu(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showContactMenu]);

  // ── Collapsed icon-only sidebar ────────────────────────────────────────────
  if (collapsed) {
    return (
      <aside className={`w-16 border-r flex flex-col items-center py-4 gap-3 transition-all duration-300 ${
        isGhostMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-[#1a1a1a] border-[#2a2a2a]'
      }`}>
        <div className="w-8 h-8 rounded-xl bg-[#2a2a2a] border border-[#333] flex items-center justify-center">
          <Shield size={14} className="text-[#8e8e93]" />
        </div>
        <div className="flex-1 flex flex-col gap-2 w-full px-2 mt-2">
          {filteredChats.map(chat => {
            const unread = getUnreadCount(chat.id);
            const isTyping = typingChats.includes(chat.id); // F9
            return (
              <button key={chat.id} onClick={() => setActiveChat(chat)}
                className={`w-full h-10 rounded-xl flex items-center justify-center font-semibold text-sm relative transition-all border ${
                  activeChat?.id === chat.id
                    ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white'
                    : 'bg-transparent border-transparent text-[#555] hover:bg-[#2a2a2a] hover:text-white hover:border-[#2a2a2a]'
                }`}
              >
                {isTyping ? <PenLine size={12} className="text-indigo-400 animate-pulse" /> : chat.name[0].toUpperCase()}
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  // ── Full sidebar ───────────────────────────────────────────────────────────
  return (
    <aside className={`w-80 border-r flex flex-col h-full transition-all duration-300 ${
      isGhostMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-[#1a1a1a] border-[#2a2a2a]'
    }`}>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}

      {/* New DM Modal */}
      {showNewDM && (
        <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-6">
          <div className="w-full max-w-md rounded-2xl border border-[#2a2a2a] shadow-2xl overflow-hidden bg-[#1a1a1a]">
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
              <h3 className="text-white font-semibold text-sm">New Direct Message</h3>
              <button onClick={() => setShowNewDM(false)} className="text-[#8e8e93] hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 bg-[#2a2a2a] rounded-xl px-3 py-2.5 mb-3 border border-[#333]">
                <Search size={14} className="text-[#8e8e93]" />
                <input autoFocus value={dmSearch} onChange={e => setDmSearch(e.target.value)}
                  placeholder="Search users..."
                  className="bg-transparent text-white outline-none text-sm flex-1 placeholder-[#555]"
                />
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                {availableUsers.filter(u => u.name.toLowerCase().includes(dmSearch.toLowerCase())).map(u => (
                  <button key={u.id}
                    onClick={() => { addDirectChat(u.name); setShowNewDM(false); setDmSearch(''); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center font-semibold text-white text-sm">
                      {u.name[0]}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white font-medium text-sm">{u.name}</p>
                      <p className="text-[#8e8e93] text-[10px]">{u.email}</p>
                    </div>
                    <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${
                      u.signal === 'Strong' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                      u.signal === 'Weak' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                      'text-red-400 border-red-500/30 bg-red-500/10'
                    }`}>{u.signal}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-6">
          <div className="w-full max-w-lg rounded-2xl border border-[#2a2a2a] shadow-2xl overflow-hidden bg-[#1a1a1a]">
            <div className="flex items-center gap-3 p-4 border-b border-[#2a2a2a]">
              <Search size={16} className="text-[#8e8e93] shrink-0" />
              <input autoFocus type="text" value={globalQuery} onChange={(e) => setGlobalQuery(e.target.value)}
                placeholder="Search all messages..."
                className="flex-1 bg-transparent text-white outline-none placeholder-[#555] text-sm"
              />
              <button onClick={() => { setShowSearch(false); setGlobalQuery(''); }} className="text-[#8e8e93] hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {globalQuery.length > 1 && globalResults.length === 0 && (
                <p className="text-[#555] text-sm text-center py-8">No results found</p>
              )}
              {globalQuery.length <= 1 && (
                <p className="text-[#333] text-xs text-center py-8 uppercase tracking-widest">Type to search messages</p>
              )}
              {globalResults.map((msg) => {
                const chat = chats.find(c => c.id === msg.chatId);
                const idx = msg.content?.toLowerCase().indexOf(globalQuery.toLowerCase()) ?? -1;
                const highlighted = idx >= 0 && msg.content
                  ? <>{msg.content.slice(0, idx)}<mark className="bg-indigo-500/30 text-white rounded px-0.5">{msg.content.slice(idx, idx + globalQuery.length)}</mark>{msg.content.slice(idx + globalQuery.length)}</>
                  : msg.content;
                return (
                  <div key={msg.id}
                    onClick={() => {
                      if (chat) {
                        setActiveChat(chat);
                        setShowSearch(false);
                        setGlobalQuery('');
                        // F10: dispatch event so ChatWindow can scroll to this message
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('pulse:scrollToMsg', { detail: { msgId: msg.id } }));
                        }, 200);
                      }
                    }}
                    className="px-4 py-3 hover:bg-[#2a2a2a] cursor-pointer border-b border-[#2a2a2a] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-medium uppercase tracking-widest text-[#8e8e93]">{chat?.name || 'Unknown'}</span>
                      <span className="text-[9px] text-[#555]">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-white truncate">{highlighted}</p>
                    <p className="text-[9px] text-[#555] mt-0.5">by {msg.senderName}</p>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 border-t border-[#2a2a2a] flex gap-4">
              <span className="text-[9px] text-[#555] uppercase tracking-widest">
                <kbd className="bg-[#2a2a2a] px-1.5 py-0.5 rounded text-[#8e8e93]">Esc</kbd> close
              </span>
              <span className="text-[9px] text-[#555] uppercase tracking-widest">
                <kbd className="bg-[#2a2a2a] px-1.5 py-0.5 rounded text-[#8e8e93]">↵</kbd> open chat
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1 px-3 pt-3 pb-2">
        <button onClick={() => setShowSearch(true)}
          className="p-2 rounded-xl text-[#8e8e93] hover:text-white hover:bg-[#2a2a2a] transition-all border border-transparent hover:border-[#2a2a2a]"
          title="Search (/)"
        >
          <Search size={15} />
        </button>
        <button onClick={() => setShowNewDM(true)}
          className="p-2 rounded-xl text-[#8e8e93] hover:text-white hover:bg-[#2a2a2a] transition-all border border-transparent hover:border-[#2a2a2a]"
          title="New DM (Ctrl+D)"
        >
          <UserPlus size={15} />
        </button>
        <button onClick={() => setShowCreateGroup(true)}
          className="p-2 rounded-xl text-[#8e8e93] hover:text-white hover:bg-[#2a2a2a] transition-all border border-transparent hover:border-[#2a2a2a]"
          title="New group (Ctrl+G)"
        >
          <Plus size={16} />
        </button>
        <button onClick={() => setSortBy(s => s === 'recent' ? 'unread' : 'recent')}
          className={`ml-auto p-2 rounded-xl border text-[9px] font-medium uppercase transition-all ${
            sortBy === 'unread' ? 'bg-[#2a2a2a] border-[#3a3a3a] text-white' : 'border-transparent text-[#555] hover:text-[#8e8e93] hover:bg-[#2a2a2a] hover:border-[#2a2a2a]'
          }`}
          title={sortBy === 'recent' ? 'Sort by unread' : 'Sort by recent'}
        >
          <SortAsc size={14} />
        </button>
      </div>

      {/* Search input */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 bg-[#2a2a2a] border border-[#333] rounded-xl px-3 py-2 focus-within:border-[#444] transition-colors">
          <Search size={13} className="text-[#555] shrink-0" />
          <input type="text" placeholder="Search chats..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm text-white w-full outline-none placeholder-[#555]"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-3 pb-3">
        {['All', 'Verified', 'Flagged'].map((f) => (
          <button key={f} onClick={() => setFilter(f as any)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-widest transition-all ${
              activeFilter === f ? 'bg-[#2a2a2a] text-white border border-[#3a3a3a]' : 'text-[#555] hover:text-[#8e8e93] hover:bg-[#2a2a2a]/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar space-y-0.5">

        {/* F6: Sidebar empty state */}
        {filteredChats.length === 0 && searchTerm === '' && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2a2a2a] border border-[#333] flex items-center justify-center">
              <MessageSquare size={22} className="text-[#555]" />
            </div>
            <p className="text-[#555] text-xs font-medium uppercase tracking-widest">No conversations yet</p>
            <p className="text-[#333] text-[10px] leading-relaxed">Click <span className="text-[#555]">+</span> to create a group or <span className="text-[#555]">👤</span> for a direct message</p>
            <button onClick={() => setShowNewDM(true)}
              className="mt-1 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-medium hover:bg-indigo-600/30 transition-colors"
            >
              Start a chat
            </button>
          </div>
        )}

        {filteredChats.length === 0 && searchTerm !== '' && (
          <p className="text-[#333] text-xs text-center py-8 uppercase tracking-widest">No chats found</p>
        )}

        {filteredChats.map((chat) => {
          const unread = getUnreadCount(chat.id);
          const lastMsg = getLastMessage(chat.id);
          const online = isOnline(chat.id);
          const muted = mutedChats.includes(chat.id);
          const isActive = activeChat?.id === chat.id;
          const isTyping = typingChats.includes(chat.id); // F9/F18
          const isBlocked = chat.isBlocked;
          const isArchived = chat.isArchived;
          const isStarred = chat.isStarred;

          return (
            <div key={chat.id} className="relative group">
              <div 
                onClick={() => !isBlocked && setActiveChat(chat)}
                className={`px-3 py-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
                  isActive ? 'bg-[#2a2a2a] border border-[#3a3a3a]' : 
                  isBlocked ? 'bg-red-900/20 border-red-800/30 opacity-60' :
                  isArchived ? 'bg-amber-900/20 border-amber-800/30 opacity-60' :
                  'border border-transparent hover:bg-[#212121]'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-white ${
                    isActive ? 'bg-[#3a3a3a]' : isBlocked ? 'bg-red-600' : isArchived ? 'bg-amber-600' : 'bg-[#2a2a2a]'
                  } border border-[#333]`}>
                    {isBlocked ? <Ban size={14} /> : chat.name[0].toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1a1a1a] ${
                    online ? 'bg-emerald-500' : 'bg-[#333]'
                  }`} />
                  {isStarred && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star size={8} className="text-white" />
                    </div>
                  )}
                  {isBlocked && (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <Ban size={8} className="text-white" />
                    </div>
                  )}
                  {isArchived && (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                      <Archive size={8} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className={`font-medium text-sm truncate ${
                        isActive ? 'text-white' : isBlocked ? 'text-red-400' : isArchived ? 'text-amber-400' : 'text-[#ccc]'
                      }`}>
                        {chat.name}
                      </span>
                      {muted && <VolumeX size={9} className="text-amber-400 shrink-0" />}
                      {isBlocked && <Ban size={9} className="text-red-400 shrink-0 ml-1" />}
                      {isArchived && <Archive size={9} className="text-amber-400 shrink-0 ml-1" />}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {chat.latency && (
                        <span className={`text-[9px] font-medium px-1 py-0.5 rounded ${
                          chat.latency > 100 ? 'text-amber-500' : 'text-[#555]'
                        }`}>
                          {chat.latency}ms
                        </span>
                      )}
                      {unread > 0 && !muted && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-white text-black min-w-[18px] text-center">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* F9/F18: show typing indicator in sidebar */}
                  {isTyping ? (
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '100ms' }} />
                      <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '200ms' }} />
                      <span className="text-[9px] text-indigo-400 ml-1">typing...</span>
                    </div>
                  ) : (
                    <p className="text-xs text-[#555] truncate">
                      {lastMsg || (
                        <span className="flex items-center gap-1">
                          {chat.status === 'Verified'
                            ? <><CheckCircle size={9} className="text-emerald-500" /> Verified</>
                            : <><AlertTriangle size={9} className="text-amber-500" /> Flagged</>
                          }
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Contact management buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowContactMenu(showContactMenu === chat.id ? null : chat.id); }}
                    className="contact-menu-button p-1.5 rounded-lg text-[#555] hover:text-white hover:bg-[#2a2a2a] transition-all shrink-0"
                    title="More options"
                  >
                    <MoreVertical size={12} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleExportChat(chat.id, chat.name); }}
                    className="p-1.5 rounded-lg text-[#555] hover:text-[#8e8e93] transition-all shrink-0"
                    title="Export chat"
                  >
                    <Download size={12} />
                  </button>
                </div>

                {/* Contact management dropdown menu */}
                {showContactMenu === chat.id && (
                  <div className="contact-dropdown absolute right-0 top-full mt-1 w-48 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="py-1">
                      {!isBlocked && (
                        <button 
                          onClick={() => { blockContact(chat.id); setShowContactMenu(null); }}
                          className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2"
                        >
                          <Ban size={14} />
                          <span>Block Contact</span>
                        </button>
                      )}
                      {isBlocked && (
                        <button 
                          onClick={() => { unblockContact(chat.id); setShowContactMenu(null); }}
                          className="w-full px-3 py-2 text-left text-sm text-green-400 hover:bg-green-900/20 transition-colors flex items-center gap-2"
                        >
                          <UserPlus size={14} />
                          <span>Unblock Contact</span>
                        </button>
                      )}
                      {!isArchived && (
                        <button 
                          onClick={() => { archiveChat(chat.id); setShowContactMenu(null); }}
                          className="w-full px-3 py-2 text-left text-sm text-amber-400 hover:bg-amber-900/20 transition-colors flex items-center gap-2"
                        >
                          <Archive size={14} />
                          <span>Archive Chat</span>
                        </button>
                      )}
                      {isArchived && (
                        <button 
                          onClick={() => { unarchiveChat(chat.id); setShowContactMenu(null); }}
                          className="w-full px-3 py-2 text-left text-sm text-green-400 hover:bg-green-900/20 transition-colors flex items-center gap-2"
                        >
                          <Archive size={14} />
                          <span>Unarchive Chat</span>
                        </button>
                      )}
                      {!isStarred && (
                        <button 
                          onClick={() => { starContact(chat.id); setShowContactMenu(null); }}
                          className="w-full px-3 py-2 text-left text-sm text-yellow-400 hover:bg-yellow-900/20 transition-colors flex items-center gap-2"
                        >
                          <Star size={14} />
                          <span>Star Contact</span>
                        </button>
                      )}
                      {isStarred && (
                        <button 
                          onClick={() => { unstarContact(chat.id); setShowContactMenu(null); }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-900/20 transition-colors flex items-center gap-2"
                        >
                          <Star size={14} />
                          <span>Unstar Contact</span>
                        </button>
                      )}
                      <button 
                        onClick={() => { deleteChat(chat.id); setShowContactMenu(null); }}
                        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        <span>Delete Chat</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div className="px-4 py-3 border-t border-[#2a2a2a] flex items-center gap-3">
        <Activity size={10} className="text-[#333] animate-pulse" />
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-1">
            <MessageSquare size={9} className="text-[#333]" />
            <span className="text-[9px] text-[#333] font-medium uppercase">{totalMessages} msgs</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-[#333] font-medium uppercase">{chats.length} chats</span>
          </div>
        </div>
        <span className="text-[9px] text-[#2a2a2a] font-medium uppercase tracking-widest">v1.0.5</span>
      </div>
    </aside>
  );
}