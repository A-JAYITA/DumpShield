import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, MapPin, Clock, Zap } from 'lucide-react';
import type { AreaDetails } from '../../types';

interface Props {
  data: AreaDetails;
}

function getRiskColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'high': return 'text-red-400 border-red-500/30 bg-red-500/10';
    case 'medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    default: return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  }
}

const OverviewTab: React.FC<Props> = ({ data }) => {
  const cards = [
    { label: 'Cleanliness Score', value: `${data.cleanliness_score}/100`, icon: <Zap className="w-4 h-4" />, color: 'text-blue-500' },
    { label: 'Garbage Concentration', value: `${data.garbage_concentration}%`, icon: <Trash2 className="w-4 h-4" />, color: 'text-amber-500' },
    { label: 'Risk Score', value: `${(data.risk_score * 100).toFixed(0)}%`, icon: <MapPin className="w-4 h-4" />, color: 'text-red-500' },
    { label: 'Active Dump Sites', value: String(data.active_dump_sites), icon: <Trash2 className="w-4 h-4" />, color: 'text-purple-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Area Header */}
      <div className="glass-card p-5 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Area Intelligence</p>
          <span className="px-2 py-1 text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            Live
          </span>
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight italic mb-1">{data.area_name}</h3>
        <div className="flex items-center gap-2 text-[9px] text-slate-500">
          <Clock className="w-3 h-3" />
          <span>Updated {data.last_updated}</span>
        </div>
      </div>

      {/* Risk Category */}
      <div className={`glass-card p-4 border ${getRiskColor(data.risk_category)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Risk Category</p>
            <p className="text-lg font-black uppercase italic mt-1">{data.risk_category} Risk</p>
          </div>
          <div className="text-3xl font-black italic opacity-20">{(data.risk_score * 100).toFixed(0)}%</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-4 hover:border-white/10 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`${card.color}`}>{card.icon}</div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{card.label}</span>
            </div>
            <p className="text-lg font-black text-white italic">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Dominant Waste */}
      <div className="glass-card p-4">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Dominant Waste Type</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-black text-white uppercase italic">{data.dominant_waste_type}</p>
            <p className="text-[9px] text-slate-500">Primary waste classification</p>
          </div>
        </div>
      </div>

      {/* Garbage Concentration Bar */}
      <div className="glass-card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Garbage Concentration</span>
          <span className="text-sm font-black text-white italic">{data.garbage_concentration}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.garbage_concentration}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, #10B981, ${data.garbage_concentration > 70 ? '#ef4444' : data.garbage_concentration > 40 ? '#f97316' : '#10B981'})`,
              boxShadow: '0 0 15px rgba(16,185,129,0.3)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
