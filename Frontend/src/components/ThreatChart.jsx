import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, LineChart, Line,
  CartesianGrid, Legend, Area, AreaChart
} from 'recharts';

const COLORS = {
  BLOCKED: '#ff0040',
  SANITIZED: '#ffaa00',
  ALLOWED: '#00ff88',
  JAILBREAK: '#ff4444',
  PROMPT_INJECTION: '#ffaa00',
  SAFE: '#00ff88',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 border border-gray-700/30 text-xs">
        <p className="text-white font-bold">{label || payload[0].name}</p>
        <p className="text-gray-400">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ThreatChart = ({ stats, logs }) => {
  // Pie chart data — Action distribution
  const actionData = [
    { name: 'Blocked', value: stats.blockedAttacks, color: COLORS.BLOCKED },
    { name: 'Sanitized', value: stats.sanitizedPrompts, color: COLORS.SANITIZED },
    { name: 'Allowed', value: stats.allowedPrompts, color: COLORS.ALLOWED },
  ].filter(d => d.value > 0);

  // Bar chart data — Threat types
  const threatData = [
    { name: 'Safe', count: stats.allowedPrompts, fill: COLORS.SAFE },
    { name: 'Jailbreak', count: stats.jailbreakAttempts, fill: COLORS.JAILBREAK },
    { name: 'Injection', count: stats.injectionAttempts, fill: COLORS.PROMPT_INJECTION },
  ];

  // Timeline data — Risk scores over time (from logs)
  const timelineData = [...logs].reverse().slice(-20).map((log, i) => ({
    name: `#${i + 1}`,
    risk: Math.round(log.riskScore * 100),
    time: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Pie Chart — Action Distribution */}
      <div className="glass rounded-2xl p-5 border border-gray-800/20 animate-fade-in-up">
        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
          🎯 Action Distribution
        </h3>
        <p className="text-[10px] text-gray-500 mb-4">How prompts were handled</p>
        {actionData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={actionData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {actionData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-gray-600 text-sm">No data yet</div>
        )}
        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2">
          {actionData.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-[10px] text-gray-400">{d.name} ({d.value})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart — Threat Types */}
      <div className="glass rounded-2xl p-5 border border-gray-800/20 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
          📊 Threat Classification
        </h3>
        <p className="text-[10px] text-gray-500 mb-4">Breakdown by type</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={threatData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {threatData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart — Risk Score Timeline */}
      <div className="glass rounded-2xl p-5 border border-gray-800/20 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
          📈 Risk Score Timeline
        </h3>
        <p className="text-[10px] text-gray-500 mb-4">Last 20 prompts</p>
        {timelineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="risk"
                stroke="#00d4ff"
                strokeWidth={2}
                fill="url(#riskGrad)"
                dot={{ r: 3, fill: '#00d4ff' }}
                activeDot={{ r: 5, fill: '#00d4ff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-gray-600 text-sm">No data yet</div>
        )}
      </div>
    </div>
  );
};

export default ThreatChart;