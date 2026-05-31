import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ForecastData } from '../../types';

interface Props {
  data: ForecastData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-emerald-500/20">
        <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
        <p className="text-sm font-black text-emerald-500">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const ForecastTab: React.FC<Props> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Risk Cards */}
      <div className="grid grid-cols-3 gap-3">
        <ForecastCard
          label="Today"
          value={data.today_risk}
          icon={<Calendar className="w-4 h-4" />}
          color="emerald"
        />
        <ForecastCard
          label="3 Day"
          value={data.three_day_risk}
          icon={<TrendingUp className="w-4 h-4" />}
          color="amber"
        />
        <ForecastCard
          label="7 Day"
          value={data.seven_day_risk}
          icon={<AlertTriangle className="w-4 h-4" />}
          color="red"
        />
      </div>

      {/* Trend Chart */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Risk Trend</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-500">{data.confidence}% Confidence</span>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="day"
                stroke="#475569"
                fontSize={9}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#475569"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="risk"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#forecastGradient)"
                dot={{ r: 3, fill: '#10B981', stroke: '#020617', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className={`flex items-center gap-2 ${data.seven_day_risk > data.today_risk ? 'text-red-400' : 'text-emerald-400'}`}>
          <TrendingUp className={`w-4 h-4 ${data.seven_day_risk <= data.today_risk ? 'rotate-180' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-wider">
            {data.seven_day_risk > data.today_risk ? 'Risk Increasing' : 'Risk Decreasing'}
          </span>
        </div>
        <div className="flex-1" />
        <span className="text-[10px] font-black text-slate-500">
          {data.today_risk}% → {data.seven_day_risk}%
        </span>
      </div>
    </motion.div>
  );
};

const ForecastCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, icon, color }) => {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className={`glass-card p-4 border ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`${colorMap[color].split(' ')[0]}`}>{icon}</div>
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-xl font-black ${colorMap[color].split(' ')[0]} italic`}>{value}%</p>
    </div>
  );
};

export default ForecastTab;
