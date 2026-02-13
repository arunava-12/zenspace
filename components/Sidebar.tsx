
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Settings, 
  ChevronLeft,
  Zap,
  ChevronDown,
  Plus
} from 'lucide-react';
import { Workspace } from '../types.ts';

const Sidebar: React.FC<any> = ({
  isOpen,
  setIsOpen,
  activeWorkspace = { id: '', name: '' },
  workspaces = [],
  setActiveWorkspaceId = (id: string) => {},
  createWorkspace = () => {},
  openWorkspaceModal = (type?: string) => {}
}) => {
  const [showWsMenu, setShowWsMenu] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Projects', icon: FolderKanban, path: '/projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Team', icon: Users, path: '/team' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside 
      className={`relative h-full transition-all duration-300 z-30 ${
        isOpen ? 'w-64' : 'w-20'
      } glass-card !bg-opacity-50 !rounded-none !border-y-0 !border-l-0 border-r border-zinc-200 dark:border-white/5 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className={`p-5 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
            <Zap size={20} fill="currentColor" />
          </div>
          {isOpen && <span className="font-bold text-xl tracking-tight whitespace-nowrap">ZenSpace</span>}
        </div>
        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 dark:hover:bg-black/20 rounded-md transition-colors text-zinc-500 hidden md:block"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Workspace Selector - Inline Accordion Style */}
      <div className="px-5 mb-2 relative">
        <button 
          onClick={() => isOpen && setShowWsMenu(!showWsMenu)}
          className={`w-full p-3 glass-inset rounded-xl flex items-center gap-3 transition-all hover:bg-white/10 ${!isOpen ? 'justify-center p-2' : ''}`}
        >
          <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-inner flex-shrink-0">
            {activeWorkspace?.name.charAt(0)}
          </div>
          {isOpen && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">{activeWorkspace?.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Workspace</p>
              </div>
              <ChevronDown size={14} className={`text-zinc-400 transition-transform ${showWsMenu ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {/* Workspace List - Inline (pushed content down) */}
        {isOpen && showWsMenu && (
          <div className="mt-2 space-y-1 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {workspaces.map((ws: Workspace) => (
              <button
                key={ws.id}
                onClick={() => {
                  setActiveWorkspaceId(ws.id);
                  setShowWsMenu(false);
                }}
                className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${activeWorkspace.id === ws.id ? 'bg-blue-600/80 text-white shadow-md' : 'hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400'}`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${activeWorkspace.id === ws.id ? 'bg-white/20' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                  {ws.name.charAt(0)}
                </div>
                <span className="truncate font-medium">{ws.name}</span>
              </button>
            ))}
            
            {/* Styled Create/Join Button Area */}
            <div className="pt-2 px-1">
              <button 
                onClick={() => {
                  openWorkspaceModal('create');
                  setShowWsMenu(false);
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl border-2 border-dashed border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-500 hover:text-blue-500 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all"
              >
                <Plus size={14} />
                Create Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative
              ${isOpen ? '' : 'justify-center'}
              ${isActive 
                ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium border border-blue-500/20' 
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/20 dark:hover:bg-white/5'}
            `}
          >
            <item.icon size={20} />
            {isOpen && <span>{item.name}</span>}
            {!isOpen && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className={`p-5 border-t border-white/10 dark:border-white/5 flex flex-col gap-4 ${!isOpen && 'items-center'}`}>
        {!isOpen && (
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            ?
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
