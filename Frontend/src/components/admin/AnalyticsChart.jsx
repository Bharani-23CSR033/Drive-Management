// src/components/admin/AnalyticsChart.jsx

import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, LineChart,
  Line, AreaChart, Area,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-[#111827] dark:text-[#E6F4F1] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export const BarChartWidget = ({ data, dataKeys, height = 200, title, subtitle }) => (
  <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
    {title && (
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{title}</p>
        {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>
    )}
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barSize={16} barGap={4}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {dataKeys.map((dk) => (
          <Bar key={dk.key} dataKey={dk.key} fill={dk.color || '#004643'} radius={[4, 4, 0, 0]} name={dk.name || dk.key} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const LineChartWidget = ({ data, dataKeys, height = 200, title, subtitle }) => (
  <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
    {title && (
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{title}</p>
        {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>
    )}
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {dataKeys.map((dk) => (
          <Line key={dk.key} type="monotone" dataKey={dk.key} stroke={dk.color || '#004643'} strokeWidth={2} dot={false} name={dk.name || dk.key} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const AreaChartWidget = ({ data, dataKeys, height = 200, title, subtitle }) => (
  <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
    {title && (
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{title}</p>
        {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>
    )}
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          {dataKeys.map((dk) => (
            <linearGradient key={dk.key} id={`grad-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={dk.color || '#004643'} stopOpacity={0.2} />
              <stop offset="95%" stopColor={dk.color || '#004643'} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {dataKeys.map((dk) => (
          <Area
            key={dk.key}
            type="monotone"
            dataKey={dk.key}
            stroke={dk.color || '#004643'}
            strokeWidth={2}
            fill={`url(#grad-${dk.key})`}
            name={dk.name || dk.key}
            dot={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  </div>
);