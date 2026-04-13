import { useState } from 'react';
import { X, Shield, FileText, Star, Volume2, VolumeX, UserPlus, Crown, UserMinus, LogOut, Search, ClipboardList, Download, Edit2, Check } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { LinkPreview, extractUrls } from './ui/link-preview';

interface ChatInfoSidebarProps {
  onClose: () => void;
}

const ONLINE_USERS: Record<string, { name: string; online: boolean }[]> = {
  '1': [{ name: 'Pulse AI', online: true }, { name: 'John Doe', online: false }, { name: 'abh', online: true }],
  '2': [{ name: 'John Doe', online: false }],
};

export default function ChatInfoSidebar({ onClose }: ChatInfoSidebarProps) {
  const {
    activeChat, messages, mutedChats, muteChat, unmuteChat, addToast,
    groupMembers, promoteMember, removeMember, leaveGroup, addMemberToGroup, availableUsers,
    auditLog, addAuditEntry, setGroupDescription, // C11, F17
  } = useChatStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'info' | 'files' | 'starred' | 'members' | 'audit'>('info');

  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false); // F17
  const [descDraft, setDescDraft] = useState(''); // F17

  if (!activeChat) return null;

  const currentMessages = messages[activeChat.id] || [];
  const messageCount = currentMessages.filter(m => !m.isDeleted).length;
  const fileMessages = currentMessages.filter(m => m.file && !m.isDeleted);
  const starredMsgs = currentMessages.filter(m => m.isStarred && !m.isDeleted);
  const isMuted = mutedChats.includes(activeChat.id);
  const onlineUsers = ONLINE_USERS[activeChat.id] || [];

  const members = groupMembers?.[activeChat.id] || [];
  const currentUserMember = members.find(m => m.name === user?.name || m.userId === user?.id);
  const isCurrentUserAdmin = currentUserMember?.role === 'admin';
  const isGroup = activeChat.type === 'group';

  const addableUsers = availableUsers.filter(
    u => !members.find(m => m.userId === u.id) && u.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // C11: filter audit log for this chat
  const chatAuditLog = auditLog.filter(e => e.chatId === activeChat.id);

  // F14: export chat as text
  const handleExportPDF = () => {
    const msgs = currentMessages.filter(m => !m.isDeleted);
    const text = `PULSE CHAT EXPORT\nChat: ${activeChat.name}\nExported: ${new Date().toLocaleString()}\n\n` +
      msgs.map(m => `[${m.fullTimestamp || m.timestamp}] ${m.senderName}: ${m.content}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${activeChat.name}-export.txt`; a.click();
    URL.revokeObjectURL(url);
    addToast({ title: '⬇️ Exported', message: 'Chat exported as .txt', type: 'system' });
  };

  const handleMuteToggle = () => {
    if (isMuted) { unmuteChat(activeChat.id); addToast({ title: '🔔 Unmuted', message: 'Notifications enabled.', type: 'system' }); }
    else { muteChat(activeChat.id); addToast({ title: '🔕 Muted', message: 'Chat muted.', type: 'system' }); }
  };

  const handlePromote = (userId: string, name: string) => {
    promoteMember(activeChat.id, userId);
    addAuditEntry(activeChat.id, `Promoted ${name} to admin`, user?.name || 'Admin'); // C11
    addToast({ title: '👑 Promoted', message: `${name} is now an admin.`, type: 'system' });
  };

  const handleRemove = (userId: string, name: string) => {
    removeMember(activeChat.id, userId);
    addAuditEntry(activeChat.id, `Removed ${name} from group`, user?.name || 'Admin'); // C11
    setConfirmRemove(null);
    addToast({ title: '🚫 Removed', message: `${name} was removed.`, type: 'alert' });
  };

  const handleLeaveGroup = () => {
    leaveGroup(activeChat.id);
    addAuditEntry(activeChat.id, `${user?.name || 'User'} left the group`, user?.name || 'User'); // C11
    setConfirmLeave(false);
    onClose();
    addToast({ title: '👋 Left Group', message: `You left ${activeChat.name}.`, type: 'system' });
  };

  const handleAddMember = (userId: string, name: string) => {
    addMemberToGroup(activeChat.id, userId);
    addAuditEntry(activeChat.id, `Added ${name} to group`, user?.name || 'Admin'); // C11
    setMemberSearch('');
    addToast({ title: '✅ Added', message: `${name} added to the group.`, type: 'system' });
  };

  const handleSaveDesc = () => { // F17
    setGroupDescription(activeChat.id, descDraft);
    setEditingDesc(false);
    addToast({ title: '✏️ Updated', message: 'Group description saved.', type: 'system' });
  };

  const tabs = [
    { key: 'info', label: 'Info' },
    { key: 'files', label: 'Files' },
    { key: 'starred', label: '⭐' },
    { key: 'members', label: 'Users' },
    { key: 'audit', label: 'Log' }, // C11: 5th tab
  ];

  return (
    <aside className="w-80 bg-[#1e293b]/30 border-l border-slate-900 flex flex-col h-full backdrop-blur-2xl shrink-0">
      <div className="p-6 border-b border-slate-900 flex items-center justify-between">
        <h2 className="text-white font-black text-lg tracking-tight">Chat Info</h2>
        <div className="flex items-center gap-2">
          {/* F14: export button */}
          <button onClick={handleExportPDF} title="Export chat"
            className="p-2 rounded-lg text-slate-500 hover:text-white bg-slate-800 transition-colors"
          >
            <Download size={14} />
          </button>
          <button onClick={handleMuteToggle}
            className={`p-2 rounded-lg transition-colors ${isMuted ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-white bg-slate-800'}`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-900">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-colors ${
              activeTab === tab.key ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">

        {/* ── Info tab ── */}
        {activeTab === 'info' && (
          <>
            <div className="bg-[#0f172a] rounded-2xl p-4 border border-slate-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg uppercase">
                  {activeChat.name[0]}
                </div>
                <div>
                  <h3 className="text-white font-black text-lg">{activeChat.name}</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    {activeChat.type === 'group' ? 'Group Chat' : 'Direct Message'}
                  </p>
                </div>
              </div>

              {/* F17: Group description */}
              {isGroup && (
                <div className="mb-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Description</span>
                    {isCurrentUserAdmin && !editingDesc && (
                      <button onClick={() => { setDescDraft(activeChat.description || ''); setEditingDesc(true); }}
                        className="text-slate-500 hover:text-white transition-colors"
                      >
                        <Edit2 size={11} />
                      </button>
                    )}
                  </div>
                  {editingDesc ? (
                    <div className="flex gap-2 mt-1">
                      <input value={descDraft} onChange={e => setDescDraft(e.target.value)}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white outline-none"
                        placeholder="Add a group description..."
                        autoFocus
                      />
                      <button onClick={handleSaveDesc} className="text-emerald-400 hover:text-emerald-300"><Check size={13} /></button>
                      <button onClick={() => setEditingDesc(false)} className="text-slate-500 hover:text-white"><X size={13} /></button>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs mt-1">{activeChat.description || 'No description set.'}</p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Type</span>
                  <span className="text-indigo-400 text-xs font-bold">{activeChat.type === 'group' ? 'Group' : 'Direct'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Messages</span>
                  <span className="text-indigo-400 text-xs font-bold">{messageCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Starred</span>
                  <span className="text-amber-400 text-xs font-bold">{starredMsgs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Notifications</span>
                  <span className={`text-xs font-bold ${isMuted ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isMuted ? 'Muted' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-[#0f172a] rounded-2xl p-4 border border-slate-900">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-indigo-400" />
                <h3 className="text-white font-black text-xs uppercase tracking-widest">Security</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Encryption</span>
                  <span className="text-emerald-400 text-xs font-bold">End-to-End</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                  <span className="text-emerald-400 text-xs font-bold">Secured</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Files tab ── */}
        {activeTab === 'files' && (
          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">{fileMessages.length} files shared</p>
            {fileMessages.length === 0
              ? <p className="text-slate-600 text-xs font-bold text-center py-8">No files shared yet</p>
              : fileMessages.map(msg => {
                const urls = extractUrls(msg.content || '');
                return (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0f172a] border border-slate-900">
                      <FileText size={14} className="text-indigo-400 shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{msg.file?.name}</p>
                        <p className="text-[8px] text-slate-600 uppercase">{msg.senderName} · {msg.timestamp}</p>
                      </div>
                      {/* F14: download button in files tab */}
                      <button onClick={() => addToast({ title: 'Download', message: `Downloading ${msg.file?.name}`, type: 'system' })}
                        className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                    
                    {/* Link previews from message content */}
                    {urls.length > 0 && (
                      <div className="ml-8 space-y-2">
                        <p className="text-[8px] text-slate-600 font-medium uppercase tracking-wider">Links in message:</p>
                        {urls.map((url, urlIndex) => (
                          <LinkPreview key={urlIndex} url={url} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            }
          </div>
        )}

        {/* ── Starred tab ── */}
        {activeTab === 'starred' && (
          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">{starredMsgs.length} starred messages</p>
            {starredMsgs.length === 0
              ? <p className="text-slate-600 text-xs font-bold text-center py-8">No starred messages yet</p>
              : starredMsgs.map(msg => (
                <div key={msg.id} className="p-3 rounded-xl bg-[#0f172a] border border-slate-900">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <p className="text-[9px] font-black text-indigo-400 uppercase">{msg.senderName}</p>
                    <p className="text-[9px] text-slate-600">{msg.timestamp}</p>
                  </div>
                  <p className="text-xs text-slate-300">{msg.content}</p>
                </div>
              ))
            }
          </div>
        )}

        {/* ── Members tab ── */}
        {activeTab === 'members' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {isGroup ? `${members.length} members` : `${onlineUsers.filter(u => u.online).length} online`}
              </p>
              {isGroup && isCurrentUserAdmin && (
                <button onClick={() => setShowAddMember(v => !v)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 text-[9px] font-black uppercase tracking-widest transition-colors"
                >
                  <UserPlus size={11} /> Add
                </button>
              )}
            </div>

            {isGroup && isCurrentUserAdmin && showAddMember && (
              <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-3 space-y-2">
                <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
                  <Search size={12} className="text-slate-500" />
                  <input type="text" placeholder="Search users..." value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-white outline-none placeholder-slate-600"
                    autoFocus
                  />
                </div>
                {addableUsers.length === 0
                  ? <p className="text-slate-600 text-[9px] font-bold text-center py-2">No users found</p>
                  : addableUsers.map(u => (
                    <div key={u.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-700 flex items-center justify-center text-white text-[9px] font-bold">
                          {u.name[0].toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-300 font-bold">{u.name}</span>
                      </div>
                      <button onClick={() => handleAddMember(u.id, u.name)}
                        className="text-[9px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  ))
                }
              </div>
            )}

            {isGroup ? (
              members.length === 0
                ? <p className="text-slate-600 text-xs font-bold text-center py-8">No members</p>
                : members.map(member => {
                  const isMe = member.name === user?.name || member.userId === user?.id;
                  const isPendingRemove = confirmRemove === member.userId;
                  return (
                    <div key={member.userId} className="bg-[#0f172a] rounded-xl border border-slate-900 p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                            {member.name[0].toUpperCase()}
                          </div>
                          {member.role === 'admin' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                              <Crown size={8} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {member.name}{isMe && <span className="text-slate-500 font-normal"> (you)</span>}
                          </p>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${member.role === 'admin' ? 'text-amber-400' : 'text-slate-500'}`}>
                            {member.role}
                          </span>
                        </div>
                        {isCurrentUserAdmin && !isMe && (
                          <div className="flex items-center gap-1 shrink-0">
                            {member.role === 'member' && (
                              <button onClick={() => handlePromote(member.userId, member.name)} title="Promote to Admin"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                              >
                                <Crown size={12} />
                              </button>
                            )}
                            <button onClick={() => setConfirmRemove(isPendingRemove ? null : member.userId)} title="Remove"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            >
                              <UserMinus size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                      {isPendingRemove && (
                        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                          <p className="text-[9px] text-slate-400 font-bold">Remove {member.name}?</p>
                          <div className="flex gap-2">
                            <button onClick={() => setConfirmRemove(null)} className="text-[9px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest">Cancel</button>
                            <button onClick={() => handleRemove(member.userId, member.name)} className="text-[9px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest">Remove</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            ) : (
              onlineUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#0f172a] border border-slate-900">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f172a] ${u.online ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{u.name}</p>
                    <p className={`text-[9px] font-black uppercase ${u.online ? 'text-emerald-500' : 'text-slate-600'}`}>
                      {u.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))
            )}

            {isGroup && (
              <div className="pt-2">
                {!confirmLeave ? (
                  <button onClick={() => setConfirmLeave(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-900/40 text-red-400 hover:bg-red-400/10 text-[10px] font-black uppercase tracking-widest transition-colors"
                  >
                    <LogOut size={12} /> Leave Group
                  </button>
                ) : (
                  <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-3 flex items-center justify-between">
                    <p className="text-[9px] text-slate-300 font-bold">Leave {activeChat.name}?</p>
                    <div className="flex gap-3">
                      <button onClick={() => setConfirmLeave(false)} className="text-[9px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest">Cancel</button>
                      <button onClick={handleLeaveGroup} className="text-[9px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest">Leave</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── C11: Audit Log tab ── */}
        {activeTab === 'audit' && (
          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">
              {chatAuditLog.length} admin actions
            </p>
            {chatAuditLog.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <ClipboardList size={28} className="text-slate-700" />
                <p className="text-slate-600 text-xs font-bold">No admin actions yet</p>
                <p className="text-slate-700 text-[10px]">Promotions, removals and joins will appear here</p>
              </div>
            ) : (
              chatAuditLog.map(entry => (
                <div key={entry.id} className="p-3 rounded-xl bg-[#0f172a] border border-slate-900 flex items-start gap-3">
                  <ClipboardList size={12} className="text-indigo-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-white">{entry.action}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">by {entry.by} · {entry.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
}