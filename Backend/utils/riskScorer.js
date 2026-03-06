/**
 * Calculates a final risk score based on detection results
 * Combines model confidence with keyword-based heuristics
 */
const calculateRiskScore = (label, confidence) => {
  let baseScore = 0;

  // Base score from label
  switch (label) {
    case 'JAILBREAK':
      baseScore = 0.9;
      break;
    case 'PROMPT_INJECTION':
      baseScore = 0.8;
      break;
    case 'SAFE':
      baseScore = 0.1;
      break;
    default:
      baseScore = 0.5;
  }

  // Weighted combination: 60% model confidence + 40% base label score
  const finalScore = (confidence * 0.6) + (baseScore * 0.4);

  return Math.min(Math.round(finalScore * 100) / 100, 1.0);
};

/**
 * Determines action based on risk score
 * > 0.7 → BLOCKED
 * 0.4 - 0.7 → SANITIZED
 * < 0.4 → ALLOWED
 */
const getAction = (riskScore) => {
  if (riskScore > 0.7) return 'BLOCKED';
  if (riskScore >= 0.4) return 'SANITIZED';
  return 'ALLOWED';
};

module.exports = { calculateRiskScore, getAction };