import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Map as MapIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  TrendingUp, 
  Activity, 
  Settings,
  Search,
  CloudRain,
  ShieldCheck,
  Calculator,
  Bell,
  Navigation,
  Info
} from 'lucide-react';
import DigitalTwinMap from './components/DigitalTwinMap';
import ForecastChart from './components/ForecastChart';

const App: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [hotspots, setHotspots] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/dashboard/stats').then(res => res.json()).then(setStats);
    fetch('http://localhost:8000/api/v1/map/hotspots').then(res => res.json()).then(setHotspots);
    fetch('http://localhost:8000/api/v1/forecast/1').then(res => res.json()).then(setForecast);
  }, []);

  const handleClassify = () => {
    setIsClassifying(true);
    setClassificationResult(null);
    setTimeout(() => {
      fetch('http://localhost:8000/api/v1/ai/classify', { method: 'POST', body: new FormData() })
        .then(res => res.json())
        .then(data => {
          setClassificationResult(data);
          setIsClassifying(false);
        });
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.05),_transparent_50%)] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-slate-950/80 backdrop-blur-xl p-8 flex flex-col gap-10 z-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2.5 bg-gradient-to-br from-primary to-emerald-600 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none">DUMP SHIELD <span className="text-primary">AI</span></h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">Hyderabad Intelligence</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavButton icon={<BarChart3 />} label="Command Center" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavButton icon={<MapIcon />} label="Digital Twin" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
          <NavButton icon={<AlertTriangle />} label="Hotspot Intel" active={false} />
          <NavButton icon={<ShieldCheck />} label="Cleanup Verify" active={false} />
          <NavButton icon={<Calculator />} label="Cost Analytics" active={false} />
        </nav>

        <div className="mt-auto space-y-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass-card p-5 border-l-4 border-accent bg-accent/5 overflow-hidden relative"
          >
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="p-1.5 bg-accent/20 rounded-lg">
                <CloudRain className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Garbage Weather</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed relative z-10">Heavy rain predicted in <strong>Banjara Hills</strong>. 85% risk of debris runoff in Zone 4.</p>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <CloudRain className="w-16 h-16" />
            </div>
          </motion.div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/50 border border-white/5">
             <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold">GHMC</div>
             <div className="flex-1">
               <p className="text-xs font-bold">Admin Portal</p>
               <p className="text-[10px] text-slate-500">Ward No. 124</p>
             </div>
             <Settings className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 relative custom-scrollbar">
        <header className="flex justify-between items-start mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-2">
               <Navigation className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Smart City Operations</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
              City Intelligence Dashboard
              <span className="text-sm font-normal px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">Live Hyderabad</span>
            </h2>
          </motion.div>
          
          <div className="flex gap-4 items-center">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search wards, hotspots..." 
                className="bg-slate-900/80 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 w-64 transition-all" 
              />
            </div>
            <button className="relative p-3 glass-card hover:bg-white/10 transition-all">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]" />
            </button>
          </div>
        </header>

        {/* Hero Section with City Image */}
        <section className="relative h-64 rounded-[2rem] overflow-hidden mb-12 shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1626014303757-646c2d399b42?auto=format&fit=crop&q=80&w=1200" 
            alt="Hyderabad City" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <h3 className="text-3xl font-black text-white mb-2 italic tracking-tighter">"Predict. Prevent. Protect."</h3>
            <p className="text-slate-300 font-medium max-w-md">Using AI to eliminate illegal dumping before it happens, saving over ₹45L in municipal costs annually.</p>
          </div>
          <div className="absolute top-8 right-8 flex gap-2">
             <div className="glass-card px-4 py-2 flex items-center gap-2">
               <Activity className="w-4 h-4 text-primary" />
               <span className="text-xs font-bold uppercase tracking-widest">Efficiency: 94.2%</span>
             </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Activity />} label="Total Reports" value={stats?.total_reports || '0'} trend="+12.5%" color="primary" />
          <StatCard icon={<AlertTriangle />} label="Active Hotspots" value={stats?.active_hotspots || '0'} trend="+2 New" trendColor="text-red-400" color="accent" />
          <StatCard icon={<CheckCircle2 />} label="Cleanup Rate" value={`${stats?.cleanup_success_rate || '0'}%`} trend="+4.2%" color="emerald" />
          <StatCard icon={<Calculator />} label="Savings (INR)" value={stats ? `₹${(stats.total_savings/1000).toFixed(0)}K` : '0'} trend="Optimized" color="blue" />
        </div>

        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 glass-card p-8 min-h-[550px] flex flex-col relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div>
                <h3 className="text-2xl font-black flex items-center gap-3">
                   Digital Twin: Hyderabad
                   <div className="flex gap-1.5 ml-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-150" />
                   </div>
                </h3>
                <p className="text-xs text-slate-500 mt-1 uppercase font-black tracking-widest">Real-time geospatial monitoring</p>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-slate-900/80 border border-white/5 rounded-xl flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                   <span className="text-[10px] font-black uppercase text-slate-400">Critical</span>
                </div>
                <div className="px-4 py-2 bg-slate-900/80 border border-white/5 rounded-xl flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                   <span className="text-[10px] font-black uppercase text-slate-400">Warning</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative z-10">
              <DigitalTwinMap hotspots={hotspots} />
            </div>
            {/* Background Texture for Map Container */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <Navigation className="w-32 h-32 rotate-12" />
            </div>
          </motion.div>

          {/* AI Tools & Side Panel */}
          <div className="flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 p-6 text-primary/20 transform group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-16 h-16" />
              </div>
              
              <h3 className="text-xl font-black mb-2 flex items-center gap-2 relative z-10">
                AI Waste Classifier
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">v4.2</span>
              </h3>
              <p className="text-xs text-slate-500 mb-6 relative z-10">Neural analysis for automatic waste identification.</p>
              
              <div 
                onClick={handleClassify}
                className="relative border-2 border-dashed border-white/10 rounded-[2rem] h-44 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isClassifying ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-primary animate-spin" />
                        <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Analyzing Pixels...</p>
                    </motion.div>
                  ) : classificationResult ? (
                    <motion.div 
                      key="result"
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="text-center p-4 bg-primary/10 w-full h-full flex flex-col items-center justify-center"
                    >
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3">
                         <Trash2 className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-xl font-black text-primary uppercase italic">{classificationResult.waste_type}</h4>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">CONFIDENCE: {classificationResult.confidence * 100}%</p>
                      <button className="mt-4 text-[10px] font-black text-slate-300 hover:text-white underline">Re-scan Image</button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="prompt"
                      className="flex flex-col items-center gap-3"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=200" 
                        className="w-16 h-16 rounded-2xl object-cover mb-1 opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                        alt="Sample"
                      />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-primary transition-colors text-center">
                        Upload Cleanup Evidence<br/><span className="text-[8px] font-medium tracking-normal">(Click to simulate scan)</span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 flex-1"
            >
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-xl font-black flex items-center gap-2">
                     Garbage Weather
                     <TrendingUp className="w-5 h-5 text-accent" />
                   </h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">7-Day Dumping Probability</p>
                 </div>
                 <div className="p-2 bg-accent/10 rounded-xl">
                   <Info className="w-4 h-4 text-accent" />
                 </div>
              </div>
              <ForecastChart data={forecast} />
              <div className="mt-6 p-4 bg-slate-900/80 border border-white/5 rounded-2xl flex justify-between items-center">
                <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase">Current Risk Peak</p>
                   <p className="text-sm font-black text-accent italic uppercase">Friday Evening</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-500 uppercase">Probability</p>
                   <p className="text-sm font-black text-white italic uppercase">92.4%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Area Leaderboard & Activity */}
        <div className="grid grid-cols-3 gap-8">
           <div className="col-span-1 glass-card p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 underline decoration-primary decoration-4 underline-offset-8">
                Cleanliness Index
              </h3>
              <div className="space-y-6">
                 <LeaderboardItem rank={1} name="Banjara Hills" score={92.4} trend="up" />
                 <LeaderboardItem rank={2} name="Jubilee Hills" score={88.1} trend="stable" />
                 <LeaderboardItem rank={3} name="HITEC City" score={85.6} trend="up" />
                 <LeaderboardItem rank={4} name="Gachibowli" score={72.4} trend="down" />
              </div>
           </div>

           <div className="col-span-2 glass-card p-8 overflow-hidden relative">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Live Activity Stream</h3>
                <button className="text-xs font-black text-primary uppercase tracking-[0.2em] hover:opacity-80">Export Logs</button>
              </div>
              <div className="space-y-4">
                <FeedItem time="2 mins ago" area="Banjara Hills" action="AI Prediction: Debris Runoff Alert" status="risk" />
                <FeedItem time="14 mins ago" area="Gachibowli" action="Autonomous Cleanup Verified" status="success" />
                <FeedItem time="45 mins ago" area="Charminar" action="Construction Debris Detected" status="danger" />
                <FeedItem time="1 hour ago" area="Ameerpet" action="New Hotspot Intelligence Generated" status="risk" />
              </div>
              {/* Artistic Overlay */}
              <div className="absolute bottom-0 right-0 p-10 opacity-5">
                 <Activity className="w-48 h-48" />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const NavButton = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_4px_20px_rgba(16,185,129,0.1)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
  >
    <div className={`${active ? 'text-primary' : 'text-slate-600 group-hover:text-slate-400'} transition-colors`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <span className="font-black text-sm uppercase tracking-widest">{label}</span>
  </button>
);

