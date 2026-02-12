
import React from 'react';
import { Search, Bell, Sun, Moon, Plus, PanelLeft } from 'lucide-react';

interface NavbarProps {
  store: any;
  toggleSidebar: () => void;
  toggleActivity: () => void;
  isSidebarOpen: boolean;
  isActivityOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  store, 
  toggleSidebar, 
  toggleActivity, 
  isSidebarOpen, 
  isActivityOpen 
}) => {
  const { darkMode, setDarkMode, currentUser, openTaskModal } = store;

  return (
    <header className="h-16 glass-nav flex items-center justify-between px-6 z-40 sticky top-0 !border-x-0 !border-t-0 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        {!isSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="p-2 text-zinc-500 hover:bg-white/20 dark:hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-white/10"
          >
            <PanelLeft size={20} />
          </button>
        )}
        
        <div className="relative max-w-md w-full group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            className="w-full glass-inset !border-transparent focus:!border-blue-500/40 rounded-full py-2 pl-10 pr-4 text-sm outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={openTaskModal}
          className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus size={16} />
          <span>New</span>
        </button>

        <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-1"></div>

        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-zinc-500 hover:bg-white/20 dark:hover:bg-white/5 rounded-full transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button 
          onClick={toggleActivity}
          className={`p-2 rounded-full transition-all relative ${
            isActivityOpen 
              ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' 
              : 'text-zinc-500 hover:bg-white/20 dark:hover:bg-white/5 border border-transparent'
          }`}
          title="Toggle Activity Feed"
        >
          <Bell size={20} />
          {!isActivityOpen && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse"></span>}
        </button>

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-semibold leading-none">{currentUser.name}</p>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-black opacity-80">{currentUser.role}</p>
          </div>
          <div className="relative group cursor-pointer">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-full border border-white/50 dark:border-white/10 object-cover shadow-sm group-hover:ring-2 ring-blue-500/30 transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
