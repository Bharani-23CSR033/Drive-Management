// src/components/student/StatsCard.jsx

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MiniBar = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: i === data.length - 1 ? 1 : 0.35,
          }}
          className="w-1.5 rounded-sm"
        />
      ))}
    </div>
  );
};

const StatsCard = ({ label, value, trend, trendUp = true, pct, spark, color, sub }) => {
  return (
    <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
      <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/60 font-medium">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-[#111827] dark:text-[#E6F4F1]">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            {trendUp
              ? <TrendingUp size={12} style={{ color }} />
              : <TrendingDown size={12} className="text-red-500" />
            }
            <span className="text-xs font-semibold" style={{ color: trendUp ? color : '#EF4444' }}>
              {trend} {pct && `(${pct})`}
            </span>
          </div>
        </div>
        {spark && <MiniBar data={spark} color={color} />}
      </div>
      {sub && <p className="text-xs text-[#6B7280] dark:text-[#E6F4F1]/40">{sub}</p>}
    </div>
  );
};

export default StatsCard;






