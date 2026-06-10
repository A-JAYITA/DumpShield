import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Zap,
} from 'lucide-react';
import DigitalTwinMap from './components/DigitalTwinMap';
import IntelligencePanel from './components/IntelligencePanel';
import NeuralScanEngine from './components/NeuralScanEngine';
import StartupExperience from './components/startup/StartupExperience';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { API_BASE_URL } from './services/api';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import type { Hotspot } from './types';

type AuthPath = '/' | '/login' | '/signup';

const getAuthPath = (): AuthPath => {
  if (window.location.pathname === '/login') {
    return '/login';
  }

  if (window.location.pathname === '/signup') {
    return '/signup';
  }

  return '/';
};

const App: React.FC = () => {
  const { user, token, isAuthenticated, logout } = useAuth();
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [activePage, setActivePage] = useState('home');
  const [selectedSpot, setSelectedSpot] = useState<Hotspot | null>(null);
  const [isStartupComplete, setIsStartupComplete] = useState(false);
  const [authPath, setAuthPath] = useState<AuthPath>(() => getAuthPath());

  const handleAddHotspot = useCallback((hotspot: Hotspot) => {
    setHotspots((prev) => [...prev, hotspot]);
  }, []);

  const navigateAuth = useCallback((path: AuthPath) => {
    window.history.pushState({}, '', path);
    setAuthPath(path);
  }, []);

  useEffect(() => {
    const syncPath = () => setAuthPath(getAuthPath());
    window.addEventListener('popstate', syncPath);

    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  useEffect(() => {
    if (isAuthenticated && authPath !== '/') {
      navigateAuth('/');
    }
  }, [authPath, isAuthenticated, navigateAuth]);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch(`${API_BASE_URL}/api/v1/map/hotspots`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const enriched: Hotspot[] = data.map((h: any) => ({
          ...h,
          cleanliness_score: Math.round(100 - h.garbage_percentage),
          active_dump_sites: Math.max(1, Math.round(h.risk_score * 5)),
          dominant_waste_type: h.severity === 'critical' ? 'Hazardous Waste' : 'Mixed Waste',
          last_updated: 'Just now',
        }));
        setHotspots(enriched);
      })
      .catch(() => {
        setHotspots([]);
      });
  }, [token]);

  if (authPath === '/login') {
    return <LoginPage onNavigate={navigateAuth} />;
  }

  if (authPath === '/signup') {
    return <SignUpPage onNavigate={navigateAuth} />;
  }

  return (
    <ProtectedRoute onRedirect={navigateAuth}>
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Startup Experience */}
      {!isStartupComplete && (
        <StartupExperience onComplete={() => setIsStartupComplete(true)} />
      )}

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_transparent_50%)] opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full" />
      </div>

      <nav className="sticky top-0 z-50 bg-slate-950/60 backdrop-blur-2xl border-b border-white/5 h-20">
        <div className="container mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActivePage('home')}>
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all group-hover:rotate-6">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">DUMP<span className="text-emerald-500">SHIELD</span></h1>
              <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.4em]">City OS v4.2</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <NavItem label="Network" active={activePage === 'home'} onClick={() => setActivePage('home')} />
            <NavItem label="Digital Twin" active={activePage === 'map'} onClick={() => setActivePage('map')} />
            <NavItem label="Neural Scan" active={activePage === 'scan'} onClick={() => setActivePage('scan')} />
            <NavItem label="Command" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
            <button onClick={() => setActivePage('dashboard')} className="px-8 py-3 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)]">Access Hub</button>
            <div className="h-8 w-px bg-white/10" />
            <div className="max-w-36 text-right">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.25em] text-white">
                {user?.name}
              </p>
              <p className="truncate text-[10px] text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex h-10 w-10 items-center justify-center border border-white/10 text-slate-400 transition hover:border-emerald-400/50 hover:text-emerald-300"
              title="Logout"
              type="button"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main App Content */}
      {isStartupComplete && (
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {activePage === 'home' && <HomeView onLaunch={() => setActivePage('dashboard')} />}
          {activePage === 'dashboard' && (
            <DashboardView
              hotspots={hotspots}
              selectedSpot={selectedSpot}
              onSpotClick={setSelectedSpot}
              onSpotClose={() => setSelectedSpot(null)}
            />
          )}
          {activePage === 'map' && <DigitalTwinView hotspots={hotspots} />}
          {activePage === 'scan' && <NeuralScanView onAddHotspot={handleAddHotspot} />}
        </AnimatePresence>
      </main>
      )}
    </div>
    </ProtectedRoute>
  );
};

const HomeView = ({ onLaunch }: { onLaunch: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto px-6 py-32 text-center">
    <motion.h2 className="text-9xl font-black text-white italic tracking-tighter mb-10 uppercase">PREDICT.<br/><span className="text-emerald-500 not-italic">PREVENT.</span></motion.h2>
    <button onClick={onLaunch} className="px-12 py-5 bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.4em]">Launch Console</button>
  </motion.div>
);

const DigitalTwinView = ({ hotspots }: { hotspots: Hotspot[] }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-6 py-12">
    <div className="h-[700px] border border-white/10 bg-slate-900/20 relative">
      <DigitalTwinMap hotspots={hotspots} />
    </div>
  </motion.div>
);

const NeuralScanView = ({ onAddHotspot }: { onAddHotspot: (h: Hotspot) => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <NeuralScanEngine onAddToMap={onAddHotspot} />
  </motion.div>
);

interface DashboardViewProps {
  hotspots: Hotspot[];
  selectedSpot: Hotspot | null;
  onSpotClick: (spot: Hotspot) => void;
  onSpotClose: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ hotspots, selectedSpot, onSpotClick, onSpotClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 py-8"
    >
      <div className="flex gap-6 h-[calc(100vh-160px)]">
        {/* Left: Satellite Map */}
        <div className={`${selectedSpot ? 'w-1/2' : 'w-full'} transition-all duration-500 ease-in-out`}>
          <div className="h-full border border-white/5 bg-slate-900/10 relative overflow-hidden rounded-xl">
            <DigitalTwinMap
              hotspots={hotspots}
              selectedSpot={selectedSpot}
              onSpotClick={onSpotClick}
            />
          </div>
        </div>

        {/* Right: Intelligence Panel */}
        <AnimatePresence>
          {selectedSpot && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '50%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="h-full overflow-hidden"
            >
              <IntelligencePanel
                spot={selectedSpot}
                onClose={onSpotClose}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!selectedSpot && (
          <div className="hidden lg:flex w-0 transition-all duration-500" />
        )}
      </div>

      {/* Empty State Overlay (shown when no spot selected on smaller screens) */}
      {!selectedSpot && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="glass-card px-6 py-3 flex items-center gap-3">
            <Zap className="w-4 h-4 text-emerald-500 animate-pulse" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Tap a map marker to view area intelligence
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const NavItem = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`text-[10px] font-black uppercase tracking-[0.4em] ${active ? 'text-emerald-500 italic' : 'text-slate-500 hover:text-slate-300 transition-colors'}`}>{label}</button>
);

export default App;
