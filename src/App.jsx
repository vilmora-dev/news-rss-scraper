import { useMemo, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { useCrawler } from './hooks/useCrawler';
import NewsGrid from './components/NewsGrid';
import SectionPage from './components/SectionPage';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles, loading, error, lastUpdate } = useCrawler(activeSection);
  
  // Filter by search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.source?.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  // articleCounts uses filteredArticles too, so they always match
  const articleCounts = useMemo(() => {
      const counts = { top: 0, politics: 0, science: 0, environment: 0, technology: 0 };
      filteredArticles.forEach(a => {
          if (counts[a.category] !== undefined) counts[a.category]++;
      });
      return counts;
  }, [filteredArticles]);

  const grouped = useMemo(() => {
    const groups = { top: [], politics: [], science: [], environment: [], technology: [] };
    filteredArticles.forEach(a => {
      if (groups[a.category]) groups[a.category].push(a);
    });
    return groups;
  }, [filteredArticles]);
  
  return (
    <div className="min-h-screen bg-slate-800">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        articleCounts={articleCounts}
      />

      <Navbar 
        activeSection={activeSection}
        onToggleSidebar={() => setSidebarCollapsed(s => !s)}
        sidebarCollapsed={sidebarCollapsed}
        onSearch={setSearchQuery}
      />

      <main className={`min-h-screen transition-all duration-300 min-h-screen ${sidebarCollapsed ? 'ml-[64px] pt-[56px]' : 'ml-[240px] mt-[56px] pt-[20px]' }`}>
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-ember-500/10 border border-red-500/30 rounded-md px-4 py-3 text-sm text-red-400 flex items-center gap-2">
              <span>⚠️</span>
              <span>Feed error: {error}. Showing cached results.</span>
            </div>
          )}

          {/* DASHBOARD */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 pl-15 animate-fade-up">
              {Object.entries(grouped).map(([category, articles]) => {
                if (articles.length === 0) return null;

                return (
                  <div key={category}>
                    <NewsGrid
                      articles={articles}
                      title={category == 'top' ? 'Top News' : category.charAt(0).toUpperCase() + category.slice(1)}
                      subtitle={`${articles.length} articles`}
                    />
                    <div className="section-divider" />
                  </div>
                );
              })}

            </div>
          )}

          {/* SECTION PAGES */}
          {activeSection !== 'dashboard' && (
            <SectionPage
              section={activeSection}
              articles={filteredArticles.filter(a =>
                activeSection === 'top' ? a.category === 'top' : a.category === activeSection
              )}
              loading={loading}
            />
          )}

        </div>
      </main>
    </div>
  )
}

export default App
