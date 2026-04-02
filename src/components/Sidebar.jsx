import { useState } from 'react';
import {
  LayoutDashboard, Flag, FlaskConical, Leaf, Cpu,
  ChevronRight, Radio, TrendingUp
} from 'lucide-react';
import { useHealth } from '../hooks/useCrawler';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    color: 'text-slate-200',
    children: [
      { id: 'top', label: 'Top News', icon: Flag },
      { id: 'politics', label: 'Politics', icon: TrendingUp },
      { id: 'science', label: 'Science', icon: FlaskConical },
      { id: 'environment', label: 'Environment', icon: Leaf },
      { id: 'technology', label: 'Technology', icon: Cpu },
    ]
  }
];

const CATEGORY_COLORS = {
  top: 'text-yellow-400',
  politics: 'text-orange-400',
  science: 'text-sky-400',
  environment: 'text-green-400',
  technology: 'text-purple-400',
};

export default function Sidebar({ activeSection, onSectionChange, collapsed, articleCounts }) {
  const [expandedGroups, setExpandedGroups] = useState(['dashboard']);
  const { health, lastUpdate, pingHealth } = useHealth();
  console.log(health);
  const toggleGroup = (id) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className={`
      fixed left-0 top-0 h-full z-30 flex flex-col
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-16' : 'w-60'}
      bg-slate-900 border-r border-slate-700/50
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50 cursor-default">
        <div className="flex-shrink-0 w-8 h-8 bg-ember-500 rounded-sm flex items-center justify-center">
          📰
        </div>
        {!collapsed && (
          <div className="animate-fade-up">
            <div className="font-display text-lg tracking-wider text-slate-100">My News</div>
            <div className="font-mono text-[9px] text-slate-500 tracking-widest uppercase -mt-0.5">Live News Crawler</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {NAV_ITEMS.map(group => {
            const isExpanded = expandedGroups.includes(group.id);
            const GroupIcon = group.icon;

            return (
            <div key={group.id} className="mb-1">
                {/* Group header */}
                <button
                onClick={() => {
                    onSectionChange('dashboard');
                }}
                className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
                    transition-colors duration-150
                    ${activeSection === 'dashboard'
                    ? 'bg-slate-700/70 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
                `}
                >
                <GroupIcon size={16} className={group.color} />
                {!collapsed && (
                    <>
                    <span className="flex-1 text-left font-medium tracking-wide">{group.label}</span>
                    <span
                      className={`px-1 py-1 cursor-pointer rounded-md text-sm font-medium hover:bg-slate-800`}
                      onClick={() => {
                          toggleGroup(group.id);
                      }}>
                    <ChevronRight
                        size={14}
                        className={`transition-transform duration-200 text-slate-600 ${isExpanded ? 'rotate-90' : ''}`}
                    />
                    </span>
                    </>
                )}
                </button>

                {/* Children */}
                {!collapsed && isExpanded && (
                <div className="mt-1 ml-2 space-y-0.5 animate-slide-in">
                    {group.children.map(child => {
                    const ChildIcon = child.icon;
                    const colorClass = CATEGORY_COLORS[child.id] || 'text-slate-400';
                    const count = articleCounts?.[child.id] || 0;
                    const isActive = activeSection === child.id;

                    return (
                        <button
                        key={child.id}
                        onClick={() => onSectionChange(child.id)}
                        className={`
                            w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm
                            transition-all duration-150 group
                            ${isActive
                            ? 'bg-slate-700/60 text-slate-100'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'}
                        `}
                        >
                        <ChildIcon size={13} className={isActive ? colorClass : 'text-slate-600 group-hover:text-slate-400'} />
                        <span className="flex-1 text-left text-[13px] tracking-wide">{child.label}</span>
                        {count > 0 && (activeSection == child.id || activeSection == 'dashboard') && (
                            <span className={`
                            font-serif text-[10px] px-1.5 py-0.5 rounded-sm
                            ${isActive ? `bg-slate-600 ${colorClass}` : 'bg-slate-800 text-slate-600'}
                            `}>
                            {count}
                            </span>
                        )}
                        </button>
                    );
                    })}
                </div>
                )}
            </div>
            );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-ink-700/50">
          <div className="flex items-center gap-2">
            <span 
              className={`cursor-default inline-block mr-1 animate-pulse transition-colors duration-300 ease-in-out ${health.status == 'ok' ? 'text-green-600 hover:text-green-300' : 'text-red-500'}`}
              >●</span>
            <span className="font-serif text-[10px] text-slate-500 tracking-widest uppercase cursor-default">Web Crawler + Scraper</span>
          </div>
        </div>
      )}
    </div>
  );
}
