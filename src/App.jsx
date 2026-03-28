import { useMemo, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { useCrawler } from './hooks/useCrawler';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const { articles, loading, error, lastUpdate } = useCrawler(activeSection);
  
  const checkArticles  = useMemo(() => { 
    articles.forEach(a => {
      console.log(a.title);
    });
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

      <main className="min-h-screen">
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-ember-500/10 border border-ember-500/30 rounded-md px-4 py-3 text-sm text-ember-400 flex items-center gap-2">
              <span>⚠️</span>
              <span>Feed error: {error}. Showing cached results.</span>
            </div>
          )}

        
        </div>
      </main>
    </div>
  )
}

export default App
