import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';

interface MentionAutocompleteProps {
  query: string;               // text after the @ symbol, used to filter
  onSelect: (name: string) => void;
  onClose: () => void;
}

const MentionAutocomplete: React.FC<MentionAutocompleteProps> = ({ query, onSelect, onClose }) => {
  const { groupMembers, activeChat } = useChatStore();

  const members = groupMembers[activeChat?.id || ''] || [];
  const filteredMembers = members
    .filter(member => member.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (filteredMembers.length === 0) {
    return (
      <div className="absolute bottom-full mb-1 left-0 w-56 bg-[#0f172a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden z-50">
        <div className="p-3">
          <p className="text-xs text-[#555]">No matches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-full mb-1 left-0 w-56 bg-[#0f172a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden z-50">
      {filteredMembers.map((member) => (
        <button
          key={member.userId}
          onClick={() => {
            onSelect(member.name);
            onClose();
          }}
          className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#2a2a2a] transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-300 text-xs flex items-center justify-center">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#ccc]">{member.name}</p>
            {member.role === 'admin' && (
              <p className="text-[9px] text-indigo-400">Admin</p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default MentionAutocomplete;
