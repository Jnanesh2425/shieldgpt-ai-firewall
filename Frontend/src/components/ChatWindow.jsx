import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import PromptInput from './PromptInput';
import { sendPrompt } from '../services/api';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🛡️ Welcome to AI Firewall!\n\nI analyze every prompt for jailbreak and prompt injection attacks in real-time using DistilBERT AI classification.\n\n🟢 Safe prompts → Forwarded to LLM\n🟡 Suspicious prompts → Sanitized before forwarding\n🔴 Malicious prompts → Blocked entirely\n\nClick the 🎯 button below to try pre-built attack simulations!',
      meta: null,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [attackAlert, setAttackAlert] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Flash red alert on attack
  useEffect(() => {
    if (attackAlert) {
      const timer = setTimeout(() => setAttackAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [attackAlert]);

  const handleSend = async (prompt) => {
    setMessages((prev) => [...prev, { role: 'user', content: prompt, meta: null }]);
    setIsLoading(true);

    try {
      const result = await sendPrompt(prompt);

      // Trigger alert for blocked/sanitized
      if (result.action === 'BLOCKED') {
        setAttackAlert({ type: 'BLOCKED', message: '🚨 ATTACK BLOCKED! Jailbreak attempt detected.' });
      } else if (result.action === 'SANITIZED') {
        setAttackAlert({ type: 'SANITIZED', message: '⚠️ Suspicious prompt detected. Response sanitized.' });
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.response,
          meta: {
            label: result.label,
            riskScore: result.riskScore,
            action: result.action,
            confidence: result.confidence,
            createdAt: result.createdAt,
          },
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Error: Could not reach the AI Firewall backend. Make sure all services are running.',
          meta: null,
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Attack Alert Banner */}
      {attackAlert && (
        <div
          className={`absolute top-0 left-0 right-0 z-50 px-4 py-3 text-center text-sm font-bold animate-fade-in-down ${
            attackAlert.type === 'BLOCKED'
              ? 'bg-red-500/20 text-red-400 border-b border-red-500/30'
              : 'bg-yellow-500/20 text-yellow-400 border-b border-yellow-500/30'
          }`}
        >
          {attackAlert.message}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-800/30 glass px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg shadow-lg shadow-cyan-500/20 animate-float">
              🛡️
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">AI Firewall — Live Chat</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-gray-500">DistilBERT Classification • Real-time Protection</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
            <span className="text-[10px] text-gray-400">{messages.filter(m => m.role === 'user').length} prompts analyzed</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1 cyber-grid">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-5 animate-fade-in-up">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm flex-shrink-0 mr-3 shadow-lg shadow-emerald-500/20">
              🛡️
            </div>
            <div className="glass rounded-2xl rounded-bl-md px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-gray-400">Scanning with AI Firewall...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <PromptInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;