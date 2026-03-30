import { Menu } from "lucide-react";

export default function Navbar({activeSection, onToggleSidebar, sidebarCollapsed}) {
    const SECTION_LABELS = {
        dashboard: 'Dashboard',
        top: 'Top United States',
        politics: 'Politics',
        science: 'Science',
        environment: 'Environment',
        technology: 'Technology',
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
    </header>
  );
}
