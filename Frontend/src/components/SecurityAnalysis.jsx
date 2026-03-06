import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const layers = [
  {
    id: 1,
    name: 'Input Validation',
    description: 'Checking prompt structure and format...',
    icon: '📝',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    name: 'Keyword Detection',
    description: 'Scanning for harmful keywords and patterns...',
    icon: '🔍',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    id: 3,
    name: 'DistilBERT Classification',
    description: 'Running AI model for deep analysis...',
    icon: '🧠',
    color: 'from-teal-500 to-green-500',
  },
  {
    id: 4,
    name: 'Threat Assessment',
    description: 'Calculating risk score and confidence...',
    icon: '⚡',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 5,
    name: 'Final Decision',
    description: 'Determining action: Allow, Sanitize, or Block...',
    icon: '🛡️',
    color: 'from-emerald-500 to-green-400',
  },
];

const SecurityAnalysis = ({ isAnalyzing, result, onComplete }) => {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [completedLayers, setCompletedLayers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentLayer(0);
      setCompletedLayers([]);
      setShowResult(false);
      return;
    }

    // Generate particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 2,
    }));
    setParticles(newParticles);

    // Animate through layers
    const layerDuration = 800; // ms per layer
    let layer = 0;

    const interval = setInterval(() => {
      layer++;
      if (layer < layers.length) {
        setCurrentLayer(layer);
        setCompletedLayers((prev) => [...prev, layer - 1]);
      } else {
        setCompletedLayers((prev) => [...prev, layer - 1]);
        clearInterval(interval);

        // Show result after short delay
        setTimeout(() => {
          setShowResult(true);
          // Notify parent after showing result
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 1500);
        }, 500);
      }
    }, layerDuration);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing && !showResult) return null;

  const getResultColor = () => {
    if (!result) return 'text-gray-400';
    switch (result.action) {
      case 'ALLOWED':
        return 'text-green-400';
      case 'SANITIZED':
        return 'text-yellow-400';
      case 'BLOCKED':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getResultBg = () => {
    if (!result) return 'from-gray-600/20 to-gray-700/20';
    switch (result.action) {
      case 'ALLOWED':
        return 'from-green-600/20 to-green-700/20';
      case 'SANITIZED':
        return 'from-yellow-600/20 to-yellow-700/20';
      case 'BLOCKED':
        return 'from-red-600/20 to-red-700/20';
      default:
        return 'from-gray-600/20 to-gray-700/20';
    }
  };

  const getResultBorder = () => {
    if (!result) return 'border-gray-600';
    switch (result.action) {
      case 'ALLOWED':
        return 'border-green-500/50';
      case 'SANITIZED':
        return 'border-yellow-500/50';
      case 'BLOCKED':
        return 'border-red-500/50';
      default:
        return 'border-gray-600';
    }
  };

  const getResultIcon = () => {
    if (!result) return '⏳';
    switch (result.action) {
      case 'ALLOWED':
        return '✅';
      case 'SANITIZED':
        return '⚠️';
      case 'BLOCKED':
        return '🚫';
      default:
        return '⏳';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto my-4"
    >
      {/* Main Analysis Container */}
      <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-700/50 flex items-center gap-3">
          <motion.div
            animate={{ rotate: isAnalyzing && !showResult ? 360 : 0 }}
            transition={{ duration: 2, repeat: isAnalyzing && !showResult ? Infinity : 0, ease: 'linear' }}
            className="text-2xl"
          >
            🛡️
          </motion.div>
          <div>
            <h3 className="text-white font-bold text-lg">AI Firewall Security Analysis</h3>
            <p className="text-gray-400 text-sm">
              {showResult ? 'Analysis Complete' : 'Scanning prompt through security layers...'}
            </p>
          </div>
          {!showResult && (
            <motion.div
              className="ml-auto flex gap-1"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            </motion.div>
          )}
        </div>

        {/* Layers */}
        <div className="relative px-6 py-4 space-y-3">
          {layers.map((layer, index) => {
            const isCompleted = completedLayers.includes(index);
            const isCurrent = currentLayer === index && !showResult;
            const isPending = !isCompleted && !isCurrent;

            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{
                  opacity: isPending ? 0.3 : 1,
                  x: 0,
                }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative"
              >
                <div
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-500 ${
                    isCurrent
                      ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : isCompleted
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-gray-700/30 bg-gray-800/30'
                  }`}
                >
                  {/* Status Icon */}
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-lg">
                    {isCompleted ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        ✅
                      </motion.span>
                    ) : isCurrent ? (
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        {layer.icon}
                      </motion.span>
                    ) : (
                      <span className="opacity-40">{layer.icon}</span>
                    )}
                  </div>

                  {/* Layer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-sm ${
                          isCurrent ? 'text-cyan-300' : isCompleted ? 'text-green-300' : 'text-gray-500'
                        }`}
                      >
                        Layer {layer.id}
                      </span>
                      <span
                        className={`font-medium ${
                          isCurrent ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      >
                        {layer.name}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isCurrent ? 'text-gray-300' : 'text-gray-500'}`}>
                      {layer.description}
                    </p>
                  </div>

                  {/* Progress indicator for current layer */}
                  {isCurrent && (
                    <motion.div className="flex-shrink-0 w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${layer.color} rounded-full`}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
                      />
                    </motion.div>
                  )}

                  {isCompleted && (
                    <span className="text-green-400 text-xs font-medium flex-shrink-0">Done</span>
                  )}
                </div>

                {/* Connection line */}
                {index < layers.length - 1 && (
                  <div className="absolute left-8 top-full w-0.5 h-3 -mt-0.5">
                    <motion.div
                      className={`w-full h-full rounded-full ${isCompleted ? 'bg-green-500/50' : 'bg-gray-700/50'}`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Result Section */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="px-6 pb-5"
            >
              <div className={`p-4 rounded-xl border ${getResultBorder()} bg-gradient-to-r ${getResultBg()} mt-2`}>
                <div className="flex items-center gap-3 mb-3">
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-3xl"
                  >
                    {getResultIcon()}
                  </motion.span>
                  <div>
                    <motion.h4
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-xl font-bold ${getResultColor()}`}
                    >
                      {result.action}
                    </motion.h4>
                    <p className="text-gray-400 text-sm">
                      Classification: <span className="text-white font-medium">{result.label}</span>
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${Math.round(result.confidence * 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>
                      <span className="text-white font-bold text-sm">{Math.round(result.confidence * 100)}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Risk Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            result.riskScore > 0.7
                              ? 'bg-gradient-to-r from-red-500 to-red-400'
                              : result.riskScore > 0.4
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                              : 'bg-gradient-to-r from-green-500 to-emerald-400'
                          }`}
                          initial={{ width: '0%' }}
                          animate={{ width: `${Math.round(result.riskScore * 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        />
                      </div>
                      <span className="text-white font-bold text-sm">{Math.round(result.riskScore * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* Action message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-gray-300 text-sm mt-3"
                >
                  {result.action === 'ALLOWED'
                    ? '✅ Prompt is safe. Forwarding to LLM for response...'
                    : result.action === 'SANITIZED'
                    ? '⚠️ Prompt sanitized. Forwarding cleaned version to LLM...'
                    : '🚫 Prompt blocked. This will NOT be sent to the LLM.'}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SecurityAnalysis;