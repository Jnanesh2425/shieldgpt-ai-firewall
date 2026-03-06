import { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards';
import AttackLogs from '../components/AttackLogs';
import ThreatChart from '../components/ThreatChart';
import { getStats, getLogs } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPrompts: 0,
    blockedAttacks: 0,
    sanitizedPrompts: 0,
    allowedPrompts: 0,
    jailbreakAttempts: 0,
    injectionAttempts: 0,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsData, logsData] = await Promise.all([getStats(), getLogs()]);
      setStats(statsData);
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full cyber-grid">
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 cyber-grid">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-down">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            📊 Security Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Real-time AI Firewall monitoring & analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2 border border-gray-800/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[11px] text-gray-400">Live Monitoring</span>
          </div>
          <button
            onClick={fetchData}
            className="glass border border-gray-800/20 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 hover:border-cyan-500/30"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Charts */}
      <ThreatChart stats={stats} logs={logs} />

      {/* Logs */}
      <AttackLogs logs={logs} />
    </div>
  );
};

export default Dashboard;