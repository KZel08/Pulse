import React from 'react';
import { useChatStore } from '../store/useChatStore';

interface MessageSearchFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  senderFilter: string;       // userId or '' for all
  onSenderChange: (id: string) => void;
  typeFilter: 'all' | 'text' | 'file' | 'image';
  onTypeChange: (t: 'all' | 'text' | 'file' | 'image') => void;
  dateRange: { from: string; to: string };      // ISO date strings or ''
  onDateRangeChange: (range: { from: string; to: string }) => void;
}

const MessageSearchFilters: React.FC<MessageSearchFiltersProps> = ({
  query,
  onQueryChange,
  senderFilter,
  onSenderChange,
  typeFilter,
  onTypeChange,
  dateRange,
  onDateRangeChange,
}) => {
  const { groupMembers, activeChat } = useChatStore();

  const members = groupMembers[activeChat?.id || ''] || [];

  const hasActiveFilters = query || senderFilter || typeFilter !== 'all' || dateRange.from || dateRange.to;

  const handleClearFilters = () => {
    onQueryChange('');
    onSenderChange('');
    onTypeChange('all');
    onDateRangeChange({ from: '', to: '' });
  };

  const typeOptions = [
    { value: 'all', label: 'All' },
    { value: 'text', label: 'Text' },
    { value: 'file', label: 'File' },
    { value: 'image', label: 'Image' },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search messages..."
          className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-white placeholder-[#555] outline-none focus:border-indigo-500/50"
        />
      </div>

      {/* Type filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        {typeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onTypeChange(option.value)}
            className={`rounded-full text-xs px-3 py-1 border transition-colors ${
              typeFilter === option.value
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-transparent border-[#2a2a2a] text-[#555] hover:border-[#444]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Sender select */}
      <div>
        <select
          value={senderFilter}
          onChange={(e) => onSenderChange(e.target.value)}
          className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-[#8e8e93] outline-none"
        >
          <option value="">All senders</option>
          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date range */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-[10px] text-[#555] block mb-1">From</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
            className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-[#8e8e93] outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-[#555] block mb-1">To</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
            className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-[#8e8e93] outline-none"
          />
        </div>
      </div>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="text-xs text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default MessageSearchFilters;
