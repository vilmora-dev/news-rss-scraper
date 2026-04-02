import { Menu, Search } from "lucide-react";
import { useState } from "react";

const SECTION_LABELS = {
    dashboard: 'Dashboard',
    top: 'Top United States',
    politics: 'Politics',
    science: 'Science',
    environment: 'Environment',
    technology: 'Technology',
};

export default function Navbar({activeSection, onToggleSidebar, sidebarCollapsed, onSearch}) {
    const [searchValue, setSearchValue] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchValue(val);
        onSearch(val);
    };

    const clearSearch = () => {
        setSearchValue('');
        onSearch('');
    };



    return (
    <header className="fixed top-0 right-0 z-20 h-14 px-4 gap-4 bg-slate-800/50
        glass-panel border-b border-slate-800/50 flex items-center " 
        style={{ left: sidebarCollapsed ? '64px' : '240px', transition: 'left 0.3s ease' }}>

        {/* Sidebar toggle */}
        <button
            onClick={onToggleSidebar}
            className="flex-shrink-0 p-1.5 rounded-md text-slate-400 
            hover:text-slate-200 hover:bg-slate-700/80 hover:cursor-pointer"
        >
            <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0 cursor-default">
            <span className="font-serif text-[10px] tracking-widest text-slate-500">My News</span>
            <span className="text-slate-400">/</span>
            <span className="font-display text-md font-semibold text-slate-200 truncate tracking-wide">
            {SECTION_LABELS[activeSection] || activeSection}
            </span>
        </div>

        <div className="flex-1" />

        {/* Search  */}
        <div className={`
            relative flex items-center rounded-md transition-all duration-200
            ${searchFocused ? 'bg-ink-700/80 ring-1 ring-ink-500/50 w-80' : 'bg-ink-800/60 w-56'}
        `}>
            <Search size={14} className="absolute left-3 text-ink-500 flex-shrink-0" />
            <input
                type="text"
                value={searchValue}
                onChange={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search articles..."
                className="w-full bg-transparent pl-9 pr-8 py-2 text-sm text-ink-200 placeholder-ink-600 outline-none font-sans"
            />
            {searchValue && (
            <button onClick={clearSearch} className="absolute right-2.5 cursor-pointer text-ink-500 hover:text-ink-300">
                <span className="w-1 h-1">✕</span>
            </button>
            )}
        </div>
    </header>
  );
}
