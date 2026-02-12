import React, { useState } from "react";
import Sidebar from "./Sidebar.tsx";
import Navbar from "./Navbar.tsx";
import DarkVeil from "./DarkVeil.tsx";
import ActivitySidebar from "./ActivitySidebar.tsx";
import GlobalModals from "./GlobalModals.tsx";

interface LayoutProps {
  children: React.ReactNode;
  store: any;
}

const Layout: React.FC<LayoutProps> = ({ children, store }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activityOpen, setActivityOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 relative">
      {/* Global Modals */}
      <GlobalModals store={store} />

      {/* Cinematic Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000 overflow-hidden">
        <div className="w-full h-full transform scale-110">
          <DarkVeil
            hueShift={0}
            speed={1.9}
            warpAmount={0.25}
            resolutionScale={0.85}
          />
        </div>
      </div>

      {/* Navigation Sidebar (Left) */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeWorkspace={store.activeWorkspace}
        workspaces={store.workspaces}
        setActiveWorkspaceId={store.setActiveWorkspaceId}
        createWorkspace={store.createWorkspace}
        openWorkspaceModal={store.openWorkspaceModal}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Navbar */}
        <Navbar
          store={store}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          toggleActivity={() => setActivityOpen(!activityOpen)}
          isSidebarOpen={sidebarOpen}
          isActivityOpen={activityOpen}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
              {children}
            </div>
          </main>

          {/* Activity Sidebar (Right) */}
          <ActivitySidebar
            isOpen={activityOpen}
            setIsOpen={setActivityOpen}
            tasks={store.tasks}
            users={store.users}
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;
