import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const LLMResponse = ({ response, isLoading, action }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!response) {
      setDisplayedText('');
      return;
    }

    setIsTyping(true);
    setDisplayedText('');

    let index = 0;
    const speed = 15; // ms per character

    const interval = setInterval(() => {
      if (index < response.length) {
        setDisplayedText(response.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [response]);

  if (!response && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto my-4"
    >
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700/50 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <div>
            <h3 className="text-white font-bold">LLM Response</h3>
            <p className="text-gray-400 text-xs">
              {action === 'BLOCKED'
                ? 'Request was blocked by AI Firewall'
                : 'Powered by Ollama • llama3'}
            </p>
          </div>
          {action !== 'BLOCKED' && (
            <div className="ml-auto flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="text-gray-400 text-xs">
                {isLoading ? 'Generating...' : 'Complete'}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isLoading ? (
            <div className="flex items-center gap-3">
              <motion.div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-purple-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.15,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>
              <span className="text-gray-400 text-sm">AI is thinking...</span>
            </div>
          ) : action === 'BLOCKED' ? (
            <div className="flex items-center gap-3 py-2">
              <span className="text-3xl">🚫</span>
              <div>
                <p className="text-red-400 font-semibold">Request Blocked</p>
                <p className="text-gray-400 text-sm mt-1">
                  This prompt was identified as malicious and was NOT forwarded to the LLM.
                  The AI Firewall has protected the system from this potential threat.
                </p>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="text-gray-200 leading-relaxed mb-3">{children}</p>,
                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  code: ({ children }) => (
                    <code className="bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm">{children}</code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto my-3">{children}</pre>
                  ),
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-gray-300">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-gray-300">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-300">{children}</li>,
                  h1: ({ children }) => <h1 className="text-white text-xl font-bold mt-4 mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-white text-lg font-bold mt-3 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-white text-base font-bold mt-2 mb-1">{children}</h3>,
                }}
              >
                {displayedText}
              </ReactMarkdown>
              {isTyping && (
                <motion.span
                  className="inline-block w-2 h-4 bg-purple-400 ml-0.5"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LLMResponse;