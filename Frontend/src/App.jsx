import { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import Dashboard from './pages/Dashboard';
import ParticleBackground from './components/ParticleBackground';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="h-screen w-screen bg-gray-950 text-white flex flex-col overflow-hidden relative">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Navigation */}
      <nav className="glass border-b border-gray-800/30 px-6 py-3 flex items-center justify-between flex-shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg shadow-lg shadow-cyan-500/25 animate-float">
            🛡️
          </div>
          <div>
            <h1 className="text-base font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Firewall
            </h1>
            <p className="text-[10px] text-gray-500 font-medium">LLM Security Gateway v1.0</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 glass rounded-xl p-1 border border-gray-800/20">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📊 Dashboard
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4">
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2 border border-gray-800/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[11px] text-gray-400 font-medium">All Systems Active</span>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex-1 overflow-hidden z-10 relative">
        {activeTab === 'chat' ? <ChatWindow /> : <Dashboard />}
      </main>
    </div>
  );
}

export default App;