import { useMemo, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

        </div>
      </main>
    </div>
  )
}

export default App
