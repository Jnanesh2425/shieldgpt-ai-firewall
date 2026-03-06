/**
 * Prompt Sanitizer Service
 * Rewrites borderline harmful prompts into safe educational versions
 * while preserving the user's educational intent.
 */

// Patterns: [trigger words] → [safe replacement context]
const sanitizationRules = [
  // Chemicals / Bombs / Explosives
  {
    triggers: ['bomb', 'bombs', 'explosive', 'explosives'],
    contexts: ['chemical', 'chemicals', 'list', 'ingredient', 'component', 'used in', 'what', 'harmful'],
    sanitized: (prompt) => 'List common chemicals studied in chemistry and their safety classifications',
  },
  {
    triggers: ['chemical', 'chemicals'],
    contexts: ['harmful', 'dangerous', 'toxic', 'lethal', 'deadly', 'bomb', 'poison', 'weapon', 'kill'],
    sanitized: (prompt) => 'What are commonly known hazardous chemicals and their safety precautions in a laboratory setting',
  },
  // Drugs
  {
    triggers: ['drug', 'drugs'],
    contexts: ['list', 'type', 'name', 'harmful', 'dangerous', 'illegal', 'what', 'example'],
    sanitized: (prompt) => 'What are the different categories of controlled substances and their medical classifications',
  },
  // Hacking / Cyber
  {
    triggers: ['hack', 'hacking'],
    contexts: ['type', 'what', 'example', 'method', 'technique', 'common', 'list'],
    sanitized: (prompt) => 'What are common cybersecurity threats and how do organizations defend against them',
  },
  {
    triggers: ['malware', 'virus', 'ransomware'],
    contexts: ['type', 'what', 'example', 'list', 'common', 'dangerous', 'harmful'],
    sanitized: (prompt) => 'What are the different types of cybersecurity threats and how does antivirus software protect against them',
  },
  // Attacks
  {
    triggers: ['attack', 'attacks'],
    contexts: ['type', 'example', 'list', 'common', 'cyber', 'method'],
    sanitized: (prompt) => 'What are common types of cybersecurity attacks and the best practices to prevent them',
  },
  // Poison
  {
    triggers: ['poison', 'poisonous'],
    contexts: ['list', 'type', 'what', 'example', 'plant', 'chemical', 'common'],
    sanitized: (prompt) => 'What are commonly known toxic substances in nature and how are they handled safely in research',
  },
  // Weapons
  {
    triggers: ['weapon', 'weapons'],
    contexts: ['chemical', 'type', 'list', 'category', 'what'],
    sanitized: (prompt) => 'What is the history of arms control treaties and international weapons regulations',
  },
  // Stealing / Theft
  {
    triggers: ['steal', 'theft', 'stealing'],
    contexts: ['type', 'method', 'common', 'what', 'example'],
    sanitized: (prompt) => 'What are common types of fraud and theft that cybersecurity professionals work to prevent',
  },
  // Substances
  {
    triggers: ['substance', 'substances'],
    contexts: ['harmful', 'dangerous', 'toxic', 'lethal', 'deadly', 'illegal', 'banned'],
    sanitized: (prompt) => 'What are the classifications of hazardous materials and how are they safely handled in industry',
  },
];

/**
 * Sanitize a prompt by rewriting harmful parts into safe educational versions
 * @param {string} prompt - The original user prompt
 * @returns {{ sanitized: string, wasModified: boolean, reason: string }}
 */
const sanitizePrompt = (prompt) => {
  const promptLower = prompt.toLowerCase().trim();

  for (const rule of sanitizationRules) {
    const hasTrigger = rule.triggers.some((t) => promptLower.includes(t));
    if (!hasTrigger) continue;

    const hasContext = rule.contexts.some((c) => promptLower.includes(c));
    if (!hasContext) continue;

    const sanitizedText = rule.sanitized(prompt);
    const matchedTrigger = rule.triggers.find((t) => promptLower.includes(t));
    const matchedContext = rule.contexts.find((c) => promptLower.includes(c));

    console.log(`🧹 SANITIZED: "${prompt}" → "${sanitizedText}"`);
    console.log(`   Trigger: "${matchedTrigger}" + Context: "${matchedContext}"`);

    return {
      sanitized: sanitizedText,
      wasModified: true,
      reason: `Detected potentially sensitive content ("${matchedTrigger}" + "${matchedContext}"). Prompt rewritten to focus on educational/safety aspects.`,
    };
  }

  // No match — return original (shouldn't happen if detection is correct)
  return {
    sanitized: prompt,
    wasModified: false,
    reason: 'No sanitization needed',
  };
};

module.exports = { sanitizePrompt };
