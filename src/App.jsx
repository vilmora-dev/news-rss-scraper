import { useMemo, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { useCrawler } from './hooks/useCrawler';
import NewsGrid from './components/NewsGrid';
import NewsCard from './components/NewsCard';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { articles, loading, error, lastUpdate } = useCrawler(activeSection);

  const grouped = useMemo(() => {
    const groups = { top: [], politics: [], science: [], environment: [], technology: [] };
    articles.forEach(a => {
      if (groups[a.category]) groups[a.category].push(a);
    });
    return groups;
  }, [articles]);

  return (
    <div className="min-h-screen bg-slate-800">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
      />

      <Navbar
        activeSection={activeSection}
        onToggleSidebar={() => setSidebarCollapsed(s => !s)}
        sidebarCollapsed={sidebarCollapsed}
      />

      <main className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-[64px] pt-[56px]' : 'ml-[240px] mt-[56px] pt-[20px]'}`}>
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">

          {error && (
            <div className="bg-ember-500/10 border border-red-500/30 rounded-md px-4 py-3 text-sm text-red-400 flex items-center gap-2">
              <span>⚠️</span>
              <span>Feed error: {error}. Showing cached results.</span>
            </div>
          )}

          {activeSection != "" && (
            <div className="space-y-6 pl-15 animate-fade-up">
              {Object.entries(grouped).map(([category, articles]) => {
                if (articles.length === 0) return null;
                return (
                  <div key={category}>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {articles.map((article, i) => (
                        <div
                            key={article.id}
                            className="animate-fade-up"
                            style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, animationFillMode: 'both' }}
                        >
                          <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex flex-col rounded-xl overflow-hidden border border-cyan-700/30 hover:border-cyan-600/50 bg-slate-900/40 hover:bg-slate-800/70 transition-all duration-200 hover:-translate-y-1"
                          >

                              {/* Content */}
                              <div className="flex flex-col flex-1 p-4 gap-2">
                                  <div className={`category-badge bg-slate-700 border rounded self-start px-1 tracking-wide font-serif text-xs`}>
                                      {category.charAt(0).toUpperCase() + category.slice(1)}
                                  </div>

                                  <h4 className="text-sm font-semibold text-white group-hover: leading-snug line-clamp-3 transition-colors font-mono tracking-wide flex-1">
                                      {article.title}
                                  </h4>

                                  {article.description && (
                                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                          {article.description}
                                      </p>
                                  )}

                                  <div className="flex items-center gap-2 text-slate-600 text-[11px] font-serif pt-1 border-t border-slate-600/40">
                                      <span>{new Date(article.publishedAt).toLocaleString()}</span>
                                      <span className="text-slate-700">·</span>
                                      <span className="truncate">{article.source}</span>
                                  </div>
                              </div>
                          </a>
                        </div>
                        ))}
                    </div>
                    <div className="section-divider" />
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default App