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
  
  const { articles, loading, error, lastUpdate } = useCrawler(activeSection);
  
  const grouped = useMemo(() => {
    const groups = { top: [], politics: [], science: [], environment: [], technology: [] };
    articles.forEach(a => {
      if (groups[a.category]) groups[a.category].push(a);
      console.log(groups);
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
                      title={category == 'top' ? 'Top US News' : category.charAt(0).toUpperCase() + category.slice(1)}
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
              articles={articles.filter(a =>
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
