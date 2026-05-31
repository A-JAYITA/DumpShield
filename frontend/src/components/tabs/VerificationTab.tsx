import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Leaf,
  Trash2,
  ShieldCheck,
  Calendar,
  MapPin,
  Activity,
} from 'lucide-react';
import BeforeAfterSlider from '../BeforeAfterSlider';
import type { VerificationData } from '../../types';

interface Props {
  data: VerificationData;
}

const timelineTypeConfig: Record<string, { color: string; bg: string }> = {
  detection: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  analysis: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  assignment: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  cleanup: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  verification: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

const VerificationTab: React.FC<Props> = ({ data }) => {
  const isSuccess = data.verification_status === 'Verified';
  const isInProgress = data.verification_status === 'In Progress';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Before / After Comparison Slider */}
      <div className="glass-card overflow-hidden">
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Satellite Comparison</p>
          </div>
          <span className="text-[8px] font-black text-slate-500 uppercase">{data.area_name}</span>
        </div>
        <div className="p-2">
          <BeforeAfterSlider
            beforeImage={data.before_image}
            afterImage={data.after_image}
            beforeLabel="Before Cleanup"
            afterLabel="After Cleanup"
          />
        </div>
      </div>

      {/* Before Card */}
      <div className="glass-card overflow-hidden border-red-500/10">
        <div className="p-3 border-b border-white/5 bg-red-500/5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.3em]">Before Cleanup</p>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-black text-white italic">{data.area_name}</p>
              <p className="text-[8px] text-slate-500 uppercase">Pre-cleanup assessment</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-slate-800/30 rounded-lg">
              <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Risk Score</p>
              <p className="text-lg font-black text-red-400 italic">{data.risk_before}%</p>
            </div>
            <div className="p-2.5 bg-slate-800/30 rounded-lg">
              <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Waste Type</p>
              <p className="text-[10px] font-black text-white italic">{data.waste_type}</p>
            </div>
          </div>
          <div className="p-2.5 bg-red-500/5 border border-red-500/10 rounded-lg">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Status</p>
            <p className="text-[10px] font-black text-red-400 italic">{data.dump_site_status}</p>
          </div>
        </div>
      </div>

      {/* After Card */}
      <div className="glass-card overflow-hidden border-emerald-500/10">
        <div className="p-3 border-b border-white/5 bg-emerald-500/5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">After Cleanup</p>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black text-white italic">{data.area_name}</p>
              <p className="text-[8px] text-slate-500 uppercase">Post-cleanup verification</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-slate-800/30 rounded-lg">
              <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Risk Score</p>
              <p className="text-lg font-black text-emerald-400 italic">{data.risk_after}%</p>
            </div>
            <div className="p-2.5 bg-slate-800/30 rounded-lg">
              <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Status</p>
              <p className="text-[10px] font-black text-emerald-400 italic">Area Successfully Restored</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Analytics */}
      <div className="glass-card p-4">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Verification Analytics</p>

        {/* Cleanup Success Rate */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Cleanup Success Rate</span>
            <span className="text-lg font-black text-emerald-500 italic">{data.cleanup_success}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.cleanup_success}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, #10B981 0%, ${data.cleanup_success >= 80 ? '#22c55e' : '#f97316'} 100%)`,
                boxShadow: '0 0 15px rgba(16,185,129,0.4)',
              }}
            />
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Trash2 className="w-3 h-3 text-amber-500" />
              <p className="text-[8px] font-black text-slate-500 uppercase">Waste Removed</p>
            </div>
            <p className="text-sm font-black text-white italic">{data.waste_removed}</p>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3 h-3 text-emerald-500" />
              <p className="text-[8px] font-black text-slate-500 uppercase">Risk Reduction</p>
            </div>
            <p className="text-sm font-black text-white italic">
              <span className="text-red-400">{data.risk_before}%</span>
              <span className="text-slate-500 mx-1">→</span>
              <span className="text-emerald-400">{data.risk_after}%</span>
            </p>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3 h-3 text-blue-500" />
              <p className="text-[8px] font-black text-slate-500 uppercase">Cost Savings</p>
            </div>
            <p className="text-sm font-black text-white italic">₹{data.cost_savings.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-3 h-3 text-green-500" />
              <p className="text-[8px] font-black text-slate-500 uppercase">Env. Recovery</p>
            </div>
            <p className="text-sm font-black text-white italic">{data.environmental_recovery}%</p>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className={`glass-card p-4 border ${isSuccess ? 'border-emerald-500/20' : isInProgress ? 'border-amber-500/20' : 'border-blue-500/20'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSuccess ? 'bg-emerald-500/10 border border-emerald-500/20' : isInProgress ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-blue-500/10 border border-blue-500/20'}`}>
              {isSuccess ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : isInProgress ? <Activity className="w-4 h-4 text-amber-500" /> : <Calendar className="w-4 h-4 text-blue-500" />}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Verification Status</p>
              <p className={`text-sm font-black uppercase italic mt-0.5 ${isSuccess ? 'text-emerald-500' : isInProgress ? 'text-amber-500' : 'text-blue-500'}`}>
                {data.verification_status}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-500 uppercase">Cleanup Date</p>
            <p className="text-[10px] font-black text-white italic">{data.cleanup_date}</p>
          </div>
        </div>
      </div>

      {/* Verification Timeline */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Verification Timeline</p>
        </div>

        <div className="relative pl-5">
          {/* Vertical Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-emerald-500/40 via-slate-700 to-transparent" />

          <div className="space-y-3">
            {data.timeline.map((event, index) => {
              const config = timelineTypeConfig[event.type] || timelineTypeConfig.detection;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative"
                >
                  {/* Dot */}
                  <div className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border ${config.bg} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-black text-slate-500 uppercase w-12 shrink-0">{event.date}</span>
                    <div className="flex-1 p-2 bg-slate-800/20 rounded-lg border border-white/5">
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{event.title}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VerificationTab;
