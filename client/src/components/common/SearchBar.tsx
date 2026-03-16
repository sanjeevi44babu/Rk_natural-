import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  showFilter?: boolean;
  onFilterClick?: () => void;
}

export function SearchBar({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  showFilter = false,
  onFilterClick 
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 relative">
        <Search 
          size={18} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-medical pl-11"
        />
      </div>
      {showFilter && (
        <button 
          onClick={onFilterClick}
          className="p-3 rounded-xl border-2 border-input bg-background hover:bg-accent transition-colors"
        >
          <Filter size={18} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
