
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore.ts';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Projects from './pages/Projects.tsx';
import ProjectDetails from './pages/ProjectDetails.tsx';
import Tasks from './pages/Tasks.tsx';
import Team from './pages/Team.tsx';
import Settings from './pages/Settings.tsx';
import Login from './pages/Login.tsx';
import Landing from './pages/Landing.tsx';

const App: React.FC = () => {
  const store = useStore();
  const { isAuthenticated, bootstrapped } = store;

  // While we are bootstrapping the auth (fetching current user from API),
  // render a minimal loading placeholder to avoid rendering protected
  // routes/components that expect `currentUser` synchronously.
  if (!bootstrapped) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-zinc-500">Loading…</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login store={store} />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout store={store}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard store={store} />} />
                  <Route path="/projects" element={<Projects store={store} />} />
                  <Route path="/projects/:id" element={<ProjectDetails store={store} />} />
                  <Route path="/tasks" element={<Tasks store={store} />} />
                  <Route path="/team" element={<Team store={store} />} />
                  <Route path="/settings" element={<Settings store={store} />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
