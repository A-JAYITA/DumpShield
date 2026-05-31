import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2, TrendingUp, Lightbulb, CheckCircle2, Calendar } from 'lucide-react';
import type { TimelineEvent } from '../types';

interface Props {
  events: TimelineEvent[];
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  dumping: { icon: <AlertTriangle className="w-3 h-3" />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  risk: { icon: <TrendingUp className="w-3 h-3" />, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  recommendation: { icon: <Lightbulb className="w-3 h-3" />, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  cleanup: { icon: <Trash2 className="w-3 h-3" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  alert: { icon: <CheckCircle2 className="w-3 h-3" />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
};

const ActivityTimeline: React.FC<Props> = ({ events }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Area Activity Timeline</p>
          <p className="text-[9px] text-slate-500">Recent events and actions</p>
        </div>
      </div>

      <div className="relative pl-6">
        {/* Vertical Line */}
        <div className="absolute left-2 top-2 bottom-2 w-[1px] bg-gradient-to-b from-emerald-500/40 via-slate-700 to-transparent" />

        <div className="space-y-4">
          {events.map((event, index) => {
            const config = typeConfig[event.type] || typeConfig.alert;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Dot */}
                <div className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border ${config.bg} flex items-center justify-center`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                </div>

                <div className="glass-card p-3 hover:border-white/10 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${config.color}`}>
                      {event.date}
                    </span>
                    <span className={`px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest border rounded-sm ${config.bg} ${config.color}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{event.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