const StatCard = ({ icon, label, value, trend, color, trendColor = "text-emerald-400" }: any) => {
  const colors: any = {
    primary: "from-primary/20 to-emerald-500/5 border-primary/20 text-primary",
    accent: "from-accent/20 to-amber-500/5 border-accent/20 text-accent",
    emerald: "from-emerald-500/20 to-green-500/5 border-emerald-500/20 text-emerald-400",
    blue: "from-blue-500/20 to-cyan-500/5 border-blue-500/20 text-blue-400"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`glass-card p-6 bg-gradient-to-br ${colors[color]} border-2 transition-all duration-300 overflow-hidden relative group`}
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="p-3 bg-slate-950/50 rounded-2xl border border-white/5 group-hover:border-white/20 transition-colors">{icon}</div>
        <div className={`px-2 py-1 rounded-lg bg-slate-950/50 text-[10px] font-black uppercase tracking-tighter ${trendColor}`}>{trend}</div>
      </div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] relative z-10">{label}</p>
      <p className="text-3xl font-black mt-2 text-white relative z-10 tracking-tight">{value}</p>
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
         {icon && React.cloneElement(icon, { size: 100 })}
      </div>
    </motion.div>
  );
};

const LeaderboardItem = ({ rank, name, score, trend }: any) => (
  <div className="flex items-center gap-4 group cursor-pointer">
     <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${rank === 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-900 border border-white/10 text-slate-500'}`}>
        {rank}
     </div>
     <div className="flex-1">
        <p className="text-sm font-black group-hover:text-primary transition-colors">{name}</p>
        <div className="w-full h-1 bg-slate-900 rounded-full mt-2 overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${score}%` }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className={`h-full ${score > 85 ? 'bg-primary' : score > 70 ? 'bg-accent' : 'bg-red-500'}`}
           />
        </div>
     </div>
     <div className="text-right">
        <p className="text-xs font-black text-white">{score}</p>
        <p className={`text-[10px] font-black uppercase ${trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-red-500' : 'text-slate-500'}`}>
           {trend === 'up' ? '▲ High' : trend === 'down' ? '▼ Low' : '• Stable'}
        </p>
     </div>
  </div>
);

const FeedItem = ({ time, area, action, status }: any) => (
  <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-950/40 border border-white/5 hover:border-white/20 hover:bg-slate-950/60 transition-all group">
    <div className="flex items-center gap-5">
      <div className={`w-3 h-3 rounded-full ${status === 'risk' ? 'bg-accent shadow-[0_0_10px_rgba(245,158,11,0.5)]' : status === 'success' ? 'bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'} group-hover:scale-125 transition-transform`} />
      <div>
        <div className="flex items-center gap-2">
           <p className="font-black text-sm tracking-tight text-slate-200 uppercase italic">{area}</p>
           <span className="w-1 h-1 rounded-full bg-slate-700" />
           <p className="text-[10px] font-bold text-slate-500">{time}</p>
        </div>
        <p className="text-xs font-medium text-slate-400 mt-1">{action}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
       <button className="px-4 py-2 bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">Details</button>
       <Info className="w-5 h-5 text-slate-700 group-hover:text-primary transition-colors cursor-pointer" />
    </div>
  </div>
);

export default App;
