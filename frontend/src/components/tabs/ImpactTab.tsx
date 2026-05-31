import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Truck, Users, Leaf, Calendar } from 'lucide-react';
import type { ImpactData } from '../../types';

interface Props {
  data: ImpactData;
}

const ImpactTab: React.FC<Props> = ({ data }) => {
  const costCards = [
    { label: 'Labor Cost', value: `₹${data.labor_cost.toLocaleString()}`, icon: <Users className="w-4 h-4" />, color: 'text-blue-500' },
    { label: 'Transport Cost', value: `₹${data.transport_cost.toLocaleString()}`, icon: <Truck className="w-4 h-4" />, color: 'text-amber-500' },
    { label: 'Cleanup Cost', value: `₹${data.cleanup_cost.toLocaleString()}`, icon: <DollarSign className="w-4 h-4" />, color: 'text-purple-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Total Cost Hero */}
      <div className="glass-card p-6 border border-emerald-500/20 text-center">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Total Cleanup Cost</p>
        <p className="text-4xl font-black text-emerald-500 italic">₹{data.total_cost.toLocaleString()}</p>
        <p className="text-[10px] text-slate-500 mt-2">Estimated total for complete remediation</p>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Cost Breakdown</p>
        {costCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 flex items-center gap-4 hover:border-white/10 transition-all duration-300"
          >
            <div className={`w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center ${card.color}`}>
              {card.icon}
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{card.label}</p>
              <p className="text-lg font-black text-white italic">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Waste Volume */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Waste Volume</p>
            <p className="text-xl font-black text-white italic">{data.estimated_waste_volume}</p>
          </div>
        </div>
      </div>

      {/* Environmental Risk */}
      <div className="glass-card p-5 border border-red-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Environmental Risk</p>
            <p className="text-lg font-black text-red-400 uppercase italic mt-1">{data.environmental_risk}</p>
          </div>
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      {/* Monthly Impact */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Monthly Impact Estimate</p>
            <p className="text-lg font-black text-white italic">{data.monthly_impact}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImpactTab;
