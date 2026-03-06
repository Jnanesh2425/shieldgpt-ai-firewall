const AttackLogs = ({ logs }) => {
  const getBadgeStyle = (action) => {
    switch (action) {
      case 'BLOCKED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'SANITIZED': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'ALLOWED': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getLabelStyle = (label) => {
    switch (label) {
      case 'JAILBREAK': return 'text-red-400';
      case 'PROMPT_INJECTION': return 'text-yellow-400';
      case 'SAFE': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBar = (score) => {
    const percent = Math.round(score * 100);
    let color = '#00ff88';
    if (score > 0.7) color = '#ff0040';
    else if (score >= 0.4) color = '#ffaa00';

    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-[11px] font-mono" style={{ color }}>{percent}%</span>
      </div>
    );
  };

  const getConfidenceBadge = (confidence) => {
    const percent = Math.round((confidence || 0) * 100);
    let color = 'text-green-400';
    let bg = 'bg-green-500/10';
    if (percent < 60) { color = 'text-yellow-400'; bg = 'bg-yellow-500/10'; }
    if (percent < 40) { color = 'text-red-400'; bg = 'bg-red-500/10'; }

    return (
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${color} ${bg}`}>
        {percent}%
      </span>
    );
  };

  return (
    <div className="glass rounded-2xl overflow-hidden border border-gray-800/20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">📋</span>
          <div>
            <h3 className="text-white font-bold text-sm">Threat Detection Logs</h3>
            <p className="text-[10px] text-gray-500">Real-time monitoring history</p>
          </div>
        </div>
        <span className="text-[10px] text-gray-500 glass px-3 py-1.5 rounded-full">
          {logs.length} entries
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="text-gray-500 text-[10px] uppercase tracking-wider bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/30">
              <th className="text-left px-6 py-3 font-semibold">Prompt</th>
              <th className="text-left px-4 py-3 font-semibold">Classification</th>
              <th className="text-left px-4 py-3 font-semibold">Confidence</th>
              <th className="text-left px-4 py-3 font-semibold">Risk Level</th>
              <th className="text-left px-4 py-3 font-semibold">Action</th>
              <th className="text-left px-4 py-3 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-600 text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">🔍</span>
                    <p>No logs yet. Send a prompt to start monitoring!</p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr
                  key={log._id || i}
                  className="border-b border-gray-800/20 hover:bg-white/[0.02] transition-colors animate-slide-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-6 py-3.5 text-gray-300 max-w-[250px]">
                    <p className="truncate text-xs">{log.prompt}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`font-bold text-[11px] ${getLabelStyle(log.label)}`}>
                      {log.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {getConfidenceBadge(log.confidence)}
                  </td>
                  <td className="px-4 py-3.5">{getRiskBar(log.riskScore)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${getBadgeStyle(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 text-[11px]">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttackLogs;