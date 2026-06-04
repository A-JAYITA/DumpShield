import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  TrendingUp,
  BarChart3,
  Lightbulb,
  ShieldCheck,
  Zap,
  X,
} from 'lucide-react';
import OverviewTab from './tabs/OverviewTab';
import ForecastTab from './tabs/ForecastTab';
import ImpactTab from './tabs/ImpactTab';
import RecommendationsTab from './tabs/RecommendationsTab';
import VerificationTab from './tabs/VerificationTab';
import ActivityTimeline from './ActivityTimeline';
import { getVerificationData } from '../data/verificationData';
import type {
  Hotspot,
  AreaDetails,
  ForecastData,
  ImpactData,
  Recommendation,
  VerificationData,
  TimelineEvent,
} from '../types';

interface Props {
  spot: Hotspot;
  onClose: () => void;
}

const defaultAreaDetails: AreaDetails = {
  area_name: '',
  cleanliness_score: 0,
  garbage_concentration: 0,
  risk_score: 0,
  risk_category: 'Medium',
  active_dump_sites: 0,
  dominant_waste_type: 'Mixed Waste',
  last_updated: 'Just now',
};

const defaultForecast: ForecastData = {
  today_risk: 0,
  three_day_risk: 0,
  seven_day_risk: 0,
  confidence: 87,
  trend: [
    { day: 'Mon', risk: 45 },
    { day: 'Tue', risk: 52 },
    { day: 'Wed', risk: 48 },
    { day: 'Thu', risk: 61 },
    { day: 'Fri', risk: 55 },
    { day: 'Sat', risk: 70 },
    { day: 'Sun', risk: 65 },
  ],
};

const defaultImpact: ImpactData = {
  estimated_waste_volume: '2.4 tonnes',
  labor_cost: 15000,
  transport_cost: 8500,
  cleanup_cost: 22000,
  total_cost: 45500,
  environmental_risk: 'High',
  monthly_impact: '180 kg/month',
};

const defaultRecommendations: Recommendation[] = [
 {
   id: 1,
    title: 'Install Additional Bins',
    description: 'Deploy 3 smart waste bins at strategic locations to reduce illegal dumping by 40%.',
    risk_reduction: 35,
    cost_savings: 12000,
    priority: 'high',
    icon: '🗑️',
  },
 {
    id: 2,
    title: 'Increase Collection Frequency',
    description: 'Upgrade from weekly to bi-weekly collection schedule for this zone.',
    risk_reduction: 25,
    cost_savings: 8000,
    priority: 'medium',
    icon: '📅',
  },
  {
    id: 3,
    title: 'Monitor Vacant Land',
    description: 'Install surveillance cameras on adjacent vacant plots to deter dumping.',
    risk_reduction: 40,
    cost_savings: 15000,
    priority: 'high',
    icon: '📹',
  },
  {
    id: 4,
    title: 'Awareness Campaign',
    description: 'Launch community awareness program targeting local residents.',
    risk_reduction: 15,
    cost_savings: 5000,
    priority: 'low',
    icon: '📢',
  },
];

/*const defaultVerification: VerificationData = {
  area_name: '',
  before_image: '',
  after_image: '',
  cleanup_success: 87,
  verification_status: 'Pending',
  cleanup_date: '2026-05-28',
  risk_before: 75,
  risk_after: 30,
  waste_type: 'Mixed Waste',
  dump_site_status: 'Dumping Detected',
  waste_removed: '1.5 Tons',
  cost_savings: 20000,
  environmental_recovery: 80,
  timeline: [
    { date: 'May 12', title: 'Illegal Dumping Detected', type: 'detection' },
    { date: 'May 13', title: 'Risk Analysis Completed', type: 'analysis' },
    { date: 'May 15', title: 'Cleanup Assigned', type: 'assignment' },
    { date: 'May 18', title: 'Cleanup Completed', type: 'cleanup' },
    { date: 'May 19', title: 'Verification Approved', type: 'verification' },
  ],
};*/

const defaultTimeline: TimelineEvent[] = [
  { id: 1, date: 'May 12', title: 'Illegal Dumping Detected', type: 'dumping' },
  { id: 2, date: 'May 14', title: 'Risk Level Increased to High', type: 'risk' },
  { id: 3, date: 'May 15', title: 'AI Recommendations Generated', type: 'recommendation' },
  { id: 4, date: 'May 18', title: 'Cleanup Crew Dispatched', type: 'cleanup' },
  { id: 5, date: 'May 20', title: 'Verification Pending', type: 'alert' },
];

function getRiskCategory(score: number): string {
  if (score >= 0.7) return 'High';
  if (score >= 0.4) return 'Medium';
  return 'Low';
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'forecast', label: 'Forecast', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'impact', label: 'Impact', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: 'recommendations', label: 'Recommendations', icon: <Lightbulb className="w-3.5 h-3.5" /> },
  { id: 'verification', label: 'Verification', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
];

const IntelligencePanel: React.FC<Props> = ({ spot, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const areaDetails: AreaDetails = {
    ...defaultAreaDetails,
    area_name: spot.name,
    cleanliness_score: Math.round(100 - spot.garbage_percentage),
    garbage_concentration: spot.garbage_percentage,
    risk_score: spot.risk_score,
    risk_category: getRiskCategory(spot.risk_score),
    active_dump_sites: Math.max(1, Math.round(spot.risk_score * 5)),
    dominant_waste_type: spot.severity === 'critical' ? 'Hazardous Waste' : 'Mixed Waste',
  };

  const forecast: ForecastData = {
    ...defaultForecast,
    today_risk: Math.round(spot.risk_score * 100),
    three_day_risk: Math.min(100, Math.round(spot.risk_score * 115)),
    seven_day_risk: Math.min(100, Math.round(spot.risk_score * 130)),
    trend: defaultForecast.trend.map((t, i) => ({
      ...t,
      risk: Math.round(spot.risk_score * 100 + (i * 5) - 10 + Math.random() * 10),
    })),
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col bg-slate-950/80 border border-white/5 backdrop-blur-xl overflow-hidden"
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Area Intelligence</p>
            <p className="text-[8px] text-slate-500">Probe Active</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 shrink-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-[8px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            <span className="hidden xl:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OverviewTab data={areaDetails} />
            </motion.div>
          )}
          {activeTab === 'forecast' && (
            <motion.div key="forecast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ForecastTab data={forecast} />
            </motion.div>
          )}
          {activeTab === 'impact' && (
            <motion.div key="impact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ImpactTab data={defaultImpact} />
            </motion.div>
          )}
          {activeTab === 'recommendations' && (
            <motion.div key="recommendations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RecommendationsTab recommendations={defaultRecommendations} />
            </motion.div>
          )}
          {activeTab === 'verification' && (
            <motion.div key="verification" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <VerificationTab data={getVerificationData(spot.name)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline at bottom */}
        <ActivityTimeline events={defaultTimeline} />
      </div>
    </motion.div>
  );
};

export default IntelligencePanel;
