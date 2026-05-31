import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingDown, DollarSign } from 'lucide-react';
import type { Recommendation } from '../../types';

interface Props {
  recommendations: Recommendation[];
}

const priorityColors: Record<string, string> = {
  high: 'text-red-400 border-red-500/30 bg-red-500/10',
  medium: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  low: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
};

const RecommendationsTab: React.FC<Props> = ({ recommendations }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">AI Recommendations</p>
          <p className="text-[9px] text-slate-500">{recommendations.length} suggestions generated</p>
        </div>
      </div>

      {recommendations.map((rec, index) => (
        <motion.div
          key={rec.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-5 hover:border-emerald-500/20 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-sm">
                {rec.icon}
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">{rec.title}</h4>
                <span className={`inline-block mt-1 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border rounded-sm ${priorityColors[rec.priority]}`}>
                  {rec.priority} priority
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed mb-4">{rec.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase">Risk Reduction</p>
                <p className="text-[11px] font-black text-emerald-500">{rec.risk_reduction}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded">
              <DollarSign className="w-3.5 h-3.5 text-blue-500" />
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase">Cost Savings</p>
                <p className="text-[11px] font-black text-blue-500">₹{rec.cost_savings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RecommendationsTab;
