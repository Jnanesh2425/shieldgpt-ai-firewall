const axios = require('axios');

/**
 * Sends prompt to the Python BERT detection service
 * Returns label, confidence, and risk classification
 */
const detectPrompt = async (prompt) => {
  try {
    const response = await axios.post(
      `${process.env.DETECTION_SERVICE_URL}/detect`,
      { prompt },
      { timeout: 10000 }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Detection Service Error:', error.message);

    // Fallback: if detection service is down, treat as moderate risk
    return {
      label: 'SAFE',
      confidence: 0.5,
      riskScore: 0.3,
      error: 'Detection service unavailable - fallback used',
    };
  }
};

module.exports = { detectPrompt };