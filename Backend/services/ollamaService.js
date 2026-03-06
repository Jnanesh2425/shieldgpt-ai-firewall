const axios = require('axios');

const generateResponse = async (prompt) => {
  try {
    // First check if Ollama is running
    await axios.get(`${process.env.OLLAMA_URL}`, { timeout: 3000 });

    const response = await axios.post(
      `${process.env.OLLAMA_URL}/api/generate`,
      {
        model: 'llama3',  // Change to your model: 'mistral', 'tinyllama', etc.
        prompt: prompt,
        stream: false,
      },
      { timeout: 60000 }
    );

    return response.data.response;
  } catch (error) {
    console.error('❌ Ollama Error:', error.message);
    throw new Error('Ollama not available');
  }
};

module.exports = { generateResponse };