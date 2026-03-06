/**
 * Sanitizes potentially dangerous prompts
 * Removes common injection patterns while keeping the core question
 */
const sanitizePrompt = (prompt) => {
  let sanitized = prompt;

  // Remove common jailbreak/injection patterns
  const dangerousPatterns = [
    /ignore\s+(all\s+)?previous\s+instructions/gi,
    /ignore\s+(all\s+)?above\s+instructions/gi,
    /disregard\s+(all\s+)?previous/gi,
    /forget\s+(all\s+)?previous/gi,
    /act\s+as\s+an?\s+unrestricted/gi,
    /pretend\s+you\s+are/gi,
    /you\s+are\s+now/gi,
    /do\s+anything\s+now/gi,
    /bypass\s+(your\s+)?safety/gi,
    /reveal\s+(the\s+)?system\s+prompt/gi,
    /show\s+(me\s+)?(the\s+)?system\s+prompt/gi,
    /what\s+(is|are)\s+(your\s+)?system\s+prompt/gi,
    /override\s+(your\s+)?instructions/gi,
    /jailbreak/gi,
    /DAN\s+mode/gi,
  ];

  dangerousPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  return sanitized.trim();
};

module.exports = { sanitizePrompt };