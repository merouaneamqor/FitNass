'use client';

import { UnifiedSearch } from '@/components/ui';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  selectedOption?: string;
  onOptionSelect?: (option: string) => void;
  date?: string;
  onDateChange?: (date: string) => void;
  time?: string;
  onTimeChange?: (time: string) => void;
  onSearch?: () => void;
  className?: string;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder,
  options,
  selectedOption = 'padel',
  onOptionSelect,
  date,
  onDateChange,
  time,
  onTimeChange,
  onSearch,
  className,
}: SearchBarProps) {
  return (
    <UnifiedSearch
      variant="full"
      className={className}
      initialQuery={searchQuery}
      initialSport={selectedOption}
      initialDate={date}
      initialTime={time}
      placeholder={placeholder}
      onSearch={({ query, sport, date, time }) => {
        setSearchQuery(query);
        onOptionSelect?.(sport);
        onDateChange?.(date);
        onTimeChange?.(time);
        onSearch?.();
      }}
      showFilters={false}
    />
  );
} 